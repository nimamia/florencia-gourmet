# Florencia Gourmet

E-commerce de flores importadas y bocaditos dulces/salados. Perú (PEN). Next.js 16 (App Router) + Supabase (Postgres + Storage + Auth) + Prisma 7 + Culqi + Resend.

## Requisitos

- Node.js 20.9+
- Cuenta de [Supabase](https://supabase.com) (Postgres + Storage + Auth)
- Cuenta de [Culqi](https://culqi.com) (pasarela de pago)
- Cuenta de [Resend](https://resend.com) (email transaccional)

## Setup local

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Copiar `.env.example` a `.env.local` y completar las variables (ver sección siguiente).

3. Aplicar el schema a la base de datos:

   ```bash
   npx prisma migrate dev
   ```

4. (Opcional) Poblar datos de prueba:

   ```bash
   npx prisma db seed
   ```

5. Crear el usuario administrador inicial:

   ```bash
   npx tsx scripts/crear-admin.ts <email> <password>
   ```

6. Levantar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abrir [http://localhost:3000](http://localhost:3000). El panel de administración está en `/admin/login`.

> **Nota (Windows):** Turbopack tiene un bug conocido en este entorno al crear "junction points" para paquetes con binarios nativos (`@prisma/client`, `pg`). Por eso `npm run dev` y `npm run build` usan la bandera `--webpack`. Si Turbopack se estabiliza en una versión futura de Next.js, se puede quitar la bandera de `package.json`.

## Variables de entorno

Ver `.env.example` para la lista completa. Resumen:

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Conexión **pooled** de Supabase (puerto 6543) — usada en runtime por la app |
| `DIRECT_URL` | Conexión **directa** de Supabase (puerto 5432) — usada por el CLI de Prisma para migraciones |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cliente público de Supabase (Auth, browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | Acceso privilegiado server-side (Storage, creación de usuarios admin) — nunca exponer al cliente |
| `SUPABASE_STORAGE_BUCKET` | Nombre del bucket público donde se guardan las imágenes de producto |
| `NEXT_PUBLIC_CULQI_PUBLIC_KEY` / `CULQI_SECRET_KEY` | Llaves de Culqi (usar las de prueba en desarrollo) |
| `CULQI_WEBHOOK_SECRET` | Secreto compartido para validar el webhook (`/api/webhooks/culqi?secret=...`) |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | Envío de emails transaccionales |
| `ADMIN_NOTIFICATION_EMAIL` | Correo que recibe la notificación de cada nuevo pedido |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio |

## Scripts útiles

- `npx tsx scripts/crear-admin.ts <email> <password>` — crea (o actualiza) un usuario administrador en Supabase Auth y lo vincula a la tabla `UsuarioAdmin`.
- `npx prisma studio` — inspeccionar/editar datos manualmente.
- `npx prisma db seed` — recrea las categorías y productos de prueba (usa `upsert`, es seguro correrlo varias veces).

## Estructura del proyecto

```
src/
├── app/
│   ├── (shop)/          # tienda pública: home, catálogo, carrito, checkout
│   ├── admin/            # panel de administración (protegido por src/proxy.ts)
│   └── api/webhooks/     # webhook de Culqi
├── actions/              # Server Actions (productos, categorías, pedidos, auth)
├── components/           # componentes de UI, organizados por módulo
├── lib/                  # clientes (Prisma, Supabase, Culqi, Resend) y utilidades
├── stores/               # estado de cliente (carrito, Zustand + persist)
├── schemas/              # validación (zod)
└── proxy.ts              # protección de /admin/* (equivalente a middleware en Next.js 16)
```

## Deploy a producción

1. Conectar el repositorio a Vercel (o `vercel deploy` vía CLI).
2. Cargar todas las variables de `.env.example` en el dashboard de Vercel (Project Settings → Environment Variables).
3. Cambiar las llaves de Culqi de prueba a producción.
4. Verificar el dominio propio en Resend (DNS) para enviar desde ese dominio en vez de `onboarding@resend.dev`.
5. Configurar la URL del webhook de Culqi en su panel: `https://<tu-dominio>/api/webhooks/culqi?secret=<CULQI_WEBHOOK_SECRET>`.
