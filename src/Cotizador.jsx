import { useState, useRef, forwardRef, useCallback } from "react";

// ── CATALOG ───────────────────────────────────────────────────────────────────
const CATALOG = [
  {
    cat: "Agente IA para WhatsApp",
    items: [
      { producto: "IA Vanta – Implementación inicial", precio: 5700, cantidad: 1, nota: "Pago único" },
      { producto: "IA Vanta – Mensualidad", precio: 2900, cantidad: 1, nota: "Por mes" },
    ],
  },
  {
    cat: "Sitios Web",
    items: [
      { producto: "Landing Page (1-4 páginas)", precio: 2500, cantidad: 1, nota: "" },
      { producto: "Página Corporativa (4-10 páginas)", precio: 4700, cantidad: 1, nota: "" },
      { producto: "E-commerce (catálogo, carrito, pagos)", precio: 8900, cantidad: 1, nota: "" },
      { producto: "Rediseño de sitio web", precio: 1800, cantidad: 1, nota: "" },
    ],
  },
  {
    cat: "Adicionales",
    items: [
      { producto: "Dominio anual (.com / .com.mx)", precio: 0, cantidad: 1, nota: "" },
      { producto: "Hosting Anual (1er año incluido)", precio: 1500, cantidad: 1, nota: "" },
      { producto: "Mantenimiento web", precio: 200, cantidad: 1, nota: "Por hora" },
      { producto: "SEO Básico (optimización on-page)", precio: 500, cantidad: 1, nota: "" },
      { producto: "SEO Avanzado (optimización on-page)", precio: 1500, cantidad: 1, nota: "" },
      { producto: "ConvertKit (e-mails)", precio: 0, cantidad: 1, nota: "" },
      { producto: "Youtube RSS", precio: 0, cantidad: 1, nota: "" },
    ],
  },
  {
    cat: "Diseño de Marca",
    items: [
      { producto: "Logo", precio: 500, cantidad: 1, nota: "" },
      { producto: "Paleta de colores", precio: 1200, cantidad: 1, nota: "" },
      { producto: "Logo + Paleta de colores", precio: 1500, cantidad: 1, nota: "" },
      { producto: "Guía de estilo completa", precio: 2500, cantidad: 1, nota: "" },
    ],
  },
  {
    cat: "Capacitación",
    items: [
      { producto: "Capacitación para equipos", precio: 300, cantidad: 1, nota: "Por sesión" },
    ],
  },
];

const ALL_ITEMS = CATALOG.flatMap((c) => c.items);

// ── HELPERS ───────────────────────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2, 9); }
function todayStr() { return new Date().toISOString().split("T")[0]; }
function addDays(dateStr, days) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}
function genInvoiceId() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(2);
  return `#${yy}${mm}${dd}_01`;
}
function fmtMXN(n) {
  if (n === 0) return "$ 0";
  return new Intl.NumberFormat("es-MX", {
    style: "currency", currency: "MXN",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(n);
}
function fmtMXNShort(n) {
  if (n === 0) return "$0";
  return new Intl.NumberFormat("es-MX", {
    style: "currency", currency: "MXN",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(n);
}
function fmtDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  return `${d} de ${months[m - 1]} de ${y}`;
}

const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#9b5cff";
const IVA_RATE = 0.16;

// ── AUTOCOMPLETE INPUT ────────────────────────────────────────────────────────
function AutocompleteInput({ value, onFieldChange }) {
  const [open, setOpen] = useState(false);

  const suggestions = value.trim().length > 0
    ? ALL_ITEMS.filter((i) => i.producto.toLowerCase().includes(value.toLowerCase()))
    : ALL_ITEMS;

  return (
    <div style={{ position: "relative", flex: 1 }}>
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
                if (s.nota) onFieldChange("nota", s.nota);
                setOpen(false);
              }}
              style={S.dropdownItem}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f2ff")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ color: "#1a1625", fontSize: 12 }}>{s.producto}</span>
              <span style={{ color: PURPLE_LIGHT, fontWeight: 700, fontSize: 11, flexShrink: 0 }}>
                {fmtMXNShort(s.precio)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── PDF PREVIEW ───────────────────────────────────────────────────────────────
const QuotationPreview = forwardRef(function QuotationPreview(props, ref) {
  const {
    nombre, telefono, empresa, ciudad,
    invoiceId, fechaInicio, fechaFin,
    items, subtotal, descuento, descuentoNota,
    afterDiscount, iva, total, includeIVA, notas,
  } = props;

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: "#ffffff",
        fontFamily: "Arial, Helvetica, sans-serif",
        width: "794px",
        minHeight: "1050px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
      }}
    >
      {/* Top info bar */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 32px", borderBottom:"1px solid #e5e7eb", fontSize:12, color:"#6b7280" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span>https://iavanta.com.mx</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#6b7280"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.092.54 4.057 1.486 5.768L0 24l6.394-1.467A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.85 0-3.58-.498-5.07-1.37L2.5 21.5l.89-4.296A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
          <span>56 3201 0908</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <span>direccion@iavanta.com.mx</span>
        </div>
      </div>

      {/* Header: Logo + Title */}
      <div style={{ display:"flex", padding:"20px 32px 16px", alignItems:"center", borderBottom:"1px solid #e5e7eb" }}>
        {/* Logo area */}
        <div style={{ width:180, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", borderRight:"1px solid #d1d5db", paddingRight:28, marginRight:36 }}>
          <img
            src="/logo-full.png"
            alt="IA Vanta"
            crossOrigin="anonymous"
            style={{ width: 140, height: "auto", objectFit: "contain" }}
          />
        </div>
        {/* Title */}
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
          {empresa && <div style={{ fontSize:13, color:"#6b7280", marginTop:3 }}>{empresa}</div>}
          {telefono && <div style={{ fontSize:13, color:"#6b7280", marginTop:3 }}>{telefono}</div>}
        </div>
        <div style={{ fontSize:14, color:"#6b7280", marginTop:4 }}>{ciudad}</div>
      </div>

      {/* Products table */}
      <div style={{ padding:"16px 32px 0" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ backgroundColor:PURPLE }}>
              {[["PRODUCTO","left","48%"],["PRECIO","center","18%"],["CANTIDAD","center","16%"],["TOTAL","right","18%"]].map(([lbl, align, w]) => (
                <th key={lbl} style={{ padding:"10px 14px", textAlign:align, fontSize:11, fontWeight:700, color:"#ffffff", letterSpacing:"0.07em", width:w }}>{lbl}</th>
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
            ) : (
              items.map((item, i) => (
                <tr key={item.id} style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#f9fafb" }}>
                  <td style={{ padding:"11px 14px", fontSize:13, color:"#111827", borderBottom:"1px solid #f3f4f6", verticalAlign:"top" }}>
                    <div>{item.producto}</div>
                    {item.nota && <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{item.nota}</div>}
                  </td>
                  <td style={{ padding:"11px 14px", textAlign:"center", fontSize:13, color:"#374151", borderBottom:"1px solid #f3f4f6" }}>{fmtMXN(item.precio)}</td>
                  <td style={{ padding:"11px 14px", textAlign:"center", fontSize:13, color:"#374151", borderBottom:"1px solid #f3f4f6" }}>{item.cantidad}</td>
                  <td style={{ padding:"11px 14px", textAlign:"right", fontSize:13, color:"#111827", fontWeight:600, borderBottom:"1px solid #f3f4f6" }}>{fmtMXN(item.precio * item.cantidad)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Totals + Transfer */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"20px 32px", gap:24 }}>
        {/* Transfer */}
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#111827", marginBottom:10 }}>TRANSFERENCIA</div>
          <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"5px 10px", fontSize:12, color:"#374151" }}>
            <span style={{ color:"#9ca3af" }}>Name</span><span>: Luis Manuel Garcia Gonzalez</span>
            <span style={{ color:"#9ca3af" }}>CLABE</span><span>: 646990404043937899</span>
            <span style={{ color:"#9ca3af" }}>Bank</span><span>: STP – Revolut</span>
          </div>
        </div>

        {/* Totals block */}
        <div style={{ minWidth:300 }}>
          <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 14px", fontSize:13, borderBottom:"1px solid #f3f4f6" }}>
            <span style={{ color:"#6b7280" }}>SUB-TOTAL</span>
            <span style={{ fontWeight:600 }}>{fmtMXN(subtotal)}</span>
          </div>
          {descuento > 0 && (
            <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 14px", fontSize:13, borderBottom:"1px solid #f3f4f6" }}>
              <span style={{ color:"#6b7280" }}>DESCUENTO{descuentoNota ? `* (${descuentoNota})` : "*"}</span>
              <span style={{ fontWeight:600, color:PURPLE }}>- {fmtMXN(descuento)}</span>
            </div>
          )}
          {includeIVA && (
            <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 14px", fontSize:13, borderBottom:"1px solid #f3f4f6" }}>
              <span style={{ color:"#6b7280" }}>IVA (16%)</span>
              <span style={{ fontWeight:600, color:"#374151" }}>+ {fmtMXN(iva)}</span>
            </div>
          )}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px", backgroundColor:PURPLE, color:"#ffffff", marginTop:6, borderRadius:4 }}>
            <span style={{ fontWeight:700, fontSize:13, lineHeight:1.4 }}>
              TOTAL PESOS<br />MEXICANOS{includeIVA ? " (IVA inc.)" : ""}
            </span>
            <span style={{ fontWeight:800, fontSize:20 }}>{fmtMXN(total)}</span>
          </div>
        </div>
      </div>

      {/* Signature */}
      <div style={{ display:"flex", justifyContent:"flex-end", padding:"0 32px 16px" }}>
        <div style={{ textAlign:"center", minWidth:200 }}>
          <div style={{ borderBottom:"1px solid #374151", marginBottom:6 }}>&nbsp;</div>
          <div style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{nombre || "Nombre del cliente"}</div>
        </div>
      </div>

      {/* Watermark — logo symbol */}
      <div style={{ position:"absolute", bottom:100, left:"50%", transform:"translateX(-50%)", opacity:0.04, userSelect:"none", pointerEvents:"none", zIndex:0 }}>
        <img
          src="/logo-symbol.png"
          alt=""
          crossOrigin="anonymous"
          style={{ width:260, height:"auto" }}
        />
      </div>

      {/* Footer notes */}
      <div style={{ padding:"0 32px 32px", fontSize:12, color:"#6b7280", lineHeight:1.8, position:"relative", zIndex:1 }}>
        {notas.map((nota, i) => <div key={i}>{nota}</div>)}
        {fechaInicio && fechaFin && (
          <div>Cotización válida del {fmtDate(fechaInicio)} al {fmtDate(fechaFin)}</div>
        )}
      </div>
    </div>
  );
});

// ── SHARED STYLES ─────────────────────────────────────────────────────────────
const S = {
  input: {
    width: "100%",
    background: "#ffffff",
    border: "1px solid #ddd8ef",
    borderRadius: 8,
    padding: "8px 12px",
    fontFamily: "DM Mono, monospace",
    fontSize: 13,
    color: "#1a1625",
    outline: "none",
    boxSizing: "border-box",
  },
  label: {
    fontSize: 11,
    color: "#9990b8",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: 4,
    display: "block",
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#a8a0c0",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    marginBottom: 10,
    marginTop: 4,
  },
  divider: {
    borderTop: "1px solid #e8e3f5",
    margin: "16px 0",
  },
  catLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: PURPLE_LIGHT,
    background: "#f3efff",
    padding: "4px 8px",
    borderRadius: 6,
    marginBottom: 5,
    display: "block",
  },
  catalogBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "7px 10px",
    textAlign: "left",
    fontSize: 12,
    borderRadius: 8,
    border: "1px solid #e8e3f5",
    background: "#ffffff",
    cursor: "pointer",
    marginBottom: 3,
    fontFamily: "DM Mono, monospace",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "#fff",
    border: "1px solid #ddd8ef",
    borderRadius: 8,
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    zIndex: 200,
    maxHeight: 220,
    overflowY: "auto",
    marginTop: 4,
  },
  dropdownItem: {
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "DM Mono, monospace",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #f0ecfa",
    gap: 8,
  },
};

// ── MAIN COTIZADOR ────────────────────────────────────────────────────────────
export function Cotizador() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [invoiceId, setInvoiceId] = useState(genInvoiceId);
  const [fechaInicio, setFechaInicio] = useState(todayStr);
  const [vigenciaDias, setVigenciaDias] = useState(15);
  const [items, setItems] = useState([]);
  const [descuento, setDescuento] = useState(0);
  const [descuentoNota, setDescuentoNota] = useState("");
  const [includeIVA, setIncludeIVA] = useState(false);
  const [notas, setNotas] = useState(["IVA no incluido"]);
  const [notaExtra, setNotaExtra] = useState("");
  const [downloading, setDownloading] = useState(false);

  const previewRef = useRef(null);

  // ── Calculations ─────────────────────────────────────────────────────────
  const subtotal = items.reduce((sum, it) => sum + it.precio * it.cantidad, 0);
  const afterDiscount = Math.max(0, subtotal - descuento);
  const iva = includeIVA ? Math.round(afterDiscount * IVA_RATE) : 0;
  const total = afterDiscount + iva;
  const fechaFin = addDays(fechaInicio, vigenciaDias);

  // ── IVA toggle (also updates the nota) ───────────────────────────────────
  function toggleIVA() {
    const next = !includeIVA;
    setIncludeIVA(next);
    if (next) {
      setNotas((prev) => prev.filter((n) => n !== "IVA no incluido").concat("IVA incluido (16%)"));
    } else {
      setNotas((prev) => prev.filter((n) => n !== "IVA incluido (16%)").concat("IVA no incluido"));
    }
  }

  // ── Item handlers ─────────────────────────────────────────────────────────
  const addCatalogItem = useCallback((item) => {
    setItems((prev) => [...prev, { ...item, id: uid() }]);
  }, []);

  const addCustomItem = useCallback(() => {
    setItems((prev) => [...prev, { id: uid(), producto: "", precio: 0, cantidad: 1, nota: "" }]);
  }, []);

  const updateItem = useCallback((id, field, value) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const addNota = useCallback(() => {
    if (notaExtra.trim()) {
      setNotas((prev) => [...prev, notaExtra.trim()]);
      setNotaExtra("");
    }
  }, [notaExtra]);

  const removeNota = useCallback((i) => {
    setNotas((prev) => prev.filter((_, idx) => idx !== i));
  }, []);

  // ── PDF Download ──────────────────────────────────────────────────────────
  async function downloadPDF() {
    if (!previewRef.current || downloading) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      // Wait for images to load
      const imgs = previewRef.current.querySelectorAll("img");
      await Promise.all(
        Array.from(imgs).map(
          (img) =>
            img.complete
              ? Promise.resolve()
              : new Promise((res) => { img.onload = res; img.onerror = res; })
        )
      );

      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: 794,
        imageTimeout: 15000,
      });

      const imgData = canvas.toDataURL("image/png");
      const A4_W = 595.28;
      const A4_H = 841.89;
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

      // Scale proportionally to fit width; if taller than A4, shrink to fit height too
      const widthRatio = A4_W / canvas.width;
      const naturalH = canvas.height * widthRatio;

      if (naturalH <= A4_H) {
        // Fits on one page — top-aligned
        pdf.addImage(imgData, "PNG", 0, 0, A4_W, naturalH);
      } else {
        // Shrink to fit one page (both dims)
        const heightRatio = A4_H / (canvas.height * widthRatio);
        const scaledW = A4_W * heightRatio;
        const scaledH = A4_H;
        const xOffset = (A4_W - scaledW) / 2;
        pdf.addImage(imgData, "PNG", xOffset, 0, scaledW, scaledH);
      }

      const slug = nombre.trim().replace(/\s+/g, "_") || "Cliente";
      pdf.save(`Cotizacion_${slug}_${invoiceId.replace("#", "")}.pdf`);
    } catch (err) {
      console.error("PDF error:", err);
      alert("Error al generar el PDF. Intenta de nuevo.");
    } finally {
      setDownloading(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", height: "calc(100vh - 64px)", overflow: "hidden", background: "#f2f0f8" }}>

      {/* ── FORM PANEL ── */}
      <aside style={{ width: 380, flexShrink: 0, overflowY: "auto", background: "#ffffff", borderRight: "1px solid #e0dbf0", padding: "20px 18px 48px" }}>

        {/* Cliente */}
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

        {/* Cotización */}
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

        {/* Catálogo */}
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
                    {item.nota && <span style={{ color:"#a8a0c0", fontSize:10, marginLeft:4 }}>({item.nota})</span>}
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

        {/* Items seleccionados */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <div style={{ ...S.sectionTitle, marginBottom:0, marginTop:0 }}>En la cotización ({items.length})</div>
          <button
            onClick={addCustomItem}
            style={{ fontSize:11, color:PURPLE_LIGHT, background:"none", border:"none", cursor:"pointer", fontFamily:"DM Mono, monospace", fontWeight:700 }}
          >
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
                  <AutocompleteInput
                    value={item.producto}
                    onFieldChange={(field, value) => updateItem(item.id, field, value)}
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{ padding:"6px 8px", background:"#fff0f0", border:"1px solid #ffd5d5", borderRadius:7, color:"#ff6b6b", cursor:"pointer", flexShrink:0, fontSize:12, lineHeight:1 }}
                  >
                    ✕
                  </button>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                  <div>
                    <span style={S.label}>Precio (MXN)</span>
                    <input
                      style={S.input}
                      type="number" min={0}
                      value={item.precio}
                      onChange={(e) => updateItem(item.id, "precio", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <span style={S.label}>Cantidad</span>
                    <input
                      style={S.input}
                      type="number" min={1}
                      value={item.cantidad}
                      onChange={(e) => updateItem(item.id, "cantidad", parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>
                <input
                  style={{ ...S.input, fontSize:12 }}
                  value={item.nota || ""}
                  onChange={(e) => updateItem(item.id, "nota", e.target.value)}
                  placeholder="Nota (ej: Pago único, Por mes, Por hora…)"
                />
              </div>
            ))}
          </div>
        )}

        <div style={S.divider} />

        {/* Descuento + IVA */}
        <div style={S.sectionTitle}>Descuento e IVA</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <div>
            <span style={S.label}>Monto del descuento (MXN)</span>
            <input
              style={S.input}
              type="number" min={0}
              value={descuento || ""}
              placeholder="0"
              onChange={(e) => setDescuento(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <span style={S.label}>Etiqueta del descuento</span>
            <input
              style={S.input}
              value={descuentoNota}
              onChange={(e) => setDescuentoNota(e.target.value)}
              placeholder="Ej: HOSTING, Descuento especial…"
            />
          </div>

          {/* IVA Toggle */}
          <button
            onClick={toggleIVA}
            style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"10px 14px",
              background: includeIVA ? "#9b5cff15" : "#f5f2ff",
              border: includeIVA ? "1px solid #9b5cff50" : "1px solid #e0dbf0",
              borderRadius:10,
              cursor:"pointer",
              fontFamily:"DM Mono, monospace",
              marginTop:4,
            }}
          >
            <div style={{ textAlign:"left" }}>
              <div style={{ fontSize:13, fontWeight:700, color: includeIVA ? PURPLE_LIGHT : "#6b6580" }}>
                {includeIVA ? "IVA incluido (16%)" : "Sin IVA"}
              </div>
              {includeIVA && afterDiscount > 0 && (
                <div style={{ fontSize:11, color:"#9990b8", marginTop:2 }}>
                  +{fmtMXNShort(iva)} sobre {fmtMXNShort(afterDiscount)}
                </div>
              )}
            </div>
            <div style={{
              width:38, height:22, borderRadius:11,
              background: includeIVA ? PURPLE_LIGHT : "#d4d0e8",
              position:"relative", transition:"background 0.2s", flexShrink:0,
            }}>
              <div style={{
                position:"absolute", top:3,
                left: includeIVA ? 19 : 3,
                width:16, height:16, borderRadius:"50%",
                background:"#ffffff",
                transition:"left 0.2s",
                boxShadow:"0 1px 3px rgba(0,0,0,0.2)",
              }} />
            </div>
          </button>

          {/* Live total preview */}
          {items.length > 0 && (
            <div style={{ background:"#f8f6fd", borderRadius:10, padding:"10px 14px", marginTop:4 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#9990b8", marginBottom:4 }}>
                <span>Subtotal</span><span>{fmtMXNShort(subtotal)}</span>
              </div>
              {descuento > 0 && (
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#9990b8", marginBottom:4 }}>
                  <span>Descuento</span><span style={{ color:PURPLE_LIGHT }}>- {fmtMXNShort(descuento)}</span>
                </div>
              )}
              {includeIVA && (
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#9990b8", marginBottom:4 }}>
                  <span>IVA 16%</span><span>+ {fmtMXNShort(iva)}</span>
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:14, fontWeight:700, color:"#1a1625", borderTop:"1px solid #e8e3f5", paddingTop:6, marginTop:4 }}>
                <span>Total</span><span style={{ color:PURPLE_LIGHT }}>{fmtMXNShort(total)}</span>
              </div>
            </div>
          )}
        </div>

        <div style={S.divider} />

        {/* Notas al pie */}
        <div style={S.sectionTitle}>Notas al pie</div>
        <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:8 }}>
          {notas.map((nota, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:6, background:"#f5f2ff", borderRadius:7, padding:"6px 10px", fontSize:12, color:"#6b6580" }}>
              <span style={{ flex:1 }}>{nota}</span>
              <button
                onClick={() => removeNota(i)}
                style={{ background:"none", border:"none", cursor:"pointer", color:"#c4b5fd", fontSize:12 }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:6 }}>
          <input
            style={{ ...S.input, flex:1 }}
            value={notaExtra}
            onChange={(e) => setNotaExtra(e.target.value)}
            placeholder="Agregar nota…"
            onKeyDown={(e) => { if (e.key === "Enter") addNota(); }}
          />
          <button
            onClick={addNota}
            style={{ flexShrink:0, background:PURPLE_LIGHT, color:"#fff", border:"none", borderRadius:8, padding:"8px 14px", cursor:"pointer", fontWeight:700, fontSize:14 }}
          >
            +
          </button>
        </div>

      </aside>

      {/* ── PREVIEW PANEL ── */}
      <main style={{ flex:1, overflowY:"auto", background:"#ede9f8", padding:"24px 32px 48px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <div style={{ fontSize:11, color:"#9990b8", fontFamily:"DM Mono, monospace" }}>
            Vista previa — así se verá el PDF
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {items.length > 0 && (
              <span style={{ fontSize:13, color:"#6b6580", fontFamily:"DM Mono, monospace" }}>
                Total:{" "}
                <strong style={{ color:PURPLE_LIGHT }}>
                  {fmtMXNShort(total)}{includeIVA ? " (IVA inc.)" : ""}
                </strong>
              </span>
            )}
            <button
              onClick={downloadPDF}
              disabled={downloading || items.length === 0}
              style={{
                display:"flex", alignItems:"center", gap:7,
                background: downloading || items.length === 0 ? "#d4d0e8" : PURPLE_LIGHT,
                color:"#fff", border:"none", borderRadius:10,
                padding:"9px 18px", cursor: downloading || items.length === 0 ? "not-allowed" : "pointer",
                fontFamily:"DM Mono, monospace", fontSize:13, fontWeight:700,
              }}
            >
              ↓ {downloading ? "Generando…" : "Descargar PDF"}
            </button>
          </div>
        </div>

        <div style={{ display:"flex", justifyContent:"center" }}>
          <QuotationPreview
            ref={previewRef}
            nombre={nombre}
            telefono={telefono}
            empresa={empresa}
            ciudad={ciudad}
            invoiceId={invoiceId}
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
            items={items}
            subtotal={subtotal}
            descuento={descuento}
            descuentoNota={descuentoNota}
            afterDiscount={afterDiscount}
            iva={iva}
            total={total}
            includeIVA={includeIVA}
            notas={notas}
          />
        </div>
      </main>

    </div>
  );
}
