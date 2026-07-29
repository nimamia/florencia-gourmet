import { Resend } from "resend";
import { formatPrice } from "@/lib/utils";

function obtenerCliente(): Resend {
  return new Resend(process.env.RESEND_API_KEY);
}

export type PedidoParaEmail = {
  numeroOrden: string;
  clienteNombre: string;
  clienteEmail: string;
  subtotal: number;
  costoEnvio: number;
  total: number;
  direccion: string;
  distrito: string;
  items: { nombreProducto: string; cantidad: number; precioUnitario: number }[];
};

function filaItem(item: { nombreProducto: string; cantidad: number; precioUnitario: number }) {
  return `<tr>
    <td style="padding:8px 0;">${item.nombreProducto} × ${item.cantidad}</td>
    <td style="padding:8px 0; text-align:right;">${formatPrice(item.precioUnitario * item.cantidad)}</td>
  </tr>`;
}

function plantillaConfirmacionCliente(pedido: PedidoParaEmail): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #18181b;">
      <h2 style="color:#be123c;">¡Gracias por tu compra, ${pedido.clienteNombre}!</h2>
      <p>Tu pedido <strong>${pedido.numeroOrden}</strong> fue confirmado.</p>
      <table style="width:100%; border-collapse: collapse;">
        ${pedido.items.map(filaItem).join("")}
      </table>
      <p style="margin-top:16px;">
        Subtotal: ${formatPrice(pedido.subtotal)}<br/>
        Envío: ${pedido.costoEnvio === 0 ? "Gratis" : formatPrice(pedido.costoEnvio)}<br/>
        <strong>Total: ${formatPrice(pedido.total)}</strong>
      </p>
      <p>Enviaremos tu pedido a: ${pedido.direccion}, ${pedido.distrito}.</p>
    </div>
  `;
}

function plantillaNotificacionAdmin(pedido: PedidoParaEmail): string {
  return `
    <div style="font-family: Arial, sans-serif; color: #18181b;">
      <h2>Nuevo pedido: ${pedido.numeroOrden}</h2>
      <p>Cliente: ${pedido.clienteNombre} (${pedido.clienteEmail})</p>
      <table style="width:100%; border-collapse: collapse;">
        ${pedido.items.map(filaItem).join("")}
      </table>
      <p style="margin-top:16px;"><strong>Total: ${formatPrice(pedido.total)}</strong></p>
      <p>Dirección de envío: ${pedido.direccion}, ${pedido.distrito}.</p>
    </div>
  `;
}

export async function enviarEmailConfirmacionCliente(pedido: PedidoParaEmail): Promise<void> {
  await obtenerCliente().emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: pedido.clienteEmail,
    subject: `Confirmación de tu pedido ${pedido.numeroOrden} - Florencia Gourmet`,
    html: plantillaConfirmacionCliente(pedido),
  });
}

export async function enviarEmailNotificacionAdmin(pedido: PedidoParaEmail): Promise<void> {
  await obtenerCliente().emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: process.env.ADMIN_NOTIFICATION_EMAIL!,
    subject: `Nuevo pedido ${pedido.numeroOrden}`,
    html: plantillaNotificacionAdmin(pedido),
  });
}
