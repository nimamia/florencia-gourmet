import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obtenerCargoCulqi } from "@/lib/culqi";

export async function POST(request: NextRequest) {
  const secretEsperado = process.env.CULQI_WEBHOOK_SECRET;
  const secretRecibido = request.nextUrl.searchParams.get("secret");
  if (secretEsperado && secretRecibido !== secretEsperado) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const data = payload as { data?: { id?: unknown }; id?: unknown };
  const chargeId =
    typeof data?.data?.id === "string"
      ? data.data.id
      : typeof data?.id === "string"
        ? data.id
        : undefined;

  if (!chargeId) {
    return NextResponse.json({ ok: true });
  }

  const pedido = await prisma.pedido.findFirst({ where: { culqiChargeId: chargeId } });

  // Solo reconciliamos pedidos que quedaron en estado ambiguo (PENDIENTE, ej. si la
  // función se interrumpió justo después de cobrar en Culqi pero antes de actualizar
  // nuestro registro). Nunca sobrescribimos un estado posterior del fulfillment
  // (ENVIADO/ENTREGADO) ni un CANCELADO ya decidido.
  if (!pedido || pedido.estado !== "PENDIENTE") {
    return NextResponse.json({ ok: true });
  }

  // No confiamos en el body del webhook: reconsultamos el cargo directamente a Culqi.
  const cargo = await obtenerCargoCulqi(chargeId);
  if (!cargo) {
    // No se pudo confirmar con Culqi (red u otro problema); no tocamos el pedido,
    // Culqi reintentará el webhook más adelante.
    return NextResponse.json({ ok: true });
  }

  const nuevoEstado = cargo.object === "charge" ? "PAGADO" : "CANCELADO";
  await prisma.pedido.update({ where: { id: pedido.id }, data: { estado: nuevoEstado } });

  return NextResponse.json({ ok: true });
}
