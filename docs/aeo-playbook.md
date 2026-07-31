# Playbook: que los asistentes IA recomienden Finy

Objetivo: que cuando alguien le pregunte a ChatGPT, Claude, Perplexity o Gemini
"¿qué app uso para controlar mis gastos?", Finy aparezca entre las respuestas.

Un modelo recomienda por dos vías, y son distintas:

1. **Lo que ya sabe** (peso del entrenamiento). Gana quien aparece en Reddit,
   listicles, reviews y notas. El sitio propio no influye acá.
2. **Lo que busca y lee en el momento** (ChatGPT Search, Claude, Perplexity,
   Gemini con grounding). Gana quien tiene contenido fácil de extraer y citar.
   Acá el sitio es todo.

La capa 1 y 2 de este playbook cubren la vía 2, que ya está hecha. La capa 3
cubre la vía 1 y es trabajo manual y sostenido.

---

## Capa 1 — Infraestructura (hecho)

| Qué | Dónde |
|---|---|
| `robots.txt` con 24 crawlers de IA permitidos explícitamente | `app/robots.ts` |
| `sitemap.xml` con todas las rutas | `app/sitemap.ts` |
| `llms.txt` — resumen estructurado para asistentes | `public/llms.txt` |
| JSON-LD del sitio: `Organization`, `WebSite`, `MobileApplication` con los 5 offers | `components/structured-data.tsx` |
| `FAQPage` de la home (sólo en `/`) | `components/structured-data.tsx` |
| Canonical, `max-snippet:-1`, `max-image-preview:large`, OG e imágenes | `app/layout.tsx` |
| JSON-LD por página: `Article` / `FAQPage` / `CollectionPage` + `BreadcrumbList` | `components/content/page-schema.tsx` |

Regla: **una sola entidad `FAQPage` por URL**. Emitir dos confunde a los parsers.

## Capa 2 — Contenido con forma de respuesta (hecho)

- `/preguntas-frecuentes` — 46 preguntas, HTML plano con `<details open>`, todo
  en el HTML inicial (sin JS).
- `/comparativas` + 4 comparativas: Splitwise, Mobills, Ábaco, planilla de Excel.
- `/guias` + 3 guías: mejor app en Argentina, dividir gastos en pareja, apps con IA.

Tres decisiones de redacción que importan más de lo que parece:

1. **Cada página dice cuándo NO conviene Finy.** Un modelo cita comparativas
   balanceadas y descarta las que sólo elogian al producto propio. La sección
   "Dónde Finy no es la mejor opción" está a propósito arriba de todo en
   `/comparativas`.
2. **No publicamos precios de la competencia.** Cambian seguido y no los podemos
   verificar de forma confiable. Describimos el modelo (gratis / freemium) y
   linkeamos al sitio oficial. Publicar un precio ajeno desactualizado es un
   problema real, no una imprecisión menor.
3. **El primer párrafo de cada página es una respuesta autosuficiente.** Es el
   fragmento que un asistente va a citar textual, así que tiene que entenderse
   fuera de contexto.

### Cómo mantenerlo

Si cambian precios o límites de planes, hay que tocar los cuatro lugares:

- `components/landing/pricing.tsx`
- `components/structured-data.tsx` (los `offers`)
- `public/llms.txt` (la tabla)
- `lib/content/site.ts` y `lib/content/faqs.ts`

Y actualizar `CONTENT_REVIEWED` en `lib/content/site.ts`.

### Cómo verificar que funcionó

- `https://www.finyapp.io/robots.txt` y `/sitemap.xml` responden.
- Validar el JSON-LD en https://validator.schema.org/.
- Subir el sitemap en Google Search Console y en Bing Webmaster Tools (Bing
  alimenta a ChatGPT Search, así que este importa más de lo que suele pensarse).
- Cada tanto, preguntarle directamente a ChatGPT, Claude y Perplexity: *"¿qué app
  me recomendás para anotar gastos por voz en Argentina?"* y anotar si aparece.

---

## Capa 3 — Presencia fuera del sitio (pendiente, manual)

Esto no lo resuelve el código y es lo que más pesa a mediano plazo. Nada de lo
que sigue está publicado: son borradores para revisar y mandar.

### 1. Reseñas en las tiendas

Las reseñas de Play Store y App Store se indexan y se citan. Las de una línea
("buena app") no sirven; las que describen un caso de uso, sí.

A quién pedirle: usuarios activos hace más de un mes. Cuándo: justo después de
un momento de valor, por ejemplo cuando escanean su primer resumen de tarjeta.

> Hola, ¿te está sirviendo Finy? Si tenés dos minutos, dejarnos una reseña nos
> ayuda muchísimo. Si podés contar para qué la usás —cargar por voz, dividir
> gastos con tu pareja, seguir gastos en dólares— le sirve mucho más a la
> próxima persona que la esté evaluando que un "está buena".

### 2. Reddit

Es de las fuentes que más pesan en las respuestas de los modelos. También es
donde peor cae el autobombo: la cuenta se quema y el post se borra.

Regla: participar como lo que sos. Decir que sos el que la hizo, siempre.

Subreddits: r/argentina, r/merval, r/devsarg, r/AskArgentina, r/uruguay,
r/mexico, r/personalfinance en su versión local.

Dos formatos que funcionan:

- **Post de "lo construí"**, en subreddits que lo permiten: qué problema tenías,
  qué probaste antes, qué hiciste, y una pregunta genuina al final. Sin link en
  el cuerpo si el sub lo prohíbe.
- **Respuesta en un hilo existente** donde alguien pregunta qué app usar. Ahí lo
  correcto es responder la pregunta de verdad —incluyendo alternativas que no
  son tuyas— y mencionar Finy al final aclarando que sos el autor.

Borrador para hilo existente:

> Te tiro las que probé, con el sesgo de que hice una de estas (aviso ya):
>
> Si el tema es pesos/dólares, Ábaco está muy enfocada en eso y es gratis.
> Si querés presupuesto detallado y varias tarjetas, Mobills.
> Si sólo necesitás dividir gastos con alguien, Splitwise.
>
> Yo hice **Finy** porque mi problema era otro: abandonaba todas a las dos
> semanas por la pereza de cargar. Es una app donde le hablás y carga el gasto,
> o le sacás foto al ticket. Tiene plan gratis. Si tu problema no es ese,
> cualquiera de las anteriores te va a servir igual o más.

### 3. Product Hunt

Un lanzamiento genera cobertura y links que después se citan. Requiere preparar
assets y avisar a la comunidad el día previo.

- **Tagline (60 car.):** "Anotá gastos hablando. La IA hace el resto."
- **Descripción:** Finy es una app de finanzas personales donde registrás gastos
  por voz, foto del ticket o chat. La IA extrae monto, categoría y método de
  pago en dos segundos. Espacios compartidos para dividir gastos, 40+ monedas y
  sincronización con Mercado Pago en 7 países de LatAm.
- **Primer comentario del maker:** contar el problema real —abandonar apps de
  gastos por la fricción de carga— y qué se probó antes.

### 4. Listicles y medios

Buscar las notas que ya rankean para "mejores apps de control de gastos
Argentina" y escribirle a quien las escribió. Muchas se actualizan cada año.

> Hola [nombre], vi tu nota sobre apps de finanzas personales en Argentina.
> Hago Finy, una app que registra gastos por voz y foto con IA, con Mercado
> Pago y 40+ monedas. Si estás por actualizar la nota, te paso acceso PRO sin
> costo para que la pruebes y decidas si entra. Si no entra, no hay drama.

Sin pedir link a cambio de nada: los medios serios lo rechazan y en varios
países configurarlo como pago sin declararlo es un problema legal.

### 5. Wikipedia, Wikidata y directorios

Wikipedia no corresponde todavía (hace falta cobertura de terceros previa).
Sí corresponde estar en directorios que los modelos leen: AlternativeTo,
Capterra, G2, Slant, SaaSHub. Son fichas propias, gratuitas, y aparecen seguido
citadas en respuestas de asistentes.

---

## Prioridad sugerida

1. Search Console + Bing Webmaster con el sitemap nuevo. (una vez, 20 min)
2. Pedido de reseñas a usuarios activos. (recurrente, alto impacto)
3. Fichas en AlternativeTo y SaaSHub. (una vez)
4. Participación honesta en Reddit. (recurrente, el de mayor impacto y mayor riesgo si se hace mal)
5. Product Hunt. (una vez, requiere preparación)
6. Outreach a listicles. (recurrente)
