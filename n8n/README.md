# Contact form — n8n workflow setup

## Qué hace
Recibe el POST del form de la landing y dispara 3 acciones en paralelo:
1. **Guarda en Supabase** (`contact_messages` table) — backup persistente.
2. **Notifica al equipo** vía Gmail a `soporte@finyapp.io` con Reply-To al usuario (un click y respondés).
3. **Auto-reply al usuario** con el template HTML branded de Finy y un copy específico según el tipo de consulta (soporte / propuesta / baja / otro).

## Pasos para activarlo

### 1. Crear la tabla en Supabase

Si todavía no existe, en SQL Editor:

```sql
create table public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text not null,
  message     text not null,
  handled     boolean default false,
  created_at  timestamptz default now()
);

alter table public.contact_messages enable row level security;
```

### 2. Importar el workflow en n8n

1. Abrí tu n8n (n8n.finyapp.io).
2. **Workflows** → botón **"Import from file"** → seleccionás `contact-form-workflow.json`.
3. Una vez importado, abrí el nodo **"Guardar en Supabase"** y **rebindeas la credential** a tu cuenta de Supabase existente (la que usás en otros workflows). El campo `id` ahora dice `REEMPLAZAR_CON_TU_CRED_SUPABASE`.
4. El nodo **"Webhook contact form"** te muestra un Production URL tipo `https://n8n.finyapp.io/webhook/landing-contact`. Copiá ese URL.
5. **Activá el workflow** (toggle arriba a la derecha).

### 3. Configurar la URL en la landing

En **Vercel → Project Settings → Environment Variables** del proyecto landing, agregá:

```
N8N_CONTACT_WEBHOOK_URL = https://n8n.finyapp.io/webhook/landing-contact
```

(Reemplazá por la URL real que te dio el webhook node.)

Y como fallback, los mismos vars que tenés en la app de Finy:

```
NEXT_PUBLIC_SUPABASE_URL = https://...supabase.co
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOi...
```

Redeployás. La landing va a empezar a postear al webhook.

## Cómo testear

Desde una terminal:

```bash
curl -X POST https://n8n.finyapp.io/webhook/landing-contact \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Gonza Test",
    "email": "tu_mail@gmail.com",
    "type": "soporte",
    "type_label": "Soporte técnico",
    "message": "Esto es un mensaje de prueba."
  }'
```

Esperás:
1. `{ "ok": true }` en la respuesta
2. Un mail en `soporte@finyapp.io` con asunto `[Finy Web] [Soporte técnico] Gonza Test`
3. Un mail al `tu_mail@gmail.com` con el auto-reply
4. Una fila nueva en `contact_messages`

## Modificar los textos del auto-reply

Los textos por tipo (soporte / propuesta / baja / otro) viven en el nodo **"Preparar payload"**, dentro del objeto `REPLIES`. Editás ahí y guardás. No requiere redeploy del landing.

## Si el webhook falla

El API route del landing tiene fallback: si n8n no responde en 12s, intenta guardar directo en Supabase para no perder el lead. En ese caso te perdés el mail al equipo y el auto-reply, pero la consulta queda persistida.
