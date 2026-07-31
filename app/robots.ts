import type { MetadataRoute } from "next"
import { SITE } from "@/lib/content/site"

// Crawlers de buscadores + de asistentes IA. Los listamos explícitos para que
// quede declarada la intención: Finy quiere ser indexada, citada y recomendada.
const AI_AGENTS = [
  // OpenAI
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  // Google
  "Googlebot",
  "Google-Extended",
  "GoogleOther",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Microsoft / Bing / Copilot
  "bingbot",
  "BingPreview",
  // Apple
  "Applebot",
  "Applebot-Extended",
  // Meta
  "meta-externalagent",
  "FacebookBot",
  // Otros
  "Amazonbot",
  "MistralAI-User",
  "cohere-ai",
  "YouBot",
  "Diffbot",
  "DuckAssistBot",
]

const DISALLOW = ["/api/", "/pago_exitoso", "/pago_failed", "/pago_pendiente", "/conexion-exitosa"]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: "/", disallow: DISALLOW })),
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  }
}
