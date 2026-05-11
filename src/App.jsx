import { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const GOOGLE_FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');`;

const STYLES = `
  ${GOOGLE_FONTS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f2f0f8; }
  .app { min-height: 100vh; background: #f2f0f8; font-family: 'DM Mono', monospace; color: #1a1625; }
  .nav { background: #ffffff; border-bottom: 1px solid #e0dbf0; box-shadow: 0 1px 12px rgba(155,92,255,0.07); padding: 0 32px; display: flex; align-items: center; justify-content: space-between; height: 64px; position: sticky; top: 0; z-index: 100; }
  .nav-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; color: #9b5cff; letter-spacing: -0.5px; }
  .nav-logo span { color: #1a1625; }
  .nav-tabs { display: flex; gap: 4px; }
  .nav-tab { background: none; border: none; padding: 8px 18px; border-radius: 8px; font-family: 'DM Mono', monospace; font-size: 13px; cursor: pointer; color: #8b82a8; transition: all 0.15s; }
  .nav-tab:hover { color: #1a1625; background: #ede9f8; }
  .nav-tab.active { background: #9b5cff15; color: #9b5cff; }
  .nav-date { font-size: 12px; color: #9990b8; }
  .main { padding: 32px; max-width: 1200px; margin: 0 auto; }
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
  .section-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 22px; color: #1a1625; }
  .section-sub { font-size: 12px; color: #9990b8; margin-top: 3px; }
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card { background: #ffffff; border: 1px solid #e0dbf0; box-shadow: 0 2px 12px rgba(155,92,255,0.06); border-radius: 16px; padding: 24px; position: relative; overflow: hidden; transition: border-color 0.2s; }
  .stat-card:hover { border-color: #2e2e4e; }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .stat-card.purple::before { background: linear-gradient(90deg, #9b5cff, transparent); }
  .stat-card.coral::before { background: linear-gradient(90deg, #ff6b6b, transparent); }
  .stat-card.blue::before { background: linear-gradient(90deg, #4d9fff, transparent); }
  .stat-card.gold::before { background: linear-gradient(90deg, #ffd93d, transparent); }
  .stat-label { font-size: 11px; color: #9990b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
  .stat-value { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 30px; line-height: 1; letter-spacing: -0.5px; margin-bottom: 8px; }
  .stat-card.purple .stat-value { color: #9b5cff; }
  .stat-card.coral .stat-value { color: #ff6b6b; }
  .stat-card.blue .stat-value { color: #4d9fff; }
  .stat-card.gold .stat-value { color: #ffd93d; }
  .stat-sub { font-size: 11px; color: #a8a0c0; }
  .chart-card { background: #ffffff; border: 1px solid #e0dbf0; box-shadow: 0 2px 12px rgba(155,92,255,0.06); border-radius: 16px; padding: 28px; margin-bottom: 24px; }
  .chart-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
  .chart-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; color: #1a1625; margin-bottom: 8px; }
  .margin-pill { display: inline-flex; align-items: center; gap: 8px; background: #9b5cff12; border: 1px solid #9b5cff25; border-radius: 20px; padding: 5px 14px; font-size: 12px; color: #9b5cff; }
  .margin-pill strong { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 15px; }
  .chart-controls { display: flex; flex-direction: column; align-items: flex-end; gap: 12px; }
  .date-range { display: flex; align-items: center; gap: 8px; }
  .date-range-label { font-size: 11px; color: #9990b8; }
  .month-input { background: #ffffff; border: 1px solid #ddd8ef; border-radius: 8px; padding: 7px 12px; font-family: 'DM Mono', monospace; font-size: 12px; color: #6b6580; outline: none; cursor: pointer; }
  .month-input:focus { border-color: #9b5cff60; color: #1a1625; }
  .chart-legend { display: flex; gap: 16px; flex-wrap: wrap; }
  .legend-item { display: flex; align-items: center; gap: 7px; font-size: 12px; color: #666; }
  .legend-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
  .card { background: #ffffff; border: 1px solid #e0dbf0; box-shadow: 0 2px 12px rgba(155,92,255,0.06); border-radius: 16px; overflow: hidden; }
  .card-header { padding: 20px 24px 16px; border-bottom: 1px solid #e8e3f5; display: flex; align-items: center; justify-content: space-between; }
  .card-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: #1a1625; }
  .card-body { padding: 0; }
  .table { width: 100%; border-collapse: collapse; }
  .table th { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #a8a0c0; padding: 12px 24px; text-align: left; border-bottom: 1px solid #e8e3f5; font-weight: 400; }
  .table td { padding: 14px 24px; font-size: 13px; border-bottom: 1px solid #ede9f8; vertical-align: middle; }
  .table tr:last-child td { border-bottom: none; }
  .table tr:hover td { background: #f8f6fd; }
  .table .mono { font-family: 'Outfit', sans-serif; font-weight: 600; letter-spacing: -0.3px; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; }
  .badge-purple { background: #9b5cff15; color: #9b5cff; border: 1px solid #9b5cff30; }
  .badge-red { background: #ff6b6b15; color: #ff6b6b; border: 1px solid #ff6b6b30; }
  .badge-blue { background: #4d9fff15; color: #4d9fff; border: 1px solid #4d9fff30; }
  .badge-gold { background: #ffd93d15; color: #ffd93d; border: 1px solid #ffd93d30; }
  .badge-gray { background: #88888815; color: #8b82a8; border: 1px solid #88888830; }
  .badge-green { background: #10b98115; color: #10b981; border: 1px solid #10b98130; }
  .badge-teal { background: #0d9faa15; color: #0d9faa; border: 1px solid #0d9faa30; }
  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; font-family: 'DM Mono', monospace; font-size: 12px; cursor: pointer; border: none; transition: all 0.15s; font-weight: 500; }
  .btn-primary { background: #9b5cff; color: #fff; }
  .btn-primary:hover { background: #8a4aee; color: #fff; transform: translateY(-1px); }
  .btn-ghost { background: #ede9f8; color: #8b82a8; }
  .btn-ghost:hover { background: #e8e3f5; color: #1a1625; }
  .btn-danger { background: #ff6b6b20; color: #ff6b6b; border: 1px solid #ff6b6b30; }
  .btn-danger:hover { background: #ff6b6b30; }
  .btn-sm { padding: 5px 10px; font-size: 11px; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal { background: #ffffff; border: 1px solid #ddd8ef; border-radius: 20px; width: 100%; max-width: 520px; padding: 32px; box-shadow: 0 40px 80px rgba(0,0,0,0.6); }
  .modal-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 18px; color: #1a1625; margin-bottom: 24px; }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 28px; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-group.full { grid-column: 1 / -1; }
  .form-label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.8px; }
  .form-input, .form-select { background: #ffffff; border: 1px solid #ddd8ef; border-radius: 10px; padding: 10px 14px; font-family: 'DM Mono', monospace; font-size: 13px; color: #1a1625; outline: none; transition: border-color 0.15s; width: 100%; }
  .form-input:focus, .form-select:focus { border-color: #9b5cff60; }
  .form-select option { background: #ffffff; }
  .checkbox-row { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 10px 14px; background: #ffffff; border: 1px solid #ddd8ef; border-radius: 10px; }
  .checkbox-row:hover { border-color: #3a3a5e; }
  .checkbox-row input { accent-color: #9b5cff; width: 16px; height: 16px; }
  .checkbox-row label { font-size: 13px; color: #6b6580; cursor: pointer; }
  .empty { padding: 48px 24px; text-align: center; color: #a8a0c0; font-size: 13px; }
  .empty-icon { font-size: 32px; margin-bottom: 12px; opacity: 0.5; }
  .alert { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; font-size: 12px; margin-bottom: 8px; border: 1px solid transparent; }
  .alert-gold { background: #ffd93d0a; border-color: #ffd93d25; color: #b8960a; }
  .action-row { display: flex; gap: 8px; }
  .summary-grid { display: grid; gap: 1px; background: #ddd8ef; border-radius: 12px; overflow: hidden; margin-bottom: 20px; }
  .summary-cell { background: #ffffff; padding: 16px 20px; }
  .summary-cell-label { font-size: 10px; color: #9990b8; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
  .summary-cell-val { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 20px; letter-spacing: -0.3px; }
  .cat-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; }
  .table-wrap { overflow-x: auto; }
  .period-badge { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 500; }
  .period-mensual { background: #4d9fff15; color: #4d9fff; border: 1px solid #4d9fff30; }
  .period-anual { background: #fb923c15; color: #fb923c; border: 1px solid #fb923c30; }
  .period-unico { background: #10b98115; color: #10b981; border: 1px solid #10b98130; }
  .hint-box { margin-top: 12px; padding: 10px 14px; background: #fb923c10; border: 1px solid #fb923c25; border-radius: 10px; font-size: 12px; color: #fb923c; }
  .custom-tt { background: #ffffff; border: 1px solid #ddd8ef; border-radius: 12px; padding: 14px 18px; font-family: 'DM Mono', monospace; font-size: 12px; }
  .tt-label { color: #666; margin-bottom: 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; }
  .tt-row { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
  .tt-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
  .tt-name { color: #777; flex: 1; }
  .tt-val { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 14px; letter-spacing: -0.3px; }
`;

const CATEGORIES = [
  { id: "infra", label: "Infraestructura", color: "#4d9fff" },
  { id: "herramientas", label: "Herramientas", color: "#a78bfa" },
  { id: "marketing", label: "Marketing", color: "#fb923c" },
  { id: "legal", label: "Legal / Fiscal", color: "#ffd93d" },
  { id: "otros", label: "Otros", color: "#8b82a8" },
];

const CHART_BARS = [
  { key: "ingresos", label: "Ingresos", color: "#9b5cff" },
  { key: "gastos", label: "Gastos", color: "#ff6b6b" },
  { key: "ganancia", label: "Ganancia", color: "#4d9fff" },
  { key: "setup", label: "Setup fees", color: "#ffd93d" },
];

const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

const getCatColor = (id) => CATEGORIES.find(c => c.id === id)?.color || "#888";
const getCatLabel = (id) => CATEGORIES.find(c => c.id === id)?.label || id;
const fmt = (n) => "$" + Number(n || 0).toLocaleString("es-MX", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const toYM = (d) => d.slice(0, 7);
const today = () => new Date().toISOString().split("T")[0];
const nowDate = new Date().toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
const monthlyAmt = (e) => e.period === "unico" ? 0 : Number(e.amount) / (e.period === "anual" ? 12 : 1);
const clientMonthlyMaintenance = (c) => {
  if ((c.serviceType ?? "ia") === "ia") return Number(c.monthlyFee);
  return Number(c.maintenanceFee || 0) / (c.maintenancePeriod === "anual" ? 12 : 1);
};
const invoiceKey = (clientId, year, month) => `${clientId}-${year}-${month}`;

const DEMO_CLIENTS = [
  { id: "c1", name: "Clínica Hernández", serviceType: "ia", setupFee: 8000, monthlyFee: 2500, needsInvoice: true, billingDay: 1, billingFreq: "mensual", status: "activo", startDate: "2025-03-01", notes: "Requiere CFDI" },
  { id: "c2", name: "Inmobiliaria Pérez", serviceType: "ia", setupFee: 10000, monthlyFee: 3000, needsInvoice: false, billingDay: 15, billingFreq: "mensual", status: "activo", startDate: "2025-04-15", notes: "" },
  { id: "c3", name: "Restaurante Don Pepe", serviceType: "web", setupFee: 15000, monthlyFee: 0, maintenanceFee: 800, maintenancePeriod: "mensual", needsInvoice: false, billingDay: 1, billingFreq: "mensual", status: "activo", startDate: "2025-05-01", notes: "Landing page + menú digital" },
];
const DEMO_EXPENSES = [
  { id: "e1", name: "Vercel Pro", amount: 400, period: "mensual", category: "infra", date: "2025-05-01", notes: "Plan Pro" },
  { id: "e2", name: "Supabase", amount: 0, period: "mensual", category: "infra", date: "2025-05-01", notes: "Free tier" },
  { id: "e3", name: "Dominio .com", amount: 250, period: "anual", category: "infra", date: "2025-04-10", notes: "Renovación anual" },
  { id: "e4", name: "Cerebras API", amount: 150, period: "unico", category: "herramientas", date: "2025-05-03", notes: "Tokens mayo" },
];

function buildChartData(clients, expenses, fromMonth, toMonth) {
  const months = [];
  let cur = new Date(fromMonth + "-02");
  const end = new Date(toMonth + "-02");
  while (cur <= end) {
    months.push(cur.toISOString().slice(0, 7));
    cur.setMonth(cur.getMonth() + 1);
  }
  return months.map(m => {
    const activeInMonth = clients.filter(c => c.status === "activo" && toYM(c.startDate) <= m);
    const ingresos = activeInMonth.reduce((s, c) => s + clientMonthlyMaintenance(c), 0);
    const gastos = expenses.filter(e => toYM(e.date) === m).reduce((s, e) =>
      s + (e.period === "unico" ? Number(e.amount) : monthlyAmt(e)), 0);
    const setup = clients.filter(c => toYM(c.startDate) === m).reduce((s, c) => s + Number(c.setupFee), 0);
    const ganancia = Math.max(0, ingresos - gastos);
    const label = new Date(m + "-02").toLocaleDateString("es-MX", { month: "short", year: "2-digit" });
    return { month: label, ingresos, gastos, ganancia, setup };
  });
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tt">
      <div className="tt-label">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="tt-row">
          <div className="tt-dot" style={{ background: p.fill }} />
          <span className="tt-name">{CHART_BARS.find(b => b.key === p.dataKey)?.label}</span>
          <span className="tt-val" style={{ color: p.fill }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [clients, setClients] = useState(DEMO_CLIENTS);
  const [expenses, setExpenses] = useState(DEMO_EXPENSES);
  const [loaded, setLoaded] = useState(false);
  const [clientModal, setClientModal] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [editExpense, setEditExpense] = useState(null);
  const [invoicesSent, setInvoicesSent] = useState([]);

  useEffect(() => {
    try {
      const c = localStorage.getItem("iavanta-clients");
      const e = localStorage.getItem("iavanta-expenses");
      const inv = localStorage.getItem("iavanta-invoices-sent");
      if (c) setClients(JSON.parse(c));
      if (e) setExpenses(JSON.parse(e));
      if (inv) setInvoicesSent(JSON.parse(inv));
    } catch (_) {}
    setLoaded(true);
  }, []);

  const saveClients = useCallback((data) => {
    setClients(data);
    try { localStorage.setItem("iavanta-clients", JSON.stringify(data)); } catch (_) {}
  }, []);

  const saveExpenses = useCallback((data) => {
    setExpenses(data);
    try { localStorage.setItem("iavanta-expenses", JSON.stringify(data)); } catch (_) {}
  }, []);

  const markInvoiceSent = useCallback((key) => {
    setInvoicesSent(prev => {
      const updated = [...prev, key];
      try { localStorage.setItem("iavanta-invoices-sent", JSON.stringify(updated)); } catch (_) {}
      return updated;
    });
  }, []);

  const activeClients = clients.filter(c => c.status === "activo");
  const iaClients = activeClients.filter(c => (c.serviceType ?? "ia") === "ia");
  const webClients = clients.filter(c => (c.serviceType ?? "ia") === "web");
  const totalMonthly = activeClients.reduce((s, c) => s + clientMonthlyMaintenance(c), 0);
  const totalIAMonthly = iaClients.reduce((s, c) => s + Number(c.monthlyFee), 0);
  const totalWebMaintenance = activeClients.filter(c => (c.serviceType ?? "ia") === "web").reduce((s, c) => s + clientMonthlyMaintenance(c), 0);
  const totalWebRevenue = webClients.reduce((s, c) => s + Number(c.setupFee), 0);
  const now = new Date();
  const totalExpMonthly = expenses.reduce((s, e) => s + monthlyAmt(e), 0);
  const totalExpUnico = expenses.filter(e => e.period === "unico" && toYM(e.date) === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`).reduce((s, e) => s + Number(e.amount), 0);
  const profit = totalMonthly - totalExpMonthly;
  const margin = totalMonthly > 0 ? Math.round((profit / totalMonthly) * 100) : 0;
  const invoiceClients = clients.filter(c => c.needsInvoice && c.status === "activo");

  if (!loaded) return (
    <div style={{ background: "#f2f0f8", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#a8a0c0", fontFamily: "DM Mono, monospace", fontSize: 13 }}>
      cargando...
    </div>
  );

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo">IAvanta<span> / Finanzas</span></div>
          <div className="nav-tabs">
            {[["dashboard", "Dashboard"], ["clients", "Clientes"], ["expenses", "Gastos"]].map(([id, label]) => (
              <button key={id} className={`nav-tab${tab === id ? " active" : ""}`} onClick={() => setTab(id)}>{label}</button>
            ))}
          </div>
          <div className="nav-date">{nowDate}</div>
        </nav>
        <main className="main">
          {tab === "dashboard" && <Dashboard clients={clients} expenses={expenses} totalMonthly={totalMonthly} totalIAMonthly={totalIAMonthly} totalWebMaintenance={totalWebMaintenance} totalWebRevenue={totalWebRevenue} totalExpMonthly={totalExpMonthly} totalExpUnico={totalExpUnico} profit={profit} margin={margin} activeClients={activeClients} iaClients={iaClients} webClients={webClients} invoiceClients={invoiceClients} invoicesSent={invoicesSent} onMarkInvoiceSent={markInvoiceSent} now={now} />}
          {tab === "clients" && <Clients clients={clients} onSave={saveClients} modal={clientModal} setModal={setClientModal} editItem={editClient} setEditItem={setEditClient} />}
          {tab === "expenses" && <Expenses expenses={expenses} onSave={saveExpenses} modal={expenseModal} setModal={setExpenseModal} editItem={editExpense} setEditItem={setEditExpense} />}
        </main>
      </div>
    </>
  );
}

function Dashboard({ clients, expenses, totalMonthly, totalIAMonthly, totalWebMaintenance, totalWebRevenue, totalExpMonthly, totalExpUnico, profit, margin, activeClients, iaClients, webClients, invoiceClients, invoicesSent, onMarkInvoiceSent, now }) {
  const [fromMonth, setFromMonth] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
  const [toMonth, setToMonth] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);

  const chartData = buildChartData(clients, expenses, fromMonth, toMonth);

  const expByCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + monthlyAmt(e);
    return acc;
  }, {});

  const totalExpCat = Object.values(expByCategory).reduce((s, v) => s + v, 0);

  return (
    <>
      <div className="section-header">
        <div>
          <div className="section-title">Resumen general</div>
          <div className="section-sub">Todo tu negocio en un vistazo</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-label">Ingresos mensuales</div>
          <div className="stat-value">{fmt(totalMonthly)}</div>
          <div className="stat-sub">IA {fmt(totalIAMonthly)} · Web {fmt(totalWebMaintenance)}</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Lanzamientos web</div>
          <div className="stat-value">{fmt(totalWebRevenue)}</div>
          <div className="stat-sub">{webClients.length} proyecto{webClients.length !== 1 ? "s" : ""} cerrado{webClients.length !== 1 ? "s" : ""}</div>
        </div>
        <div className="stat-card coral">
          <div className="stat-label">Gastos recurrentes</div>
          <div className="stat-value">{fmt(totalExpMonthly)}</div>
          <div className="stat-sub">equiv. mensual{totalExpUnico > 0 ? ` · compras únicas ${fmt(totalExpUnico)}` : ""}</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-label">Ganancia neta</div>
          <div className="stat-value">{fmt(profit)}</div>
          <div className="stat-sub">{margin}% de margen</div>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-top">
          <div>
            <div className="chart-title">Ingresos vs Gastos por mes</div>
            <span className="margin-pill">Margen actual <strong>{margin}%</strong></span>
          </div>
          <div className="chart-controls">
            <div className="date-range">
              <span className="date-range-label">De</span>
              <input type="month" className="month-input" value={fromMonth} onChange={e => setFromMonth(e.target.value)} />
              <span className="date-range-label">a</span>
              <input type="month" className="month-input" value={toMonth} onChange={e => setToMonth(e.target.value)} />
            </div>
            <div className="chart-legend">
              {CHART_BARS.map(b => (
                <div key={b.key} className="legend-item">
                  <div className="legend-dot" style={{ background: b.color }} />
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {chartData.length === 0
          ? <div className="empty"><div className="empty-icon">📊</div>Sin datos en el rango seleccionado.</div>
          : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} barCategoryGap="28%" barGap={3}>
                <CartesianGrid stroke="#ede9f8" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#555", fontSize: 11, fontFamily: "DM Mono, monospace" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#555", fontSize: 11, fontFamily: "DM Mono, monospace" }} axisLine={false} tickLine={false} tickFormatter={v => "$" + (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v)} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "#ffffff06" }} />
                {CHART_BARS.map(b => (
                  <Bar key={b.key} dataKey={b.key} fill={b.color} radius={[4, 4, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )
        }
      </div>

      {invoiceClients.length > 0 && (() => {
        const year = now.getFullYear();
        const month = now.getMonth();
        const pending = invoiceClients.filter(c => !invoicesSent.includes(invoiceKey(c.id, year, month)));
        const sent = invoiceClients.filter(c => invoicesSent.includes(invoiceKey(c.id, year, month)));
        if (pending.length === 0 && sent.length === 0) return null;
        return (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14, color: "#6b6580", marginBottom: 10 }}>
              Facturas {MONTHS_ES[month]} {year}
              {pending.length === 0 && <span style={{ marginLeft: 8, fontSize: 12, color: "#10b981", fontWeight: 500 }}>· todas enviadas ✓</span>}
            </div>
            {pending.map(c => {
              const isWeb = (c.serviceType ?? "ia") === "web";
              const monto = isWeb ? Number(c.maintenanceFee || 0) : Number(c.monthlyFee);
              return (
                <div key={c.id} className="alert alert-gold" style={{ justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span>🧾</span>
                    <span>
                      <strong>{c.name}</strong> — requiere factura {c.billingFreq} por el mes de <strong>{MONTHS_ES[month]} {year}</strong>, el día {c.billingDay}. Monto: <strong>{fmt(monto)}</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => onMarkInvoiceSent(invoiceKey(c.id, year, month))}
                    style={{ flexShrink: 0, background: "#10b98120", border: "1px solid #10b98140", color: "#10b981", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "DM Mono, monospace", whiteSpace: "nowrap" }}
                  >
                    ✓ Marcar enviada
                  </button>
                </div>
              );
            })}
            {sent.map(c => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 12, fontSize: 12, marginBottom: 8, background: "#10b98108", border: "1px solid #10b98120", color: "#10b981" }}>
                <span>✓</span>
                <span><strong>{c.name}</strong> — factura {MONTHS_ES[month]} {year} enviada</span>
              </div>
            ))}
          </div>
        );
      })()}

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Clientes activos</div>
            <span className="badge badge-purple">{activeClients.length}</span>
          </div>
          <div className="card-body">
            {activeClients.length === 0
              ? <div className="empty"><div className="empty-icon">👤</div>Sin clientes activos</div>
              : (
                <table className="table">
                  <thead><tr><th>Cliente</th><th>Tipo</th><th>Ingreso</th><th>Factura</th></tr></thead>
                  <tbody>
                    {activeClients.map(c => {
                      const isWeb = (c.serviceType ?? "ia") === "web";
                      return (
                        <tr key={c.id}>
                          <td style={{ fontWeight: 500, color: "#1a1625" }}>{c.name}</td>
                          <td>
                            {isWeb
                              ? <span className="badge badge-teal">🌐 Web</span>
                              : <span className="badge badge-purple">🤖 IA</span>}
                          </td>
                          <td className="mono" style={{ color: isWeb ? "#0d9faa" : "#9b5cff" }}>
                            {isWeb ? fmt(c.setupFee) : fmt(c.monthlyFee) + "/mes"}
                          </td>
                          <td>{c.needsInvoice ? <span className="badge badge-gold">Sí</span> : <span className="badge badge-gray">No</span>}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Gastos por categoría</div></div>
          <div className="card-body" style={{ padding: "16px 24px" }}>
            {Object.keys(expByCategory).length === 0
              ? <div className="empty"><div className="empty-icon">💸</div>Sin gastos registrados</div>
              : Object.entries(expByCategory).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => {
                const pct = totalExpCat > 0 ? Math.round((amt / totalExpCat) * 100) : 0;
                return (
                  <div key={cat} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "#6b6580" }}>
                      <span><span className="cat-dot" style={{ background: getCatColor(cat) }} />{getCatLabel(cat)}</span>
                      <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, color: getCatColor(cat), letterSpacing: "-0.3px" }}>{fmt(amt)}</span>
                    </div>
                    <div style={{ height: 5, background: "#e8e3f5", borderRadius: 100, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: getCatColor(cat), borderRadius: 100 }} />
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    </>
  );
}

function Clients({ clients, onSave, modal, setModal, editItem, setEditItem }) {
  const blank = { id: "", name: "", serviceType: "ia", setupFee: "", monthlyFee: "", maintenanceFee: "", maintenancePeriod: "mensual", needsInvoice: false, billingDay: 1, billingFreq: "mensual", status: "activo", startDate: today(), notes: "" };
  const [form, setForm] = useState(blank);

  const openAdd = () => { setForm(blank); setEditItem(null); setModal(true); };
  const openEdit = (c) => { setForm({ ...c }); setEditItem(c.id); setModal(true); };
  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editItem) onSave(clients.map(c => c.id === editItem ? { ...form } : c));
    else onSave([...clients, { ...form, id: `c${Date.now()}` }]);
    setModal(false);
  };
  const handleDelete = (id) => { if (window.confirm("¿Eliminar este cliente?")) onSave(clients.filter(c => c.id !== id)); };
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <>
      <div className="section-header">
        <div><div className="section-title">Clientes</div><div className="section-sub">{clients.length} registros</div></div>
        <button className="btn btn-primary" onClick={openAdd}>+ Agregar cliente</button>
      </div>

      <div className="summary-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="summary-cell">
          <div className="summary-cell-label">Activos</div>
          <div className="summary-cell-val" style={{ color: "#9b5cff" }}>{clients.filter(c => c.status === "activo").length}</div>
        </div>
        <div className="summary-cell">
          <div className="summary-cell-label">Requieren factura</div>
          <div className="summary-cell-val" style={{ color: "#ffd93d" }}>{clients.filter(c => c.needsInvoice).length}</div>
        </div>
        <div className="summary-cell">
          <div className="summary-cell-label">Ingresos mensuales</div>
          <div className="summary-cell-val" style={{ color: "#4d9fff" }}>{fmt(clients.filter(c => c.status === "activo").reduce((s, c) => s + Number(c.monthlyFee), 0))}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-body table-wrap">
          {clients.length === 0
            ? <div className="empty"><div className="empty-icon">👤</div>No hay clientes todavía.</div>
            : (
              <table className="table">
                <thead>
                  <tr><th>Cliente</th><th>Tipo</th><th>Precio lanzamiento</th><th>Recurrente</th><th>Factura</th><th>Estado</th><th>Inicio</th><th></th></tr>
                </thead>
                <tbody>
                  {clients.map(c => {
                    const isWeb = (c.serviceType ?? "ia") === "web";
                    const recurrente = isWeb
                      ? (Number(c.maintenanceFee) > 0 ? `${fmt(c.maintenanceFee)}/${c.maintenancePeriod === "anual" ? "año" : "mes"}` : "—")
                      : fmt(c.monthlyFee) + "/mes";
                    return (
                    <tr key={c.id}>
                      <td>
                        <div style={{ fontWeight: 500, color: "#1a1625", fontSize: 13 }}>{c.name}</div>
                        {c.notes && <div style={{ fontSize: 11, color: "#9990b8", marginTop: 2 }}>{c.notes}</div>}
                      </td>
                      <td>
                        {isWeb
                          ? <span className="badge badge-teal">🌐 Web</span>
                          : <span className="badge badge-purple">🤖 IA</span>}
                      </td>
                      <td className="mono" style={{ color: isWeb ? "#0d9faa" : "#8b82a8" }}>{fmt(c.setupFee)}</td>
                      <td className="mono" style={{ color: isWeb ? "#0d9faa" : "#9b5cff", fontSize: recurrente === "—" ? 14 : 13 }}>
                        {recurrente}
                      </td>
                      <td>{c.needsInvoice ? <span className="badge badge-gold">Sí — {c.billingFreq}</span> : <span className="badge badge-gray">No</span>}</td>
                      <td>
                        {c.status === "activo" ? <span className="badge badge-purple">Activo</span>
                          : c.status === "pausado" ? <span className="badge badge-gold">Pausado</span>
                          : <span className="badge badge-red">Inactivo</span>}
                      </td>
                      <td style={{ color: "#9990b8", fontSize: 12 }}>{c.startDate}</td>
                      <td>
                        <div className="action-row">
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}>Editar</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>✕</button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{editItem ? "Editar cliente" : "Nuevo cliente"}</div>
            <div className="form-grid">
              <div className="form-group full">
                <div className="form-label">Nombre del negocio</div>
                <input className="form-input" value={form.name} onChange={e => f("name", e.target.value)} placeholder="Ej: Clínica Hernández" />
              </div>
              <div className="form-group full">
                <div className="form-label">Tipo de servicio</div>
                <select className="form-select" value={form.serviceType ?? "ia"} onChange={e => f("serviceType", e.target.value)}>
                  <option value="ia">🤖 IAvanta IA (mensualidad recurrente)</option>
                  <option value="web">🌐 Página web (pago único)</option>
                </select>
              </div>
              <div className="form-group">
                <div className="form-label">{(form.serviceType ?? "ia") === "web" ? "Precio del proyecto (MXN)" : "Setup fee (MXN)"}</div>
                <input className="form-input" type="number" value={form.setupFee} onChange={e => f("setupFee", e.target.value)} placeholder="0" />
              </div>
              {(form.serviceType ?? "ia") === "ia" ? (
                <div className="form-group">
                  <div className="form-label">Mensualidad (MXN)</div>
                  <input className="form-input" type="number" value={form.monthlyFee} onChange={e => f("monthlyFee", e.target.value)} placeholder="0" />
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <div className="form-label">Mantenimiento / dominio (MXN)</div>
                    <input className="form-input" type="number" value={form.maintenanceFee} onChange={e => f("maintenanceFee", e.target.value)} placeholder="0" />
                  </div>
                  <div className="form-group">
                    <div className="form-label">Periodo de mantenimiento</div>
                    <select className="form-select" value={form.maintenancePeriod ?? "mensual"} onChange={e => f("maintenancePeriod", e.target.value)}>
                      <option value="mensual">Mensual</option>
                      <option value="anual">Anual</option>
                    </select>
                  </div>
                </>
              )}
              <div className="form-group">
                <div className="form-label">Día de cobro</div>
                <input className="form-input" type="number" min={1} max={28} value={form.billingDay} onChange={e => f("billingDay", e.target.value)} placeholder="1-28" />
              </div>
              <div className="form-group">
                <div className="form-label">Frecuencia de cobro</div>
                <select className="form-select" value={form.billingFreq} onChange={e => f("billingFreq", e.target.value)}>
                  <option value="mensual">Mensual</option>
                  <option value="bimestral">Bimestral</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
              <div className="form-group">
                <div className="form-label">Estado</div>
                <select className="form-select" value={form.status} onChange={e => f("status", e.target.value)}>
                  <option value="activo">Activo</option>
                  <option value="pausado">Pausado</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
              <div className="form-group">
                <div className="form-label">Fecha de inicio</div>
                <input className="form-input" type="date" value={form.startDate} onChange={e => f("startDate", e.target.value)} />
              </div>
              <div className="form-group full">
                <div className="checkbox-row" onClick={() => f("needsInvoice", !form.needsInvoice)}>
                  <input type="checkbox" checked={form.needsInvoice} onChange={() => {}} />
                  <label>Este cliente requiere factura (CFDI)</label>
                </div>
              </div>
              <div className="form-group full">
                <div className="form-label">Notas</div>
                <input className="form-input" value={form.notes} onChange={e => f("notes", e.target.value)} placeholder="Notas adicionales..." />
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

function Expenses({ expenses, onSave, modal, setModal, editItem, setEditItem }) {
  const blank = { id: "", name: "", amount: "", period: "mensual", category: "infra", date: today(), notes: "" };
  const [form, setForm] = useState(blank);

  const openAdd = () => { setForm(blank); setEditItem(null); setModal(true); };
  const openEdit = (e) => { setForm({ ...e }); setEditItem(e.id); setModal(true); };
  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editItem) onSave(expenses.map(e => e.id === editItem ? { ...form } : e));
    else onSave([...expenses, { ...form, id: `e${Date.now()}` }]);
    setModal(false);
  };
  const handleDelete = (id) => { if (window.confirm("¿Eliminar este gasto?")) onSave(expenses.filter(e => e.id !== id)); };
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const totalMonthlyEq = expenses.reduce((s, e) => s + monthlyAmt(e), 0);
  const totalUnico = expenses.filter(e => e.period === "unico").reduce((s, e) => s + Number(e.amount), 0);

  return (
    <>
      <div className="section-header">
        <div><div className="section-title">Gastos y compras</div><div className="section-sub">{expenses.length} registros</div></div>
        <button className="btn btn-primary" onClick={openAdd}>+ Agregar gasto</button>
      </div>

      <div className="summary-grid" style={{ gridTemplateColumns: `repeat(${CATEGORIES.length + 2}, 1fr)` }}>
        <div className="summary-cell">
          <div className="summary-cell-label">Total recurrente/mes</div>
          <div className="summary-cell-val" style={{ color: "#ff6b6b" }}>{fmt(totalMonthlyEq)}</div>
        </div>
        <div className="summary-cell">
          <div className="summary-cell-label">Compras únicas</div>
          <div className="summary-cell-val" style={{ color: "#10b981" }}>{fmt(totalUnico)}</div>
        </div>
        {CATEGORIES.map(cat => {
          const amt = expenses.filter(e => e.category === cat.id).reduce((s, e) => s + monthlyAmt(e), 0);
          return (
            <div key={cat.id} className="summary-cell">
              <div className="summary-cell-label"><span className="cat-dot" style={{ background: cat.color }} />{cat.label}</div>
              <div className="summary-cell-val" style={{ color: cat.color }}>{fmt(amt)}</div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="card-body table-wrap">
          {expenses.length === 0
            ? <div className="empty"><div className="empty-icon">💸</div>No hay gastos registrados.</div>
            : (
              <table className="table">
                <thead>
                  <tr><th>Concepto</th><th>Periodo</th><th>Monto</th><th>Equiv. mensual</th><th>Categoría</th><th>Fecha</th><th>Notas</th><th></th></tr>
                </thead>
                <tbody>
                  {[...expenses].sort((a, b) => b.date.localeCompare(a.date)).map(e => (
                    <tr key={e.id}>
                      <td style={{ fontWeight: 500, color: "#1a1625" }}>{e.name}</td>
                      <td>
                        <span className={`period-badge ${e.period === "anual" ? "period-anual" : e.period === "unico" ? "period-unico" : "period-mensual"}`}>
                          {e.period === "anual" ? "Anual" : e.period === "unico" ? "Pago único" : "Mensual"}
                        </span>
                      </td>
                      <td className="mono" style={{ color: "#ff6b6b" }}>{fmt(e.amount)}</td>
                      <td>
                        {e.period === "anual"
                          ? <span className="mono" style={{ color: "#8b82a8" }}>{fmt(monthlyAmt(e))}<span style={{ color: "#a8a0c0", fontSize: 10, marginLeft: 4 }}>/mes</span></span>
                          : e.period === "unico"
                          ? <span style={{ color: "#10b981", fontSize: 11 }}>no recurrente</span>
                          : <span style={{ color: "#ccc", fontSize: 12 }}>—</span>}
                      </td>
                      <td>
                        <span className="badge" style={{ background: `${getCatColor(e.category)}15`, color: getCatColor(e.category), border: `1px solid ${getCatColor(e.category)}30` }}>
                          <span className="cat-dot" style={{ background: getCatColor(e.category) }} />{getCatLabel(e.category)}
                        </span>
                      </td>
                      <td style={{ color: "#9990b8", fontSize: 12 }}>{e.date}</td>
                      <td style={{ color: "#9990b8", fontSize: 12 }}>{e.notes || "—"}</td>
                      <td>
                        <div className="action-row">
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(e)}>Editar</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(e.id)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={ex => ex.stopPropagation()}>
            <div className="modal-title">{editItem ? "Editar gasto" : "Nuevo gasto"}</div>
            <div className="form-grid">
              <div className="form-group full">
                <div className="form-label">Concepto</div>
                <input className="form-input" value={form.name} onChange={e => f("name", e.target.value)} placeholder="Ej: Vercel Pro, dominio, etc." />
              </div>
              <div className="form-group">
                <div className="form-label">Monto (MXN)</div>
                <input className="form-input" type="number" value={form.amount} onChange={e => f("amount", e.target.value)} placeholder="0" />
              </div>
              <div className="form-group">
                <div className="form-label">Periodo del gasto</div>
                <select className="form-select" value={form.period} onChange={e => f("period", e.target.value)}>
                  <option value="mensual">Mensual</option>
                  <option value="anual">Anual</option>
                  <option value="unico">Único / cuando lo necesito</option>
                </select>
              </div>
              <div className="form-group">
                <div className="form-label">Categoría</div>
                <select className="form-select" value={form.category} onChange={e => f("category", e.target.value)}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <div className="form-label">Fecha de registro</div>
                <input className="form-input" type="date" value={form.date} onChange={e => f("date", e.target.value)} />
              </div>
              <div className="form-group full">
                <div className="form-label">Notas</div>
                <input className="form-input" value={form.notes} onChange={e => f("notes", e.target.value)} placeholder="Opcional..." />
              </div>
            </div>
            {form.period === "anual" && Number(form.amount) > 0 && (
              <div className="hint-box">
                Equiv. mensual: <strong>{fmt(Number(form.amount) / 12)}</strong> / mes
              </div>
            )}
            {form.period === "unico" && (
              <div style={{ marginTop: 12, padding: "10px 14px", background: "#10b98110", border: "1px solid #10b98125", borderRadius: 10, fontSize: 12, color: "#10b981" }}>
                Este gasto no afecta tus gastos recurrentes mensuales — solo aparece en la gráfica el mes que lo pagaste.
              </div>
            )}
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
