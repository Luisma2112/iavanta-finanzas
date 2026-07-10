import { useState } from "react";
import { WEB_SUBTYPES, fmt, today, toYM } from "./shared.js";

export const PROSPECT_STAGES = [
  { id: "nuevo",       label: "Nuevo",        color: "#8b82a8", prob: 0.10 },
  { id: "contactado",  label: "Contactado",   color: "#4d9fff", prob: 0.25 },
  { id: "demo",        label: "Demo enviada", color: "#0d9faa", prob: 0.45 },
  { id: "propuesta",   label: "Propuesta",    color: "#a78bfa", prob: 0.65 },
  { id: "negociacion", label: "Negociación",  color: "#fb923c", prob: 0.80 },
  { id: "ganado",      label: "Ganado",       color: "#10b981", prob: 1.00 },
  { id: "perdido",     label: "Perdido",      color: "#ff6b6b", prob: 0 },
];

const SOURCES = [
  { id: "instagram", label: "Instagram" },
  { id: "referido",  label: "Referido" },
  { id: "frio",      label: "Contacto frío" },
  { id: "web",       label: "Sitio web" },
  { id: "otro",      label: "Otro" },
];

const OPEN_STAGES = PROSPECT_STAGES.filter(s => s.id !== "ganado" && s.id !== "perdido").map(s => s.id);

const stage = (id) => PROSPECT_STAGES.find(s => s.id === id) ?? PROSPECT_STAGES[0];
const sourceLabel = (id) => SOURCES.find(s => s.id === id)?.label ?? "—";
const isOpen = (p) => OPEN_STAGES.includes(p.stage);

// Acepta "midemo.vercel.app" tal cual y lo vuelve abrible.
export function normalizeUrl(url) {
  const raw = (url || "").trim();
  if (!raw) return "";
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

// Los prospectos abiertos cuya fecha de seguimiento ya llegó o ya pasó.
export function prospectsNeedingFollowUp(prospects) {
  const hoy = today();
  return prospects
    .filter(p => isOpen(p) && p.nextActionDate && p.nextActionDate <= hoy)
    .sort((a, b) => a.nextActionDate.localeCompare(b.nextActionDate));
}

export function daysOverdue(dateStr) {
  const ms = new Date(today()) - new Date(dateStr);
  return Math.max(0, Math.round(ms / 86400000));
}

function waLink(phone, contact, name, demoUrl) {
  const digits = (phone || "").replace(/\D/g, "");
  if (!digits) return "";
  const full = digits.length === 10 ? `52${digits}` : digits;
  const quien = contact?.trim() || name;
  const url = normalizeUrl(demoUrl);
  const msg = url
    ? `Hola ${quien}, te comparto la demo de tu página: ${url}`
    : `Hola ${quien}, te escribo de IAvanta.`;
  return `https://wa.me/${full}?text=${encodeURIComponent(msg)}`;
}

const DEMO_PROSPECTS = [
  { id: "p1", name: "Dental Sonrisa", contact: "Dra. Ruiz", phone: "5512345678", email: "", demoUrl: "dental-sonrisa-demo.vercel.app", websiteUrl: "", source: "instagram", serviceType: "web", webServiceSubtype: "landing", estValue: 2500, stage: "demo", nextActionDate: today(), notes: "Le urge para su apertura", createdAt: today() },
  { id: "p2", name: "Taller Márquez", contact: "Luis Márquez", phone: "", email: "luis@taller.mx", demoUrl: "", websiteUrl: "", source: "referido", serviceType: "ia", webServiceSubtype: "", estValue: 2200, stage: "contactado", nextActionDate: "", notes: "", createdAt: today() },
];

export function Prospectos({ prospects, onSave, onConvert }) {
  const blank = {
    id: "", name: "", contact: "", phone: "", email: "", demoUrl: "", websiteUrl: "",
    source: "instagram", serviceType: "web", webServiceSubtype: "", estValue: "",
    stage: "nuevo", nextActionDate: "", notes: "", createdAt: today(),
  };
  const [form, setForm] = useState(blank);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [copied, setCopied] = useState("");

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const openAdd = () => { setForm(blank); setEditItem(null); setModal(true); };
  const openEdit = (p) => { setForm({ ...p }); setEditItem(p.id); setModal(true); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editItem) onSave(prospects.map(p => p.id === editItem ? { ...form } : p));
    else onSave([...prospects, { ...form, id: `p${Date.now()}`, createdAt: today() }]);
    setModal(false);
  };
  const handleDelete = (id) => {
    if (window.confirm("¿Eliminar este prospecto?")) onSave(prospects.filter(p => p.id !== id));
  };
  const moveStage = (p, dir) => {
    const i = PROSPECT_STAGES.findIndex(s => s.id === p.stage);
    const next = PROSPECT_STAGES[i + dir];
    if (!next) return;
    onSave(prospects.map(x => x.id === p.id ? { ...x, stage: next.id } : x));
  };
  const copyLink = async (p) => {
    try {
      await navigator.clipboard.writeText(normalizeUrl(p.demoUrl));
      setCopied(p.id);
      setTimeout(() => setCopied(""), 1600);
    } catch (_) {}
  };
  const convert = (p) => {
    if (!window.confirm(`¿Convertir "${p.name}" en cliente activo?`)) return;
    const clientId = onConvert(p);
    onSave(prospects.map(x => x.id === p.id ? { ...x, convertedClientId: clientId } : x));
  };

  const abiertos = prospects.filter(isOpen);
  const pipeline = abiertos.reduce((s, p) => s + Number(p.estValue || 0), 0);
  const ponderado = abiertos.reduce((s, p) => s + Number(p.estValue || 0) * stage(p.stage).prob, 0);
  const ganadosMes = prospects.filter(p => p.stage === "ganado" && toYM(p.createdAt || today()) === toYM(today()));

  return (
    <>
      <div className="section-header">
        <div>
          <div className="section-title">Prospectos</div>
          <div className="section-sub">{abiertos.length} en pipeline · {prospects.length} en total</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Agregar prospecto</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-label">Prospectos activos</div>
          <div className="stat-value">{abiertos.length}</div>
          <div className="stat-sub">sin contar ganados ni perdidos</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Valor en pipeline</div>
          <div className="stat-value">{fmt(pipeline)}</div>
          <div className="stat-sub">suma de todo lo abierto</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-label">Valor ponderado</div>
          <div className="stat-value">{fmt(ponderado)}</div>
          <div className="stat-sub">ajustado por probabilidad de cierre</div>
        </div>
        <div className="stat-card coral">
          <div className="stat-label">Ganados este mes</div>
          <div className="stat-value">{ganadosMes.length}</div>
          <div className="stat-sub">{fmt(ganadosMes.reduce((s, p) => s + Number(p.estValue || 0), 0))} cerrados</div>
        </div>
      </div>

      {prospects.length === 0 ? (
        <div className="card">
          <div className="empty"><div className="empty-icon">🎯</div>No hay prospectos todavía. Agrega el primero.</div>
        </div>
      ) : (
        <div className="kanban">
          {PROSPECT_STAGES.map(col => {
            const items = prospects.filter(p => p.stage === col.id);
            return (
              <div key={col.id} className="kanban-col">
                <div className="kanban-col-head" style={{ borderTopColor: col.color }}>
                  <span style={{ color: col.color }}>{col.label}</span>
                  <span className="kanban-count">{items.length}</span>
                </div>
                <div className="kanban-col-body">
                  {items.length === 0 && <div className="kanban-empty">—</div>}
                  {items.map(p => {
                    const i = PROSPECT_STAGES.findIndex(s => s.id === p.stage);
                    const demo = normalizeUrl(p.demoUrl);
                    const wa = waLink(p.phone, p.contact, p.name, p.demoUrl);
                    const vencido = isOpen(p) && p.nextActionDate && p.nextActionDate <= today();
                    return (
                      <div key={p.id} className="p-card">
                        <div className="p-name">{p.name}</div>
                        <div className="p-contact">{[p.contact, sourceLabel(p.source)].filter(Boolean).join(" · ")}</div>

                        <div className="p-meta">
                          {p.serviceType === "web"
                            ? <span className="badge badge-teal">🌐 {WEB_SUBTYPES.find(s => s.id === p.webServiceSubtype)?.label ?? "Web"}</span>
                            : <span className="badge badge-purple">🤖 IA</span>}
                          <span className="p-value">{fmt(p.estValue)}</span>
                        </div>

                        {demo && (
                          <div className="p-links">
                            <a className="link-chip" href={demo} target="_blank" rel="noopener noreferrer">🔗 Ver demo</a>
                            <button className="link-chip" onClick={() => copyLink(p)}>
                              {copied === p.id ? "✓ Copiado" : "Copiar"}
                            </button>
                            {wa && <a className="link-chip wa" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
                          </div>
                        )}

                        {p.nextActionDate && (
                          <div className={`p-due${vencido ? " late" : ""}`}>
                            {vencido ? "⏰ Seguimiento vencido" : "📅 Seguimiento"} · {p.nextActionDate}
                          </div>
                        )}

                        {p.convertedClientId && <div className="p-converted">✓ Ya es cliente</div>}

                        <div className="p-foot">
                          <div className="p-move">
                            <button className="move-btn" disabled={i === 0} onClick={() => moveStage(p, -1)} title="Etapa anterior">‹</button>
                            <button className="move-btn" disabled={i === PROSPECT_STAGES.length - 1} onClick={() => moveStage(p, 1)} title="Etapa siguiente">›</button>
                          </div>
                          <div className="p-move">
                            <button className="move-btn" onClick={() => openEdit(p)} title="Editar">✎</button>
                            <button className="move-btn danger" onClick={() => handleDelete(p.id)} title="Eliminar">✕</button>
                          </div>
                        </div>

                        {p.stage === "ganado" && !p.convertedClientId && (
                          <button className="btn btn-primary btn-sm p-convert" onClick={() => convert(p)}>
                            → Convertir a cliente
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{editItem ? "Editar prospecto" : "Nuevo prospecto"}</div>
            <div className="form-grid">
              <div className="form-group full">
                <div className="form-label">Nombre del negocio</div>
                <input className="form-input" value={form.name} onChange={e => f("name", e.target.value)} placeholder="Ej: Dental Sonrisa" />
              </div>
              <div className="form-group">
                <div className="form-label">Persona de contacto</div>
                <input className="form-input" value={form.contact} onChange={e => f("contact", e.target.value)} placeholder="Ej: Dra. Ruiz" />
              </div>
              <div className="form-group">
                <div className="form-label">Teléfono / WhatsApp</div>
                <input className="form-input" value={form.phone} onChange={e => f("phone", e.target.value)} placeholder="10 dígitos" />
              </div>
              <div className="form-group full">
                <div className="form-label">Email</div>
                <input className="form-input" type="email" value={form.email} onChange={e => f("email", e.target.value)} placeholder="correo@negocio.mx" />
              </div>

              <div className="form-group full">
                <div className="form-label">Link de la demo</div>
                <input className="form-input" value={form.demoUrl} onChange={e => f("demoUrl", e.target.value)} placeholder="demo-cliente.vercel.app" />
                {form.demoUrl.trim() && (
                  <a className="link-chip" style={{ marginTop: 6, alignSelf: "flex-start" }} href={normalizeUrl(form.demoUrl)} target="_blank" rel="noopener noreferrer">
                    🔗 Abrir {normalizeUrl(form.demoUrl)}
                  </a>
                )}
              </div>
              <div className="form-group full">
                <div className="form-label">Sitio web actual (opcional)</div>
                <input className="form-input" value={form.websiteUrl} onChange={e => f("websiteUrl", e.target.value)} placeholder="negocio.com" />
              </div>

              <div className="form-group">
                <div className="form-label">Origen</div>
                <select className="form-select" value={form.source} onChange={e => f("source", e.target.value)}>
                  {SOURCES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <div className="form-label">Etapa</div>
                <select className="form-select" value={form.stage} onChange={e => f("stage", e.target.value)}>
                  {PROSPECT_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>

              <div className="form-group full">
                <div className="form-label">Servicio de interés</div>
                <select className="form-select" value={form.serviceType} onChange={e => { f("serviceType", e.target.value); f("webServiceSubtype", ""); f("estValue", ""); }}>
                  <option value="web">🌐 Página web (pago único)</option>
                  <option value="ia">🤖 IAvanta IA (mensualidad recurrente)</option>
                </select>
              </div>
              {form.serviceType === "web" && (
                <div className="form-group full">
                  <div className="form-label">Tipo de proyecto web</div>
                  <select
                    className="form-select"
                    value={form.webServiceSubtype}
                    onChange={e => {
                      const sub = WEB_SUBTYPES.find(s => s.id === e.target.value);
                      f("webServiceSubtype", e.target.value);
                      if (sub) f("estValue", String(sub.price));
                    }}
                  >
                    <option value="">— Seleccionar —</option>
                    {WEB_SUBTYPES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                  {form.webServiceSubtype && (() => {
                    const sub = WEB_SUBTYPES.find(s => s.id === form.webServiceSubtype);
                    return sub ? <div style={{ marginTop: 6, fontSize: 11, color: "#9b5cff" }}>{sub.hint}</div> : null;
                  })()}
                </div>
              )}
              <div className="form-group">
                <div className="form-label">{form.serviceType === "web" ? "Valor del proyecto (MXN)" : "Mensualidad estimada (MXN)"}</div>
                <input className="form-input" type="number" value={form.estValue} onChange={e => f("estValue", e.target.value)} placeholder="0" />
              </div>
              <div className="form-group">
                <div className="form-label">Próximo seguimiento</div>
                <input className="form-input" type="date" value={form.nextActionDate} onChange={e => f("nextActionDate", e.target.value)} />
              </div>

              <div className="form-group full">
                <div className="form-label">Notas</div>
                <textarea className="form-input" value={form.notes} onChange={e => f("notes", e.target.value)} placeholder="Qué necesita, qué se habló, objeciones..." />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { DEMO_PROSPECTS };
