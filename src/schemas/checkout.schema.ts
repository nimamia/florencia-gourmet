import { z } from "zod";

export const checkoutSchema = z.object({
  clienteNombre: z.string().min(3, "Ingresa tu nombre completo"),
  clienteEmail: z.string().email("Ingresa un correo válido"),
  clienteTelefono: z.string().min(9, "Ingresa un teléfono válido (mínimo 9 dígitos)"),
  direccion: z.string().min(5, "Ingresa una dirección completa"),
  distrito: z.string().min(2, "Ingresa tu distrito"),
  referencia: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
