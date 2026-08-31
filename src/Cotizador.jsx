import { useState, useRef, useEffect, forwardRef, useCallback } from "react";

// ── CATALOG ───────────────────────────────────────────────────────────────────
const CATALOG = [
  {
    cat: "Agente IA para WhatsApp",
    items: [
      {
        producto: "IA Vanta – Implementación inicial", precio: 5700, cantidad: 1, nota: "Pago único",
        desc: "Configuración y puesta en marcha del agente de inteligencia artificial sobre WhatsApp Business, entrenado con la información de tu negocio para atender y calificar clientes de forma automática.",
        inc: [
          "Alta y verificación del número en WhatsApp Business API",
          "Entrenamiento del agente con tu catálogo, precios y preguntas frecuentes",
          "Diseño de flujos de conversación y derivación a un asesor humano",
          "Pruebas y ajustes previos al lanzamiento",
        ],
      },
      {
        producto: "IA Vanta – Mensualidad", precio: 2900, cantidad: 1, nota: "Por mes",
        desc: "Operación continua del agente de IA: infraestructura, mensajería y mejoras del modelo mes con mes.",
        inc: [
          "Hospedaje y operación del agente 24/7",
          "Mensajes incluidos dentro del plan contratado",
          "Ajuste de respuestas y reentrenamiento mensual",
          "Reporte mensual de conversaciones atendidas",
          "Soporte técnico",
        ],
      },
    ],
  },
  {
    cat: "Sitios Web",
    items: [
      {
        producto: "Landing Page (1-4 páginas)", precio: 2500, cantidad: 1, nota: "",
        desc: "Sitio web de una a cuatro secciones, enfocado en convertir visitas en clientes, responsivo en dispositivos móviles.",
        inc: [
          "Diseño UX/UI a medida, responsivo en móvil y escritorio",
          "Formulario de contacto con protección anti-spam",
          "Integración con WhatsApp y redes sociales",
          "Optimización de velocidad de carga",
          "Publicación y configuración en el servidor",
        ],
      },
      {
        producto: "Página Corporativa (4-10 páginas)", precio: 4700, cantidad: 1, nota: "",
        desc: "Sitio institucional con secciones de empresa, servicios, portafolio y contacto, responsivo en dispositivos móviles.",
        inc: [
          "Diseño UX/UI a medida, responsivo en móvil y escritorio",
          "Hasta 10 páginas internas con contenido editable",
          "Formularios de contacto con protección anti-spam",
          "Integración de Google Analytics",
          "SEO on-page en todas las páginas",
          "Capacitación de uso del administrador",
        ],
      },
      {
        producto: "E-commerce (catálogo, carrito, pagos)", precio: 8900, cantidad: 1, nota: "",
        desc: "Tienda en línea completa con catálogo de productos, carrito de compras y cobro en línea.",
        inc: [
          "Catálogo de productos con categorías y buscador",
          "Carrito y proceso de compra optimizado",
          "Pasarela de pagos (tarjeta, SPEI, Mercado Pago)",
          "Cálculo de envíos y gestión de pedidos",
          "Panel de administración de inventario",
          "Capacitación de uso",
        ],
      },
      {
        producto: "Rediseño de sitio web", precio: 1800, cantidad: 1, nota: "",
        desc: "Renovación visual y estructural de un sitio ya existente, conservando y mejorando su contenido actual.",
        inc: [
          "Auditoría del sitio actual",
          "Nueva propuesta de diseño responsivo",
          "Migración de contenido e imágenes existentes",
          "Mejora de velocidad de carga y SEO técnico",
          "Publicación sin perder el posicionamiento actual",
        ],
      },
    ],
  },
  {
    cat: "Adicionales",
    items: [
      {
        producto: "Dominio anual (.com / .com.mx)", precio: 0, cantidad: 1, nota: "", hasIncluido: true,
        desc: "Registro y configuración del dominio a nombre del cliente por 12 meses.",
        inc: [
          "Registro del dominio .com o .com.mx",
          "Configuración de DNS apuntando al sitio",
          "Renovación anual a partir del segundo año (se cotiza por separado)",
        ],
      },
      {
        producto: "Hosting Anual", precio: 1500, cantidad: 1, nota: "", hasIncluido: true,
        desc: "Alojamiento del sitio web en servidor administrado durante 12 meses.",
        inc: [
          "Servidor con certificado SSL incluido",
          "Respaldos automáticos periódicos",
          "Cuentas de correo corporativo",
          "Monitoreo de disponibilidad del sitio",
        ],
      },
      {
        producto: "Mantenimiento web", precio: 200, cantidad: 1, nota: "Por hora", hasIncluido: true,
        desc: "Actualizaciones y soporte técnico del sitio web solicitados por el cliente.",
        inc: [
          "Actualización de textos e imágenes solicitadas",
          "Soporte técnico sobre las funciones del sitio",
          "Actualización de seguridad y componentes",
          "Reporte mensual de visitas",
        ],
      },
      {
        producto: "SEO Básico (optimización on-page)", precio: 500, cantidad: 1, nota: "", hasIncluido: true,
        desc: "Optimización on-page para mejorar la visibilidad del sitio en buscadores.",
        inc: [
          "Investigación de palabras clave principales",
          "Títulos, metadescripciones y encabezados optimizados",
          "Optimización de imágenes y velocidad de carga",
          "Alta en Google Search Console y Google Analytics",
        ],
      },
      {
        producto: "SEO Avanzado (optimización on-page)", precio: 1500, cantidad: 1, nota: "", hasIncluido: true,
        desc: "Estrategia ampliada de posicionamiento orgánico, con análisis de competencia y seguimiento de resultados.",
        inc: [
          "Todo lo incluido en SEO Básico",
          "Investigación extendida de palabras clave y competencia",
          "Optimización de contenido en todas las páginas",
          "Datos estructurados (schema) y mapa del sitio",
          "Alta y optimización del perfil de Google Business",
          "Reporte de posicionamiento",
        ],
      },
    ],
  },
  {
    cat: "Diseño de Marca",
    items: [
      {
        producto: "Logo", precio: 500, cantidad: 1, nota: "", hasIncluido: true,
        desc: "Diseño de logotipo original para la marca, entregado en todos los formatos de uso.",
        inc: [
          "Propuestas de logotipo a elegir",
          "Dos rondas de ajustes sobre la propuesta seleccionada",
          "Entrega en vectorial (AI / SVG) y PNG",
          "Versiones horizontal, vertical y monocromática",
        ],
      },
      {
        producto: "Paleta de colores", precio: 1200, cantidad: 1, nota: "", hasIncluido: true,
        desc: "Definición de la paleta cromática oficial de la marca y sus reglas de uso.",
        inc: [
          "Colores primarios, secundarios y de apoyo",
          "Códigos HEX, RGB y CMYK",
          "Reglas de uso y combinaciones permitidas",
          "Ejemplos de aplicación",
        ],
      },
      {
        producto: "Logo + Paleta de colores", precio: 1500, cantidad: 1, nota: "", hasIncluido: true,
        desc: "Paquete de identidad básica: logotipo original más la paleta cromática oficial de la marca.",
        inc: [
          "Propuestas de logotipo a elegir y dos rondas de ajustes",
          "Entrega en vectorial (AI / SVG) y PNG",
          "Versiones horizontal, vertical y monocromática",
          "Paleta de colores primarios y secundarios con códigos HEX, RGB y CMYK",
          "Reglas de uso y ejemplos de aplicación",
        ],
      },
      {
        producto: "Guía de estilo completa", precio: 2500, cantidad: 1, nota: "", hasIncluido: true,
        desc: "Manual de identidad visual con todos los lineamientos gráficos de la marca.",
        inc: [
          "Logotipo y todas sus versiones",
          "Paleta de colores y tipografías oficiales",
          "Usos correctos e incorrectos de la marca",
          "Aplicaciones en papelería y redes sociales",
          "Entrega del manual en PDF",
        ],
      },
    ],
  },
  {
    cat: "Capacitación",
    items: [
      {
        producto: "Capacitación para equipos", precio: 300, cantidad: 1, nota: "Por sesión", hasIncluido: true,
        desc: "Sesión de capacitación para el equipo del cliente sobre el uso de las herramientas entregadas.",
        inc: [
          "Sesión en línea o presencial de 1.5 horas",
          "Material de apoyo descargable",
          "Grabación de la sesión",
          "Espacio de preguntas y respuestas",
        ],
      },
    ],
  },
];

const ALL_ITEMS = CATALOG.flatMap((c) => c.items);

// ── HELPERS ───────────────────────────────────────────────────────────────────
function uid()     { return Math.random().toString(36).slice(2, 9); }
function todayStr(){ return new Date().toISOString().split("T")[0]; }
function addDays(dateStr, days) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}
function genInvoiceId() {
  const d  = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(2);
  return `#${yy}${mm}${dd}_01`;
}
function fmtMXN(n) {
  if (n === 0) return "$ 0";
  return new Intl.NumberFormat("es-MX", { style:"currency", currency:"MXN", minimumFractionDigits:0, maximumFractionDigits:0 }).format(n);
}
function fmtMXNShort(n) {
  if (n === 0) return "$0";
  return new Intl.NumberFormat("es-MX", { style:"currency", currency:"MXN", minimumFractionDigits:0, maximumFractionDigits:0 }).format(n);
}
function fmtDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  return `${d} de ${months[m - 1]} de ${y}`;
}

const PURPLE       = "#7C3AED";
const PURPLE_LIGHT = "#9b5cff";
const IVA_RATE     = 0.16;

// ── AUTOCOMPLETE INPUT ────────────────────────────────────────────────────────
function AutocompleteInput({ value, onFieldChange }) {
  const [open, setOpen] = useState(false);
  const suggestions = value.trim().length > 0
    ? ALL_ITEMS.filter((i) => i.producto.toLowerCase().includes(value.toLowerCase()))
    : ALL_ITEMS;

  return (
    <div style={{ position:"relative", flex:1 }}>
      <input
        style={S.input}
        value={value}
        onChange={(e) => { onFieldChange("producto", e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Nombre del servicio"
      />
      {open && suggestions.length > 0 && (
        <div style={S.dropdown}>
          {suggestions.map((s, i) => (
            <div
              key={i}
              onMouseDown={() => {
                onFieldChange("producto", s.producto);
                onFieldChange("precio", s.precio);
                if (s.nota)        onFieldChange("nota", s.nota);
                if (s.hasIncluido) onFieldChange("hasIncluido", s.hasIncluido);
                onFieldChange("desc", s.desc || "");
                onFieldChange("inc",  s.inc  ? [...s.inc] : []);
                setOpen(false);
              }}
              style={S.dropdownItem}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f2ff")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ color:"#1a1625", fontSize:12 }}>{s.producto}</span>
              <span style={{ color:PURPLE_LIGHT, fontWeight:700, fontSize:11, flexShrink:0 }}>{fmtMXNShort(s.precio)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── PDF PREVIEW ───────────────────────────────────────────────────────────────
// El outer div (ref) es solo para la vista. Para el PDF capturamos
// data-section="content" y data-section="footer" por separado.
const QuotationPreview = forwardRef(function QuotationPreview(props, ref) {
  const {
    nombre, telefono, empresa, ciudad,
    invoiceId, fechaInicio, fechaFin,
    items, subtotal, descuento, descuentoNota,
    afterDiscount, iva, total, includeIVA, notas,
    monthlyTotal, monthlySubtotal, hasOneTime, hasMonthly,
    showDescripciones, notasTabla,
  } = props;

  const hasDescuentoNota = descuento > 0 && descuentoNota.trim();

  // Servicios que tienen algo que describir (párrafo o viñetas de "incluye").
  const descItems = showDescripciones
    ? items.filter((it) => (it.desc || "").trim() || (it.inc || []).some((l) => l.trim()))
    : [];
  // Notas que van dentro de la tabla, como una fila más.
  const tableNotes = (notasTabla || []).filter((n) => n.trim());

  // Con descripción, la tabla siempre arranca en hoja nueva.
  const breakBeforeTable = descItems.length > 0;

  // Relleno blanco SOLO para la vista en pantalla: completa la última hoja de la
  // descripción para que el preview muestre el mismo corte que tendrá el PDF.
  // En la captura se elimina (data-screen-only), ahí el corte lo hace jsPDF.
  const contentRef = useRef(null);
  const [fillH, setFillH] = useState(0);
  useEffect(() => {
    if (!breakBeforeTable) { setFillH(0); return; }
    const el = contentRef.current;
    if (!el) return;
    const measure = () => {
      const rest = el.offsetHeight % PAGE_H_PX;
      setFillH(rest === 0 ? 0 : Math.round(PAGE_H_PX - rest));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [breakBeforeTable]);

  // Estilos comunes de celda para la tabla
  const tdBase = { borderBottom:"1px solid #f3f4f6", verticalAlign:"top" };

  return (
    <div
      ref={ref}
      data-break-before-table={breakBeforeTable ? "1" : "0"}
      style={{
        backgroundColor: "#ffffff",
        fontFamily: "Arial, Helvetica, sans-serif",
        width: "794px",
        position: "relative",
      }}
    >
      {/* ════════════════════════════════════════════
          CONTENT SECTION — capturado para páginas de contenido
          ════════════════════════════════════════════ */}
      <div data-section="content" ref={contentRef} style={{ backgroundColor:"#ffffff" }}>

        {/* Top info bar */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 32px", borderBottom:"1px solid #e5e7eb", fontSize:12, color:"#6b7280" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            https://iavanta.com.mx
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#6b7280"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.092.54 4.057 1.486 5.768L0 24l6.394-1.467A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.85 0-3.58-.498-5.07-1.37L2.5 21.5l.89-4.296A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            56 3201 0908
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            direccion@iavanta.com.mx
          </div>
        </div>

        {/* Header: símbolo iA + título */}
        <div style={{ display:"flex", padding:"20px 32px 16px", alignItems:"center", borderBottom:"1px solid #e5e7eb" }}>
          <div style={{ width:180, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", borderRight:"1px solid #d1d5db", paddingRight:28, marginRight:36 }}>
            <img src="/logo-symbol.png" alt="iA" crossOrigin="anonymous" style={{ width:80, height:"auto", objectFit:"contain" }} />
          </div>
          <div style={{ flex:1 }}>
            <h1 style={{ fontSize:54, fontWeight:900, margin:0, color:"#111827", letterSpacing:"-2px", lineHeight:1 }}>COTIZACIÓN</h1>
            <div style={{ marginTop:10, fontSize:13, color:"#6b7280" }}>
              Invoice ID : <span style={{ fontWeight:700, color:"#111827" }}>{invoiceId}</span>
            </div>
          </div>
        </div>

        {/* Client info */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"16px 32px", borderBottom:"1px solid #e5e7eb" }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", letterSpacing:"0.1em", marginBottom:8 }}>COTIZADO A:</div>
            <div style={{ fontSize:16, fontWeight:700, color:"#111827" }}>{nombre || "Nombre del cliente"}</div>
            {empresa  && <div style={{ fontSize:13, color:"#6b7280", marginTop:3 }}>{empresa}</div>}
            {telefono && <div style={{ fontSize:13, color:"#6b7280", marginTop:3 }}>{telefono}</div>}
          </div>
          <div style={{ fontSize:14, color:"#6b7280", marginTop:4 }}>{ciudad}</div>
        </div>

        {/* Descripción de servicios — arriba de la tabla, sin precios */}
        {descItems.length > 0 && (
          <div style={{ padding:"18px 32px 0" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", letterSpacing:"0.1em", marginBottom:12 }}>
              DESCRIPCIÓN DE SERVICIOS
            </div>
            {descItems.map((it, i) => {
              const bullets = (it.inc || []).filter((l) => l.trim());
              return (
                <div key={it.id} style={{ marginBottom: i === descItems.length - 1 ? 4 : 16 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:PURPLE, marginBottom:4 }}>{it.producto}</div>
                  {(it.desc || "").trim() && (
                    <div style={{ fontSize:12, color:"#374151", lineHeight:1.65, whiteSpace:"pre-wrap" }}>{it.desc}</div>
                  )}
                  {bullets.length > 0 && (
                    <table style={{ borderCollapse:"collapse", marginTop:6 }}>
                      <tbody>
                        {bullets.map((b, j) => (
                          <tr key={j}>
                            <td style={{ padding:"1px 8px 1px 4px", verticalAlign:"top", fontSize:12, color:PURPLE_LIGHT, lineHeight:1.6 }}>•</td>
                            <td style={{ padding:"1px 0", verticalAlign:"top", fontSize:12, color:"#4b5563", lineHeight:1.6 }}>{b}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Relleno blanco solo para la vista; se quita antes de capturar el PDF */}
      {breakBeforeTable && fillH > 0 && (
        <div data-screen-only="1" style={{ height:fillH, backgroundColor:"#ffffff" }} />
      )}

      {/* ════════════════════════════════════════════
          TABLE SECTION — con descripción activa, siempre en hoja aparte
          ════════════════════════════════════════════ */}
      <div data-section="table" style={{ backgroundColor:"#ffffff" }}>

        {/* Products table */}
        <div style={{ padding:"16px 32px 0" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ backgroundColor:PURPLE }}>
                {[["PRODUCTO","left","48%"],["PRECIO","center","18%"],["CANTIDAD","center","16%"],["TOTAL","right","18%"]].map(([lbl, align, w]) => (
                  <th key={lbl} style={{ padding:"10px 14px", textAlign:align, fontSize:11, fontWeight:700, color:"#fff", letterSpacing:"0.07em", width:w }}>{lbl}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding:"32px 14px", textAlign:"center", color:"#9ca3af", fontSize:13, fontStyle:"italic" }}>
                    Agrega servicios desde el panel izquierdo
                  </td>
                </tr>
              ) : items.map((item, i) => (
                <tr key={item.id} style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#f9fafb" }}>
                  <td style={{ ...tdBase, padding:"11px 14px", fontSize:13, color:"#111827" }}>
                    <div>{item.producto}</div>
                    {item.nota && <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{item.nota}</div>}
                  </td>
                  <td style={{ ...tdBase, padding:"11px 14px", textAlign:"center", fontSize:13, color:"#374151" }}>
                    {fmtMXN(item.precio)}
                  </td>
                  <td style={{ ...tdBase, padding:"11px 14px", textAlign:"center", fontSize:13, color:"#374151" }}>
                    {item.cantidad}
                  </td>
                  <td style={{ ...tdBase, padding:"11px 14px", textAlign:"right", fontSize:13 }}>
                    {item.incluido ? (
                      <>
                        <div style={{ color:"#9ca3af", fontWeight:500 }}>$ 0</div>
                        <div style={{ fontSize:10, color:PURPLE, marginTop:2 }}>1er año inc.</div>
                      </>
                    ) : item.recurrente ? (
                      <span style={{ color:PURPLE, fontWeight:700 }}>
                        {fmtMXN(item.precio * item.cantidad)}<span style={{ fontSize:10, fontWeight:600 }}> /mes</span>
                      </span>
                    ) : (
                      <span style={{ color:"#111827", fontWeight:600 }}>{fmtMXN(item.precio * item.cantidad)}</span>
                    )}
                  </td>
                </tr>
              ))}
              {tableNotes.length > 0 && (
                <tr>
                  <td colSpan={4} style={{ padding:"12px 14px 14px", backgroundColor:"#faf8ff", borderTop:`2px solid ${PURPLE}`, borderBottom:"1px solid #e5e7eb" }}>
                    <div style={{ fontSize:10, fontWeight:700, color:PURPLE, letterSpacing:"0.1em", marginBottom:6 }}>NOTAS</div>
                    <table style={{ borderCollapse:"collapse", width:"100%" }}>
                      <tbody>
                        {tableNotes.map((n, i) => (
                          <tr key={i}>
                            <td style={{ padding:"1px 8px 1px 0", verticalAlign:"top", fontSize:12, color:PURPLE_LIGHT, lineHeight:1.6, width:12 }}>•</td>
                            <td style={{ padding:"1px 0", verticalAlign:"top", fontSize:12, color:"#4b5563", lineHeight:1.6, whiteSpace:"pre-wrap" }}>{n}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Spacer visual (solo para preview en pantalla) */}
        <div style={{ height:24 }} />
      </div>

      {/* ════════════════════════════════════════════
          FOOTER SECTION — siempre al final de la última hoja
          ════════════════════════════════════════════ */}
      <div data-section="footer" style={{ backgroundColor:"#ffffff", position:"relative" }}>

        {/* Transfer + Totals */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"20px 32px", gap:24 }}>
          {/* Transfer */}
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#111827", marginBottom:10 }}>TRANSFERENCIA</div>
            <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"5px 10px", fontSize:12, color:"#374151" }}>
              <span style={{ color:"#9ca3af" }}>Name</span>  <span>: Luis Manuel Garcia Gonzalez</span>
              <span style={{ color:"#9ca3af" }}>CLABE</span> <span>: 646990404043937899</span>
              <span style={{ color:"#9ca3af" }}>Bank</span>  <span>: STP – Revolut</span>
            </div>
          </div>

          {/* Totals */}
          <div style={{ minWidth:300 }}>
            {/* El primer pago incluye los conceptos únicos + el primer mes de lo recurrente */}
            {hasOneTime && (
              <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 14px", fontSize:13, borderBottom:"1px solid #f3f4f6" }}>
                <span style={{ color:"#6b7280" }}>SUB-TOTAL</span>
                <span style={{ fontWeight:600 }}>{fmtMXN(subtotal)}</span>
              </div>
            )}
            {hasMonthly && (
              <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 14px", fontSize:13, borderBottom:"1px solid #f3f4f6" }}>
                <span style={{ color:"#6b7280" }}>1ER MES DE MENSUALIDAD</span>
                <span style={{ fontWeight:600 }}>{hasOneTime ? "+ " : ""}{fmtMXN(monthlySubtotal)}</span>
              </div>
            )}
            {descuento > 0 && (
              <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 14px", fontSize:13, borderBottom:"1px solid #f3f4f6" }}>
                <span style={{ color:"#6b7280" }}>DESCUENTO*</span>
                <span style={{ fontWeight:600, color:PURPLE }}>- {fmtMXN(descuento)}</span>
              </div>
            )}
            {includeIVA && (
              <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 14px", fontSize:13, borderBottom:"1px solid #f3f4f6" }}>
                <span style={{ color:"#6b7280" }}>IVA (16%)</span>
                <span style={{ fontWeight:600, color:"#374151" }}>+ {fmtMXN(iva)}</span>
              </div>
            )}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px", backgroundColor:PURPLE, color:"#fff", marginTop:6, borderRadius:4 }}>
              <span style={{ fontWeight:700, fontSize:13, lineHeight:1.4 }}>
                {hasMonthly ? <>PRIMER PAGO<br />(PESOS MX){includeIVA ? " · IVA inc." : ""}</> : <>TOTAL PESOS<br />MEXICANOS{includeIVA ? " (IVA inc.)" : ""}</>}
              </span>
              <span style={{ fontWeight:800, fontSize:20 }}>{fmtMXN(total)}</span>
            </div>
            {hasMonthly && (
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px", border:`2px solid ${PURPLE}`, color:PURPLE, marginTop:8, borderRadius:4 }}>
                <span style={{ fontWeight:700, fontSize:13, lineHeight:1.4 }}>
                  MENSUALIDAD<br />
                  <span style={{ fontSize:11, fontWeight:600 }}>a partir del 2º mes{includeIVA ? " · IVA inc." : ""}</span>
                </span>
                <span style={{ fontWeight:800, fontSize:20 }}>{fmtMXN(monthlyTotal)}<span style={{ fontSize:12, fontWeight:700 }}> /mes</span></span>
              </div>
            )}
          </div>
        </div>

        {/* Signature */}
        <div style={{ display:"flex", justifyContent:"flex-end", padding:"0 32px 16px" }}>
          <div style={{ textAlign:"center", minWidth:200 }}>
            <div style={{ borderBottom:"1px solid #374151", marginBottom:6 }}>&nbsp;</div>
            <div style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{nombre || "Nombre del cliente"}</div>
          </div>
        </div>

        {/* Watermark — logo completo iA Vanta */}
        <div style={{ position:"absolute", bottom:60, left:"50%", transform:"translateX(-50%)", opacity:0.05, userSelect:"none", pointerEvents:"none", zIndex:0 }}>
          <img src="/logo-full.png" alt="" crossOrigin="anonymous" style={{ width:300, height:"auto" }} />
        </div>

        {/* Footer notes */}
        <div style={{ padding:"0 32px 32px", fontSize:12, color:"#6b7280", lineHeight:1.9, position:"relative", zIndex:1 }}>
          {notas.map((nota, i) => <div key={i}>{nota}</div>)}
          {fechaInicio && fechaFin && (
            <div>Cotización válida del {fmtDate(fechaInicio)} al {fmtDate(fechaFin)}</div>
          )}
          {hasDescuentoNota && (
            <div style={{ marginTop:4, wordBreak:"break-word", whiteSpace:"pre-wrap" }}>
              * {descuentoNota}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

// ── SHARED STYLES ─────────────────────────────────────────────────────────────
const S = {
  input: {
    width:"100%", background:"#ffffff", border:"1px solid #ddd8ef", borderRadius:8,
    padding:"8px 12px", fontFamily:"DM Mono, monospace", fontSize:13,
    color:"#1a1625", outline:"none", boxSizing:"border-box",
  },
  label: {
    fontSize:11, color:"#9990b8", textTransform:"uppercase",
    letterSpacing:"0.8px", marginBottom:4, display:"block",
  },
  sectionTitle: {
    fontSize:10, fontWeight:700, color:"#a8a0c0", textTransform:"uppercase",
    letterSpacing:"1.5px", marginBottom:10, marginTop:4,
  },
  divider: { borderTop:"1px solid #e8e3f5", margin:"16px 0" },
  catLabel: {
    fontSize:11, fontWeight:700, color:PURPLE_LIGHT, background:"#f3efff",
    padding:"4px 8px", borderRadius:6, marginBottom:5, display:"block",
  },
  catalogBtn: {
    width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"7px 10px", textAlign:"left", fontSize:12, borderRadius:8,
    border:"1px solid #e8e3f5", background:"#ffffff", cursor:"pointer",
    marginBottom:3, fontFamily:"DM Mono, monospace",
  },
  dropdown: {
    position:"absolute", top:"100%", left:0, right:0, background:"#fff",
    border:"1px solid #ddd8ef", borderRadius:8, boxShadow:"0 8px 24px rgba(0,0,0,0.12)",
    zIndex:200, maxHeight:220, overflowY:"auto", marginTop:4,
  },
  dropdownItem: {
    padding:"8px 12px", cursor:"pointer", fontSize:12, fontFamily:"DM Mono, monospace",
    display:"flex", justifyContent:"space-between", alignItems:"center",
    borderBottom:"1px solid #f0ecfa", gap:8,
  },
};

// ── PDF GENERATION ────────────────────────────────────────────────────────────
// Captura "content" y "footer" por separado y los compone en páginas A4.
// El footer siempre queda al fondo de la última hoja.
// Ancho de diseño del preview en px (@96dpi). Se usa igual en pantalla,
// en el clon de captura y para calcular las guías de página.
const PAGE_W_PX = 794;
// Tamaño CARTA (Letter) en puntos: 8.5 × 11 in.
const LETTER_W = 612;
const LETTER_H = 792;
// Alto de una hoja carta expresado en px del preview (para las guías en pantalla).
const PAGE_H_PX = (LETTER_H / LETTER_W) * PAGE_W_PX;

async function generatePDF(previewEl, nombre, invoiceId) {
  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF }   = await import("jspdf");

  // Clonamos el preview a un contenedor fuera de pantalla con ancho fijo.
  // Al capturar un elemento real y bien dimensionado, html2canvas ya no
  // comprime la barra de contacto ni recorta el lado derecho.
  const host  = document.createElement("div");
  host.style.cssText = `position:fixed; left:-10000px; top:0; width:${PAGE_W_PX}px; background:#ffffff; z-index:-1;`;
  const clone = previewEl.cloneNode(true);
  clone.style.width = PAGE_W_PX + "px";
  host.appendChild(clone);
  document.body.appendChild(host);

  try {
    // Los rellenos blancos existen solo para que la vista en pantalla muestre
    // el corte de hoja; en el PDF el corte lo hace la paginación real.
    clone.querySelectorAll("[data-screen-only]").forEach((el) => el.remove());

    const contentEl = clone.querySelector("[data-section='content']");
    const tableEl   = clone.querySelector("[data-section='table']");
    const footerEl  = clone.querySelector("[data-section='footer']");
    const breakBeforeTable = clone.dataset.breakBeforeTable === "1";

    // Esperar a que carguen las imágenes del clon (logos, marca de agua)
    const imgs = clone.querySelectorAll("img");
    await Promise.all(Array.from(imgs).map((img) =>
      img.complete && img.naturalWidth
        ? Promise.resolve()
        : new Promise((res) => { img.onload = res; img.onerror = res; setTimeout(res, 3000); })
    ));

    // width/height/windowWidth/windowHeight explícitos → captura completa, sin recorte.
    const shot = (el) => html2canvas(el, {
      scale: 2, useCORS: true, allowTaint: true,
      backgroundColor: "#ffffff", logging: false, imageTimeout: 15000,
      width: PAGE_W_PX,        windowWidth: PAGE_W_PX,
      height: el.scrollHeight, windowHeight: el.scrollHeight,
    });

    const [contentCanvas, tableCanvas, footerCanvas] =
      await Promise.all([shot(contentEl), shot(tableEl), shot(footerEl)]);

    const pdf      = new jsPDF({ orientation:"portrait", unit:"pt", format:"letter" });
    const ptPerPx  = LETTER_W / contentCanvas.width;     // puntos por px del canvas
    const pageH_px = Math.floor(LETTER_H / ptPerPx);     // alto de una carta, en px del canvas

    const blankPage = () => {
      const c = document.createElement("canvas");
      c.width  = contentCanvas.width;
      c.height = pageH_px;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, c.width, c.height);
      return c;
    };

    // Une varios canvas en una sola tira vertical (flujo continuo).
    const joinCanvases = (list) => {
      const kept = list.filter((c) => c.height > 0);
      if (kept.length === 1) return kept[0];
      const out = document.createElement("canvas");
      out.width  = contentCanvas.width;
      out.height = kept.reduce((h, c) => h + c.height, 0);
      const ctx  = out.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, out.width, out.height);
      let y = 0;
      kept.forEach((c) => { ctx.drawImage(c, 0, y); y += c.height; });
      return out;
    };

    // Cada flujo empieza forzosamente en hoja nueva. Con descripción activa,
    // encabezado+descripción y tabla son flujos distintos: nunca comparten hoja.
    // Sin descripción, todo fluye seguido como antes.
    const flows = breakBeforeTable
      ? [contentCanvas, tableCanvas]
      : [joinCanvases([contentCanvas, tableCanvas])];

    // ── Troceado de cada flujo en hojas carta ───────────────────────────────
    const pages = [];   // { canvas, usedH } — usedH = px realmente ocupados
    flows.forEach((flow) => {
      if (flow.height === 0) return;
      let y = 0;
      while (y < flow.height) {
        const sliceH = Math.min(pageH_px, flow.height - y);
        const page   = blankPage();
        page.getContext("2d").drawImage(flow, 0, y, flow.width, sliceH, 0, 0, flow.width, sliceH);
        pages.push({ canvas: page, usedH: sliceH });
        y += sliceH;
      }
    });

    // ── Footer completo al fondo de la última hoja (nunca se parte) ──────────
    const last = pages[pages.length - 1];
    if (last && pageH_px - last.usedH >= footerCanvas.height) {
      last.canvas.getContext("2d").drawImage(footerCanvas, 0, pageH_px - footerCanvas.height);
    } else {
      const page = blankPage();
      page.getContext("2d").drawImage(footerCanvas, 0, Math.max(0, pageH_px - footerCanvas.height));
      pages.push({ canvas: page, usedH: pageH_px });
    }

    pages.forEach((pg, i) => {
      if (i > 0) pdf.addPage();
      pdf.addImage(pg.canvas.toDataURL("image/png"), "PNG", 0, 0, LETTER_W, LETTER_H);
    });

    const slug = (nombre || "Cliente").trim().replace(/\s+/g, "_");
    pdf.save(`Cotizacion_${slug}_${invoiceId.replace("#", "")}.pdf`);
  } finally {
    document.body.removeChild(host);
  }
}

// ── MAIN COTIZADOR ────────────────────────────────────────────────────────────
export function Cotizador() {
  const [nombre,        setNombre]        = useState("");
  const [telefono,      setTelefono]      = useState("");
  const [empresa,       setEmpresa]       = useState("");
  const [ciudad,        setCiudad]        = useState("");
  const [invoiceId,     setInvoiceId]     = useState(genInvoiceId);
  const [fechaInicio,   setFechaInicio]   = useState(todayStr);
  const [vigenciaDias,  setVigenciaDias]  = useState(15);
  const [items,         setItems]         = useState([]);
  const [descuento,     setDescuento]     = useState(0);
  const [descuentoNota, setDescuentoNota] = useState("");
  const [includeIVA,    setIncludeIVA]    = useState(false);
  const [notas,         setNotas]         = useState(["IVA no incluido"]);
  const [notaExtra,     setNotaExtra]     = useState("");
  const [showDescripciones, setShowDescripciones] = useState(false);
  const [notasTabla,    setNotasTabla]    = useState([]);
  const [notaTablaExtra, setNotaTablaExtra] = useState("");
  const [downloading,   setDownloading]   = useState(false);

  const previewRef = useRef(null);
  const [pageGuides, setPageGuides] = useState([]);

  // Mide el alto del preview y calcula dónde caen los cortes de hoja carta,
  // para dibujar las guías. Se re-mide cuando cambia el contenido.
  useEffect(() => {
    const el = previewRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const n = Math.floor((el.offsetHeight - 1) / PAGE_H_PX);
      setPageGuides(Array.from({ length: Math.max(0, n) }, (_, i) => Math.round((i + 1) * PAGE_H_PX)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Cálculos ──────────────────────────────────────────────────────────────
  const lineTotal = (it) => it.incluido ? 0 : it.precio * it.cantidad;
  // Pago único: todo lo que NO es recurrente.
  const subtotal      = items.reduce((s, it) => s + (it.recurrente ? 0 : lineTotal(it)), 0);
  // Cobro mensual recurrente (bloque aparte, a partir del 2º mes).
  const monthlySubtotal = items.reduce((s, it) => s + (it.recurrente ? lineTotal(it) : 0), 0);
  // El primer pago cobra los conceptos únicos + el primer mes de lo recurrente.
  const firstSubtotal = subtotal + monthlySubtotal;
  const afterDiscount = Math.max(0, firstSubtotal - descuento);
  const iva           = includeIVA ? Math.round(afterDiscount * IVA_RATE) : 0;
  const total         = afterDiscount + iva;
  const monthlyIva      = includeIVA ? Math.round(monthlySubtotal * IVA_RATE) : 0;
  const monthlyTotal    = monthlySubtotal + monthlyIva;
  const hasOneTime      = subtotal > 0;
  const hasMonthly      = monthlySubtotal > 0;
  const fechaFin        = addDays(fechaInicio, vigenciaDias);

  // ── IVA toggle ────────────────────────────────────────────────────────────
  function toggleIVA() {
    const next = !includeIVA;
    setIncludeIVA(next);
    if (next) setNotas((p) => p.filter((n) => n !== "IVA no incluido").concat("IVA incluido (16%)"));
    else      setNotas((p) => p.filter((n) => n !== "IVA incluido (16%)").concat("IVA no incluido"));
  }

  // ── Item handlers ─────────────────────────────────────────────────────────
  const addCatalogItem = useCallback((item) => {
    // Auto-marca como cobro mensual si la nota o el nombre lo indican.
    const recurrente = /mensual|\bpor mes\b|\/mes/i.test(`${item.nota || ""} ${item.producto || ""}`);
    setItems((p) => [...p, { ...item, id:uid(), incluido:false, recurrente, desc: item.desc || "", inc: item.inc ? [...item.inc] : [] }]);
  }, []);

  const addCustomItem = useCallback(() => {
    setItems((p) => [...p, { id:uid(), producto:"", precio:0, cantidad:1, nota:"", hasIncluido:false, incluido:false, recurrente:false, desc:"", inc:[] }]);
  }, []);

  const updateItem = useCallback((id, field, value) => {
    setItems((p) => p.map((it) => it.id === id ? { ...it, [field]:value } : it));
  }, []);

  const removeItem = useCallback((id) => {
    setItems((p) => p.filter((it) => it.id !== id));
  }, []);

  const addNota = useCallback(() => {
    if (notaExtra.trim()) { setNotas((p) => [...p, notaExtra.trim()]); setNotaExtra(""); }
  }, [notaExtra]);

  const removeNota = useCallback((i) => {
    setNotas((p) => p.filter((_, idx) => idx !== i));
  }, []);

  const addNotaTabla = useCallback(() => {
    if (notaTablaExtra.trim()) { setNotasTabla((p) => [...p, notaTablaExtra.trim()]); setNotaTablaExtra(""); }
  }, [notaTablaExtra]);

  const removeNotaTabla = useCallback((i) => {
    setNotasTabla((p) => p.filter((_, idx) => idx !== i));
  }, []);

  // ── Download ──────────────────────────────────────────────────────────────
  async function downloadPDF() {
    if (!previewRef.current || downloading) return;
    setDownloading(true);
    try {
      await generatePDF(previewRef.current, nombre, invoiceId);
    } catch (err) {
      console.error("PDF error:", err);
      alert("Error al generar el PDF. Intenta de nuevo.");
    } finally {
      setDownloading(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display:"flex", height:"calc(100vh - 64px)", overflow:"hidden", background:"#f2f0f8" }}>

      {/* ── FORM PANEL ── */}
      <aside style={{ width:380, flexShrink:0, overflowY:"auto", background:"#ffffff", borderRight:"1px solid #e0dbf0", padding:"20px 18px 48px" }}>

        <div style={S.sectionTitle}>Datos del Cliente</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <div>
            <span style={S.label}>Nombre *</span>
            <input style={S.input} placeholder="Ej. Rutilo González" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <div>
              <span style={S.label}>Teléfono</span>
              <input style={S.input} placeholder="55 2699 9143" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </div>
            <div>
              <span style={S.label}>Ciudad</span>
              <input style={S.input} placeholder="Querétaro, Qro." value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
            </div>
          </div>
          <div>
            <span style={S.label}>Empresa (opcional)</span>
            <input style={S.input} placeholder="Nombre de la empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
          </div>
        </div>

        <div style={S.divider} />

        <div style={S.sectionTitle}>Detalles de Cotización</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <div>
            <span style={S.label}>Invoice ID</span>
            <input style={S.input} value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <div>
              <span style={S.label}>Fecha inicio</span>
              <input style={S.input} type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
            </div>
            <div>
              <span style={S.label}>Vigencia (días)</span>
              <input style={S.input} type="number" min={1} max={90} value={vigenciaDias} onChange={(e) => setVigenciaDias(parseInt(e.target.value) || 15)} />
            </div>
          </div>
        </div>

        <div style={S.divider} />

        <div style={S.sectionTitle}>Agregar Servicios</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {CATALOG.map((cat) => (
            <div key={cat.cat}>
              <span style={S.catLabel}>{cat.cat}</span>
              {cat.items.map((item) => (
                <button
                  key={item.producto}
                  onClick={() => addCatalogItem(item)}
                  style={S.catalogBtn}
                  onMouseEnter={(e) => { e.currentTarget.style.background="#f5f2ff"; e.currentTarget.style.borderColor="#c4b5fd"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background="#ffffff"; e.currentTarget.style.borderColor="#e8e3f5"; }}
                >
                  <span style={{ color:"#4b4569", flex:1, textAlign:"left", paddingRight:6 }}>
                    {item.producto}
                    {item.nota       && <span style={{ color:"#a8a0c0", fontSize:10, marginLeft:4 }}>({item.nota})</span>}
                    {item.hasIncluido && <span style={{ color:PURPLE,      fontSize:10, marginLeft:4 }}>· 1er año</span>}
                  </span>
                  <span style={{ color:PURPLE_LIGHT, fontWeight:700, fontSize:11, flexShrink:0 }}>
                    {fmtMXNShort(item.precio)} +
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div style={S.divider} />

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <div style={{ ...S.sectionTitle, marginBottom:0, marginTop:0 }}>En la cotización ({items.length})</div>
          <button onClick={addCustomItem} style={{ fontSize:11, color:PURPLE_LIGHT, background:"none", border:"none", cursor:"pointer", fontFamily:"DM Mono, monospace", fontWeight:700 }}>
            + Personalizado
          </button>
        </div>

        {items.length === 0 ? (
          <p style={{ fontSize:12, color:"#a8a0c0", textAlign:"center", padding:"16px 0", fontStyle:"italic" }}>
            Ningún servicio agregado aún
          </p>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {items.map((item) => (
              <div key={item.id} style={{ border:"1px solid #e0dbf0", borderRadius:10, padding:12, background:"#faf9fd", display:"flex", flexDirection:"column", gap:8 }}>
                <div style={{ display:"flex", gap:6, alignItems:"flex-start" }}>
                  <AutocompleteInput value={item.producto} onFieldChange={(f, v) => updateItem(item.id, f, v)} />
                  <button onClick={() => removeItem(item.id)} style={{ padding:"6px 8px", background:"#fff0f0", border:"1px solid #ffd5d5", borderRadius:7, color:"#ff6b6b", cursor:"pointer", flexShrink:0, fontSize:12, lineHeight:1 }}>✕</button>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                  <div>
                    <span style={S.label}>Precio (MXN)</span>
                    <input style={S.input} type="number" min={0} value={item.precio} onChange={(e) => updateItem(item.id, "precio", parseFloat(e.target.value) || 0)} />
                  </div>
                  <div>
                    <span style={S.label}>Cantidad</span>
                    <input style={S.input} type="number" min={1} value={item.cantidad} onChange={(e) => updateItem(item.id, "cantidad", parseInt(e.target.value) || 1)} />
                  </div>
                </div>
                <input style={{ ...S.input, fontSize:12 }} value={item.nota||""} onChange={(e) => updateItem(item.id, "nota", e.target.value)} placeholder="Nota (ej: Pago único, Por mes, Por hora…)" />
                <button
                  onClick={() => updateItem(item.id, "recurrente", !item.recurrente)}
                  style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 12px", background: item.recurrente ? "#9b5cff12" : "#f5f2ff", border: item.recurrente ? "1px solid #9b5cff40" : "1px solid #e0dbf0", borderRadius:8, cursor:"pointer", fontFamily:"DM Mono, monospace" }}
                >
                  <span style={{ fontSize:12, fontWeight:600, color: item.recurrente ? PURPLE_LIGHT : "#9990b8" }}>
                    {item.recurrente ? "🔁 Cobro mensual" : "Cobro mensual"}
                  </span>
                  <div style={{ width:32, height:18, borderRadius:9, background: item.recurrente ? PURPLE_LIGHT : "#d4d0e8", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
                    <div style={{ position:"absolute", top:2, left: item.recurrente ? 16 : 2, width:14, height:14, borderRadius:"50%", background:"#fff", transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
                  </div>
                </button>
                {item.hasIncluido && (
                  <button
                    onClick={() => updateItem(item.id, "incluido", !item.incluido)}
                    style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 12px", background: item.incluido ? "#9b5cff12" : "#f5f2ff", border: item.incluido ? "1px solid #9b5cff40" : "1px solid #e0dbf0", borderRadius:8, cursor:"pointer", fontFamily:"DM Mono, monospace" }}
                  >
                    <span style={{ fontSize:12, fontWeight:600, color: item.incluido ? PURPLE_LIGHT : "#9990b8" }}>
                      {item.incluido ? "✓ 1er año incluido" : "1er año incluido"}
                    </span>
                    <div style={{ width:32, height:18, borderRadius:9, background: item.incluido ? PURPLE_LIGHT : "#d4d0e8", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
                      <div style={{ position:"absolute", top:2, left: item.incluido ? 16 : 2, width:14, height:14, borderRadius:"50%", background:"#fff", transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
                    </div>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div style={S.divider} />

        <div style={S.sectionTitle}>Descripción de servicios</div>

        {/* Toggle: mostrar u ocultar el bloque descriptivo arriba de la tabla */}
        <button
          onClick={() => setShowDescripciones((v) => !v)}
          style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", background: showDescripciones ? "#9b5cff15" : "#f5f2ff", border: showDescripciones ? "1px solid #9b5cff50" : "1px solid #e0dbf0", borderRadius:10, cursor:"pointer", fontFamily:"DM Mono, monospace" }}
        >
          <div style={{ textAlign:"left" }}>
            <div style={{ fontSize:13, fontWeight:700, color: showDescripciones ? PURPLE_LIGHT : "#6b6580" }}>
              {showDescripciones ? "Descripción visible" : "Sin descripción"}
            </div>
            <div style={{ fontSize:11, color:"#9990b8", marginTop:2 }}>
              {showDescripciones ? "Aparece arriba de la tabla, sin precios" : "Actívala para describir qué incluye cada servicio"}
            </div>
          </div>
          <div style={{ width:38, height:22, borderRadius:11, background: showDescripciones ? PURPLE_LIGHT : "#d4d0e8", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
            <div style={{ position:"absolute", top:3, left: showDescripciones ? 19 : 3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
          </div>
        </button>

        {showDescripciones && (
          items.length === 0 ? (
            <p style={{ fontSize:12, color:"#a8a0c0", textAlign:"center", padding:"14px 0", fontStyle:"italic" }}>
              Agrega servicios para escribir su descripción
            </p>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:10 }}>
              {items.map((item) => (
                <div key={item.id} style={{ border:"1px solid #e0dbf0", borderRadius:10, padding:12, background:"#faf9fd", display:"flex", flexDirection:"column", gap:8 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:PURPLE_LIGHT }}>
                    {item.producto || "Servicio sin nombre"}
                  </div>
                  <div>
                    <span style={S.label}>Descripción</span>
                    <textarea
                      style={{ ...S.input, resize:"vertical", minHeight:66, lineHeight:1.5, fontSize:12 }}
                      value={item.desc || ""}
                      onChange={(e) => updateItem(item.id, "desc", e.target.value)}
                      placeholder="Ej. Sitio web de una a cuatro secciones, responsivo en dispositivos móviles."
                    />
                  </div>
                  <div>
                    <span style={S.label}>Incluye (una por línea)</span>
                    <textarea
                      style={{ ...S.input, resize:"vertical", minHeight:80, lineHeight:1.5, fontSize:12 }}
                      value={(item.inc || []).join("\n")}
                      onChange={(e) => updateItem(item.id, "inc", e.target.value.split("\n"))}
                      placeholder={"Diseño UX/UI a medida\nFormulario de contacto\nSEO on-page básico"}
                    />
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        <div style={S.divider} />

        <div style={S.sectionTitle}>Descuento e IVA</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <div>
            <span style={S.label}>Monto del descuento (MXN)</span>
            <input style={S.input} type="number" min={0} value={descuento||""} placeholder="0" onChange={(e) => setDescuento(parseFloat(e.target.value)||0)} />
          </div>
          <div>
            <span style={S.label}>Nota del descuento (aparece al pie del PDF con *)</span>
            <textarea
              style={{ ...S.input, resize:"vertical", minHeight:60, lineHeight:1.5, fontSize:12 }}
              value={descuentoNota}
              onChange={(e) => setDescuentoNota(e.target.value)}
              placeholder="Ej: El cliente tiene contratado hosting, no será necesario el pago anual del hosting."
            />
          </div>

          {/* IVA Toggle */}
          <button
            onClick={toggleIVA}
            style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", background: includeIVA ? "#9b5cff15" : "#f5f2ff", border: includeIVA ? "1px solid #9b5cff50" : "1px solid #e0dbf0", borderRadius:10, cursor:"pointer", fontFamily:"DM Mono, monospace", marginTop:4 }}
          >
            <div style={{ textAlign:"left" }}>
              <div style={{ fontSize:13, fontWeight:700, color: includeIVA ? PURPLE_LIGHT : "#6b6580" }}>
                {includeIVA ? "IVA incluido (16%)" : "Sin IVA"}
              </div>
              {includeIVA && afterDiscount > 0 && (
                <div style={{ fontSize:11, color:"#9990b8", marginTop:2 }}>+{fmtMXNShort(iva)} sobre {fmtMXNShort(afterDiscount)}</div>
              )}
            </div>
            <div style={{ width:38, height:22, borderRadius:11, background: includeIVA ? PURPLE_LIGHT : "#d4d0e8", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
              <div style={{ position:"absolute", top:3, left: includeIVA ? 19 : 3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
            </div>
          </button>

          {/* Resumen en tiempo real */}
          {items.length > 0 && (
            <div style={{ background:"#f8f6fd", borderRadius:10, padding:"10px 14px", marginTop:4 }}>
              {hasOneTime && <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#9990b8", marginBottom:4 }}><span>Subtotal</span><span>{fmtMXNShort(subtotal)}</span></div>}
              {hasMonthly && <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#9990b8", marginBottom:4 }}><span>1er mes de mensualidad</span><span>{hasOneTime ? "+ " : ""}{fmtMXNShort(monthlySubtotal)}</span></div>}
              {descuento > 0 && <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#9990b8", marginBottom:4 }}><span>Descuento</span><span style={{ color:PURPLE_LIGHT }}>- {fmtMXNShort(descuento)}</span></div>}
              {includeIVA  && <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#9990b8", marginBottom:4 }}><span>IVA 16%</span><span>+ {fmtMXNShort(iva)}</span></div>}
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:14, fontWeight:700, color:"#1a1625", borderTop:"1px solid #e8e3f5", paddingTop:6, marginTop:4 }}>
                <span>{hasMonthly ? "Primer pago" : "Total"}</span><span style={{ color:PURPLE_LIGHT }}>{fmtMXNShort(total)}</span>
              </div>
              {hasMonthly && (
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:14, fontWeight:700, color:"#1a1625", borderTop:"1px dashed #d4b5ff", paddingTop:6, marginTop:6 }}>
                  <span>🔁 Desde el 2º mes</span><span style={{ color:PURPLE_LIGHT }}>{fmtMXNShort(monthlyTotal)}/mes</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={S.divider} />

        <div style={S.sectionTitle}>Notas dentro de la tabla</div>
        <p style={{ fontSize:11, color:"#a8a0c0", marginTop:0, marginBottom:8, lineHeight:1.5 }}>
          Aparecen como una fila más, pegadas al final de la tabla de precios.
        </p>
        {notasTabla.length > 0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:8 }}>
            {notasTabla.map((nota, i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:6, background:"#f5f2ff", borderRadius:7, padding:"6px 10px", fontSize:12, color:"#6b6580" }}>
                <span style={{ color:PURPLE_LIGHT, flexShrink:0 }}>•</span>
                <span style={{ flex:1, whiteSpace:"pre-wrap" }}>{nota}</span>
                <button onClick={() => removeNotaTabla(i)} style={{ background:"none", border:"none", cursor:"pointer", color:"#c4b5fd", fontSize:12, flexShrink:0 }}>✕</button>
              </div>
            ))}
          </div>
        )}
        <div style={{ display:"flex", gap:6 }}>
          <textarea
            style={{ ...S.input, flex:1, resize:"vertical", minHeight:52, lineHeight:1.5, fontSize:12 }}
            value={notaTablaExtra}
            onChange={(e) => setNotaTablaExtra(e.target.value)}
            placeholder="Ej. Se requiere 50% de anticipo, el resto contra entrega."
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addNotaTabla(); } }}
          />
          <button onClick={addNotaTabla} style={{ flexShrink:0, alignSelf:"stretch", background:PURPLE_LIGHT, color:"#fff", border:"none", borderRadius:8, padding:"8px 14px", cursor:"pointer", fontWeight:700, fontSize:14 }}>+</button>
        </div>

        <div style={S.divider} />

        <div style={S.sectionTitle}>Notas al pie</div>
        <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:8 }}>
          {notas.map((nota, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:6, background:"#f5f2ff", borderRadius:7, padding:"6px 10px", fontSize:12, color:"#6b6580" }}>
              <span style={{ flex:1 }}>{nota}</span>
              <button onClick={() => removeNota(i)} style={{ background:"none", border:"none", cursor:"pointer", color:"#c4b5fd", fontSize:12 }}>✕</button>
            </div>
          ))}
          {descuentoNota.trim() && descuento > 0 && (
            <div style={{ display:"flex", alignItems:"flex-start", gap:4, background:"#f0ecfa", borderRadius:7, padding:"6px 10px", fontSize:11, color:"#9990b8" }}>
              <span style={{ color:PURPLE, fontWeight:700, flexShrink:0 }}>*</span>
              <span style={{ fontStyle:"italic" }}>{descuentoNota}</span>
            </div>
          )}
        </div>
        <div style={{ display:"flex", gap:6 }}>
          <input style={{ ...S.input, flex:1 }} value={notaExtra} onChange={(e) => setNotaExtra(e.target.value)} placeholder="Agregar nota…" onKeyDown={(e) => { if (e.key === "Enter") addNota(); }} />
          <button onClick={addNota} style={{ flexShrink:0, background:PURPLE_LIGHT, color:"#fff", border:"none", borderRadius:8, padding:"8px 14px", cursor:"pointer", fontWeight:700, fontSize:14 }}>+</button>
        </div>

      </aside>

      {/* ── PREVIEW PANEL ── */}
      <main style={{ flex:1, overflowY:"auto", background:"#ede9f8", padding:"24px 32px 48px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <div style={{ fontSize:11, color:"#9990b8", fontFamily:"DM Mono, monospace" }}>
            Vista previa (carta) — {pageGuides.length + 1} hoja{pageGuides.length + 1 !== 1 ? "s" : ""}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {items.length > 0 && (
              <span style={{ fontSize:13, color:"#6b6580", fontFamily:"DM Mono, monospace" }}>
                {hasMonthly ? "1er pago: " : "Total: "}<strong style={{ color:PURPLE_LIGHT }}>{fmtMXNShort(total)}</strong>
                {hasMonthly && <> · luego <strong style={{ color:PURPLE_LIGHT }}>{fmtMXNShort(monthlyTotal)}/mes</strong></>}
                {includeIVA ? " (IVA inc.)" : ""}
              </span>
            )}
            <button
              onClick={downloadPDF}
              disabled={downloading || items.length === 0}
              style={{ display:"flex", alignItems:"center", gap:7, background: downloading||items.length===0 ? "#d4d0e8" : PURPLE_LIGHT, color:"#fff", border:"none", borderRadius:10, padding:"9px 18px", cursor: downloading||items.length===0 ? "not-allowed" : "pointer", fontFamily:"DM Mono, monospace", fontSize:13, fontWeight:700 }}
            >
              ↓ {downloading ? "Generando…" : "Descargar PDF"}
            </button>
          </div>
        </div>

        <div style={{ display:"flex", justifyContent:"center" }}>
          <div style={{ position:"relative", width:PAGE_W_PX, boxShadow:"0 4px 32px rgba(0,0,0,0.15)" }}>
            <QuotationPreview
              ref={previewRef}
              nombre={nombre} telefono={telefono} empresa={empresa} ciudad={ciudad}
              invoiceId={invoiceId} fechaInicio={fechaInicio} fechaFin={fechaFin}
              items={items} subtotal={subtotal}
              descuento={descuento} descuentoNota={descuentoNota}
              afterDiscount={afterDiscount} iva={iva} total={total}
              includeIVA={includeIVA} notas={notas}
              monthlyTotal={monthlyTotal} monthlySubtotal={monthlySubtotal}
              hasOneTime={hasOneTime} hasMonthly={hasMonthly}
              showDescripciones={showDescripciones} notasTabla={notasTabla}
            />
            {/* Guías de corte de hoja carta */}
            {pageGuides.map((y, i) => (
              <div key={i} style={{ position:"absolute", left:0, right:0, top:y, pointerEvents:"none", zIndex:5 }}>
                <div style={{ borderTop:"2px dashed #9b5cff" }} />
                <div style={{ position:"absolute", right:10, top:5, fontSize:10, fontWeight:700, color:"#9b5cff", background:"#fff", padding:"2px 8px", borderRadius:5, fontFamily:"DM Mono, monospace", boxShadow:"0 1px 6px rgba(0,0,0,0.12)" }}>
                  Hoja {i + 2}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

    </div>
  );
}
