"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { EstadoPedido } from "@/generated/prisma/client";
import { checkoutSchema } from "@/schemas/checkout.schema";
import { calcularSubtotal, calcularEnvio } from "@/lib/carrito";
import { crearCargoCulqi } from "@/lib/culqi";
import { enviarEmailConfirmacionCliente, enviarEmailNotificacionAdmin } from "@/lib/resend";
import { generarNumeroOrden } from "@/lib/utils";
import type { ItemCarrito } from "@/stores/carrito.store";

type ResultadoCheckout = { ok: true; numeroOrden: string } | { ok: false; error: string };

class StockInsuficienteError extends Error {
  constructor(
    public productoId: string,
    public nombreProducto: string,
  ) {
    super(`Stock insuficiente para ${nombreProducto}`);
  }
}

export async function crearPedido(
  datosEnvio: unknown,
  items: ItemCarrito[],
  culqiTokenId: string,
): Promise<ResultadoCheckout> {
  const parsed = checkoutSchema.safeParse(datosEnvio);
  if (!parsed.success) {
    return { ok: false, error: "Revisa los datos del formulario de envío." };
  }
  if (!items || items.length === 0) {
    return { ok: false, error: "Tu carrito está vacío." };
  }
  if (!culqiTokenId) {
    return { ok: false, error: "No se pudo procesar el pago. Intenta nuevamente." };
  }

  const datos = parsed.data;
  const subtotal = calcularSubtotal(items);
  const costoEnvio = calcularEnvio(items, subtotal);
  const total = subtotal + costoEnvio;
  const numeroOrden = generarNumeroOrden();

  let pedidoId: string;
  try {
    const pedido = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const actualizado = await tx.producto.updateMany({
          where: { id: item.productoId, stock: { gte: item.cantidad } },
          data: { stock: { decrement: item.cantidad } },
        });
        if (actualizado.count === 0) {
          throw new StockInsuficienteError(item.productoId, item.nombre);
        }
      }

      return tx.pedido.create({
        data: {
          numeroOrden,
          estado: "PENDIENTE",
          clienteNombre: datos.clienteNombre,
          clienteEmail: datos.clienteEmail,
          clienteTelefono: datos.clienteTelefono,
          direccion: datos.direccion,
          distrito: datos.distrito,
          referencia: datos.referencia,
          subtotal,
          costoEnvio,
          total,
          items: {
            create: items.map((item) => ({
              productoId: item.productoId,
              nombreProducto: item.nombre,
              precioUnitario: item.precio,
              cantidad: item.cantidad,
              subtotal: item.precio * item.cantidad,
            })),
          },
        },
      });
    });
    pedidoId = pedido.id;
  } catch (error) {
    if (error instanceof StockInsuficienteError) {
      return {
        ok: false,
        error: `Lo sentimos, "${error.nombreProducto}" ya no tiene stock suficiente. Actualiza tu carrito.`,
      };
    }
    throw error;
  }

  async function revertirPedido(mensaje: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        await tx.producto.update({
          where: { id: item.productoId },
          data: { stock: { increment: item.cantidad } },
        });
      }
      await tx.pedido.update({
        where: { id: pedidoId },
        data: { estado: "CANCELADO", notas: mensaje },
      });
    });
  }

  const [nombre, ...resto] = datos.clienteNombre.trim().split(" ");
  let cargo: Awaited<ReturnType<typeof crearCargoCulqi>>;
  try {
    cargo = await crearCargoCulqi({
      tokenId: culqiTokenId,
      montoEnCentimos: Math.round(total * 100),
      email: datos.clienteEmail,
      numeroOrden,
      antifraud: {
        firstName: nombre,
        lastName: resto.join(" ") || nombre,
        address: datos.direccion,
        addressCity: datos.distrito,
        phoneNumber: datos.clienteTelefono,
      },
    });
  } catch (error) {
    // Fallo de red/comunicación con Culqi (no un rechazo del banco): revertimos
    // el stock y el pedido para no dejarlos huérfanos.
    console.error("Error de comunicación con Culqi", error);
    const mensaje = "No pudimos conectar con la pasarela de pago. Intenta nuevamente.";
    await revertirPedido(mensaje);
    return { ok: false, error: mensaje };
  }

  if (!cargo.ok) {
    await revertirPedido(cargo.mensaje);
    return { ok: false, error: cargo.mensaje };
  }

  const pedidoPagado = await prisma.pedido.update({
    where: { id: pedidoId },
    data: { estado: "PAGADO", culqiChargeId: cargo.chargeId, metodoPago: cargo.metodoPago },
    include: { items: true },
  });

  const datosEmail = {
    numeroOrden: pedidoPagado.numeroOrden,
    clienteNombre: pedidoPagado.clienteNombre,
    clienteEmail: pedidoPagado.clienteEmail,
    subtotal: Number(pedidoPagado.subtotal),
    costoEnvio: Number(pedidoPagado.costoEnvio),
    total: Number(pedidoPagado.total),
    direccion: pedidoPagado.direccion,
    distrito: pedidoPagado.distrito,
    items: pedidoPagado.items.map((item) => ({
      nombreProducto: item.nombreProducto,
      cantidad: item.cantidad,
      precioUnitario: Number(item.precioUnitario),
    })),
  };

  let emailClienteEnviado = false;
  let emailAdminEnviado = false;

  try {
    await enviarEmailConfirmacionCliente(datosEmail);
    emailClienteEnviado = true;
  } catch (error) {
    console.error("Error enviando email de confirmación al cliente", error);
  }

  try {
    await enviarEmailNotificacionAdmin(datosEmail);
    emailAdminEnviado = true;
  } catch (error) {
    console.error("Error enviando email de notificación al admin", error);
  }

  if (emailClienteEnviado || emailAdminEnviado) {
    await prisma.pedido.update({
      where: { id: pedidoId },
      data: { emailClienteEnviado, emailAdminEnviado },
    });
  }

  return { ok: true, numeroOrden };
}

export async function obtenerPedidoPorNumeroOrden(numeroOrden: string) {
  return prisma.pedido.findUnique({
    where: { numeroOrden },
    include: { items: true },
  });
}

export async function obtenerPedidosAdmin(params: { estado?: string }) {
  const { estado } = params;
  return prisma.pedido.findMany({
    where: estado ? { estado: estado as EstadoPedido } : {},
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
}

export async function obtenerPedidoPorId(id: string) {
  return prisma.pedido.findUnique({ where: { id }, include: { items: true } });
}

export async function cambiarEstadoPedido(
  id: string,
  estado: EstadoPedido,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await prisma.pedido.update({ where: { id }, data: { estado } });
  } catch {
    return { ok: false, error: "No se pudo actualizar el estado del pedido." };
  }

  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${id}`);
  return { ok: true };
}

export async function obtenerEstadisticasDashboard() {
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  const estadosValidos: EstadoPedido[] = ["PAGADO", "ENVIADO", "ENTREGADO"];

  const [ventasMes, pedidosPendientes, topItems] = await Promise.all([
    prisma.pedido.aggregate({
      where: { estado: { in: estadosValidos }, createdAt: { gte: inicioMes } },
      _sum: { total: true },
    }),
    prisma.pedido.count({ where: { estado: "PENDIENTE" } }),
    prisma.itemPedido.groupBy({
      by: ["nombreProducto"],
      where: { pedido: { estado: { in: estadosValidos } } },
      _sum: { cantidad: true },
      orderBy: { _sum: { cantidad: "desc" } },
      take: 5,
    }),
  ]);

  return {
    ventasDelMes: Number(ventasMes._sum.total ?? 0),
    pedidosPendientes,
    topProductos: topItems.map((item) => ({
      nombre: item.nombreProducto,
      cantidad: item._sum.cantidad ?? 0,
    })),
  };
}
