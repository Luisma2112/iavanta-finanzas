export const WEB_SUBTYPES = [
  { id: "landing",       label: "Landing Page",           price: 2500, hint: "desde $2,500 · 1–4 páginas" },
  { id: "corporativa",   label: "Corporativa",            price: 4700, hint: "desde $4,700 · 4–10 páginas" },
  { id: "ecommerce",     label: "E-Commerce",             price: 8900, hint: "desde $8,900 · catálogo + carrito" },
  { id: "rediseno",      label: "Rediseño",               price: 1800, hint: "desde $1,800 hasta $5,200" },
  { id: "seo",           label: "SEO Básico",             price: 500,  hint: "$500 – $1,500" },
  { id: "logo",          label: "Logo + Identidad Visual",price: 500,  hint: "$500 – $2,500" },
  { id: "mantenimiento", label: "Mantenimiento",          price: 200,  hint: "$200 / hora" },
];

// Tipo de servicio de un cliente/prospecto → cómo se ve y de qué color.
// "web" = pago único, "ia" y "suscripcion" = mensualidad recurrente.
export function serviceMeta(c) {
  const t = c?.serviceType ?? "ia";
  if (t === "web") return { icon: "🌐", label: WEB_SUBTYPES.find(s => s.id === c.webServiceSubtype)?.label ?? "Web", badge: "badge-teal", color: "#0d9faa" };
  if (t === "suscripcion") return { icon: "🔁", label: "Suscripción", badge: "badge-blue", color: "#4d9fff" };
  return { icon: "🤖", label: "IA", badge: "badge-purple", color: "#9b5cff" };
}

export const fmt = (n) => "$" + Number(n || 0).toLocaleString("es-MX", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
export const today = () => new Date().toISOString().split("T")[0];
export const toYM = (d) => d.slice(0, 7);
