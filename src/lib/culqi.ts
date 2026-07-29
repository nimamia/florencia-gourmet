type AntifraudDetails = {
  firstName: string;
  lastName: string;
  address: string;
  addressCity: string;
  phoneNumber: string;
};

type CargoExitoso = { ok: true; chargeId: string; metodoPago: string };
type CargoFallido = { ok: false; mensaje: string };

export async function crearCargoCulqi(params: {
  tokenId: string;
  montoEnCentimos: number;
  email: string;
  numeroOrden: string;
  antifraud: AntifraudDetails;
}): Promise<CargoExitoso | CargoFallido> {
  const respuesta = await fetch("https://api.culqi.com/v2/charges", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CULQI_SECRET_KEY}`,
    },
    body: JSON.stringify({
      amount: params.montoEnCentimos,
      capture: true,
      currency_code: "PEN",
      description: `Pedido ${params.numeroOrden} - Florencia Gourmet`,
      email: params.email,
      installments: 0,
      source_id: params.tokenId,
      metadata: { numero_orden: params.numeroOrden },
      antifraud_details: {
        first_name: params.antifraud.firstName,
        last_name: params.antifraud.lastName,
        address: params.antifraud.address,
        address_city: params.antifraud.addressCity,
        country_code: "PE",
        phone_number: params.antifraud.phoneNumber,
      },
    }),
  });

  const data = await respuesta.json();

  if (!respuesta.ok || data.object === "error") {
    return {
      ok: false,
      mensaje: data.user_message ?? "El pago fue rechazado. Intenta con otra tarjeta.",
    };
  }

  return {
    ok: true,
    chargeId: data.id,
    metodoPago: data.source?.type ?? "tarjeta",
  };
}

export async function obtenerCargoCulqi(chargeId: string): Promise<{ object: string } | null> {
  const respuesta = await fetch(`https://api.culqi.com/v2/charges/${chargeId}`, {
    headers: { Authorization: `Bearer ${process.env.CULQI_SECRET_KEY}` },
  });
  if (!respuesta.ok) return null;
  return respuesta.json();
}
