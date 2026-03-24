import { useState, useEffect, useCallback } from "react";

const SUPABASE_URL = "https://xtlaxsuhzgohplgstljg.supabase.co";
const SUPABASE_KEY = "sb_publishable_MeqHXSdD2r3vzDBYKfTWEw_zEzXnxsk";

const db = async (path, options = {}) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: options.prefer || "return=representation",
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

const tzs  = (n) => "TZS " + Math.round(n).toLocaleString("en");
const YEAR  = new Date().getFullYear();

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800;900&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:        #f0f2f5;
  --white:     #ffffff;
  --border:    #dde1e8;
  --text:      #111827;
  --muted:     #6b7280;
  --accent:    #1d4ed8;
  --accent-lt: #eff3ff;
  --green:     #15803d;
  --green-lt:  #f0fdf4;
  --green-br:  #bbf7d0;
  --orange:    #c2410c;
  --orange-lt: #fff7ed;
  --warn:      #b45309;
  --warn-lt:   #fffbeb;
  --font: 'Barlow', sans-serif;
  --r: 14px;
}

html, body, #root { height: 100%; font-family: var(--font); background: var(--bg); color: var(--text); -webkit-font-smoothing: antialiased; }
.shell { display: flex; flex-direction: column; height: 100dvh; width: 100%; background: var(--white); }

/* TOPBAR */
.topbar { padding: 16px 20px 13px; border-bottom: 1.5px solid var(--border); flex-shrink: 0; background: var(--white); display: flex; align-items: center; justify-content: space-between; }
.topbar-title { font-size: 22px; font-weight: 900; color: var(--accent); letter-spacing: 1px; text-transform: uppercase; }
.topbar-sub { font-size: 10px; color: var(--muted); font-weight: 700; margin-top: 1px; letter-spacing: 1.5px; text-transform: uppercase; }
.sync-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); flex-shrink: 0; }
.sync-dot.loading { background: var(--warn); animation: pulse 1s infinite; }
.sync-dot.error { background: var(--orange); }
@keyframes pulse { 0%,100%{opacity:1;}50%{opacity:0.3;} }

.page { flex: 1; overflow-y: auto; padding: 18px; padding-bottom: 8px; }

/* BOTTOM NAV */
.bottomnav { display: flex; border-top: 1.5px solid var(--border); flex-shrink: 0; padding-bottom: env(safe-area-inset-bottom,0); background: var(--white); }
.tab-btn { flex:1; border:none; background:none; padding:10px 4px 12px; display:flex; flex-direction:column; align-items:center; gap:3px; font-family:var(--font); font-size:10px; font-weight:700; color:var(--muted); cursor:pointer; transition:color 0.15s; letter-spacing:0.5px; text-transform:uppercase; position:relative; }
.tab-btn.active { color: var(--accent); }
.tab-btn.active::after { content:''; position:absolute; top:0; left:50%; transform:translateX(-50%); width:28px; height:2px; background:var(--accent); border-radius:0 0 3px 3px; }
.tab-icon { font-size: 20px; line-height: 1; }
.tab-badge { position:absolute; top:6px; right:calc(50% - 16px); background:var(--orange); color:#fff; border-radius:10px; font-size:9px; font-weight:900; padding:1px 5px; min-width:16px; text-align:center; }

.pg-heading { font-size: 18px; font-weight: 900; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
.pg-sub { font-size: 12px; color: var(--muted); font-weight: 600; margin-bottom: 18px; }

/* VALUE CARDS */
.total-card { border-radius:var(--r); padding:22px 20px; margin-bottom:18px; position:relative; overflow:hidden; }
.total-card.blue  { background: var(--accent); }
.total-card.green { background: var(--green); }
.total-card::before { content:''; position:absolute; top:-20px; right:-20px; width:100px; height:100px; border-radius:50%; background:rgba(255,255,255,0.07); }
.total-card::after  { content:''; position:absolute; bottom:-30px; left:30px; width:80px; height:80px; border-radius:50%; background:rgba(255,255,255,0.05); }
.total-lbl { font-size:10px; font-weight:700; color:rgba(255,255,255,0.55); letter-spacing:2px; text-transform:uppercase; margin-bottom:6px; }
.total-val { font-size:28px; font-weight:900; color:#fff; line-height:1; }
.total-sub { font-size:12px; color:rgba(255,255,255,0.55); margin-top:7px; font-weight:600; }

/* ITEM LIST */
.item-list { display:flex; flex-direction:column; gap:0; border:1.5px solid var(--border); border-radius:var(--r); overflow:hidden; margin-bottom:8px; }
.item-row { background:var(--white); border-bottom:1px solid var(--border); padding:13px 16px; }
.item-row:last-child { border-bottom:none; }
.item-row-main { display:flex; align-items:center; gap:10px; }
.item-name { flex:1; font-size:14px; font-weight:700; min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.item-right { text-align:right; }
.item-val { font-size:14px; font-weight:800; color:var(--accent); }
.item-sub { font-size:11px; color:var(--muted); font-weight:600; }

/* INCOMING */
.incoming-card { background:var(--white); border:1.5px solid var(--border); border-radius:var(--r); overflow:hidden; margin-bottom:8px; }
.incoming-row { border-bottom:1px solid var(--border); padding:14px 16px; }
.incoming-row:last-child { border-bottom:none; }
.inc-top { display:flex; align-items:flex-start; gap:8px; margin-bottom:10px; }
.inc-dot { width:10px; height:10px; border-radius:50%; background:var(--orange); flex-shrink:0; margin-top:4px; }
.inc-name { font-size:14px; font-weight:700; flex:1; }
.inc-meta { font-size:12px; color:var(--muted); font-weight:600; margin-top:2px; }
.inc-val { font-size:14px; font-weight:800; color:var(--warn); white-space:nowrap; }
.inc-val-sub { font-size:10px; color:var(--muted); font-weight:600; text-align:right; }
.arrive-form { background:var(--green-lt); border-top:1px solid var(--green-br); padding:12px 14px; }
.arrive-label { font-size:10px; font-weight:800; color:var(--green); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; }
.arrive-row { display:flex; gap:8px; align-items:center; }
.arrive-row .inp { flex:1; padding:10px 12px; font-size:14px; }
.arrive-btn { background:var(--green); color:#fff; border:none; border-radius:10px; padding:0 16px; height:44px; font-family:var(--font); font-size:13px; font-weight:800; cursor:pointer; white-space:nowrap; flex-shrink:0; }
.arrive-btn:active { opacity:0.8; }
.arrive-btn:disabled { opacity:0.5; cursor:not-allowed; }

.new-purchase { background:#f8f9ff; border:1.5px solid #d0d9f5; border-radius:var(--r); padding:18px; }
.new-purchase-title { font-size:13px; font-weight:900; color:var(--accent); margin-bottom:16px; text-transform:uppercase; letter-spacing:0.5px; }

/* FORMS */
.field { margin-bottom:14px; }
.lbl { display:block; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1px; color:var(--muted); margin-bottom:6px; }
.inp, .sel { width:100%; padding:12px 15px; background:var(--white); border:1.5px solid var(--border); border-radius:10px; font-family:var(--font); font-size:15px; font-weight:700; color:var(--text); outline:none; appearance:none; -webkit-appearance:none; transition:border-color 0.15s; }
.inp:focus, .sel:focus { border-color:var(--accent); }
.inp::placeholder { color:#bbb; font-weight:600; }
.inp[type=number]::-webkit-inner-spin-button, .inp[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; margin:0; }
.inp[type=number] { -moz-appearance:textfield; }
.sel-wrap { position:relative; }
.sel-wrap::after { content:'▾'; position:absolute; right:15px; top:50%; transform:translateY(-50%); color:var(--muted); pointer-events:none; font-size:13px; }
.preview-box { border-radius:10px; padding:11px 15px; margin-bottom:14px; font-size:13px; font-weight:700; display:flex; justify-content:space-between; align-items:center; gap:8px; }
.preview-box.blue  { background:var(--accent-lt); color:var(--accent); }
.preview-box.warn  { background:var(--warn-lt);   color:var(--warn); }
.cta { width:100%; padding:14px; border:none; border-radius:10px; font-family:var(--font); font-size:14px; font-weight:800; cursor:pointer; transition:opacity 0.15s,transform 0.1s; text-transform:uppercase; letter-spacing:0.8px; }
.cta:active { transform:scale(0.97); opacity:0.85; }
.cta:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
.cta-blue   { background:var(--accent); color:#fff; }
.cta-orange { background:var(--orange); color:#fff; }
.cta-green  { background:var(--green);  color:#fff; }

/* CATALOGUE */
.form-card { background:var(--bg); border:1.5px solid var(--border); border-radius:var(--r); padding:20px; }
.form-heading { font-size:18px; font-weight:900; margin-bottom:3px; text-transform:uppercase; letter-spacing:0.5px; }
.form-sub { font-size:12px; color:var(--muted); font-weight:600; margin-bottom:22px; }
.edit-btn { background:var(--accent-lt); border:none; border-radius:8px; padding:6px 12px; font-size:12px; font-weight:700; color:var(--accent); cursor:pointer; font-family:var(--font); white-space:nowrap; flex-shrink:0; }
.edit-btn.cancel { background:#f3f4f6; color:var(--muted); }
.inline-edit { background:var(--accent-lt); border-top:1px solid #c7d7fa; padding:12px 14px; }
.inline-edit-label { font-size:10px; font-weight:800; color:var(--accent); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; }
.inline-edit-row { display:flex; gap:8px; }
.inline-edit-row .inp { flex:1; padding:10px 13px; font-size:14px; }
.save-btn { background:var(--accent); color:#fff; border:none; border-radius:10px; padding:0 16px; font-family:var(--font); font-size:13px; font-weight:800; cursor:pointer; white-space:nowrap; }
.save-btn:disabled { opacity:0.5; cursor:not-allowed; }
.divider { height:1.5px; background:var(--border); margin:20px 0; }
.add-cat-card { background:#f8f9ff; border:1.5px solid #d0d9f5; border-radius:var(--r); padding:18px; }
.add-cat-title { font-size:13px; font-weight:900; color:var(--accent); margin-bottom:15px; text-transform:uppercase; letter-spacing:0.5px; }

/* SHOP TAB */
.rev-row { background:var(--white); border-bottom:1px solid var(--border); padding:13px 16px; display:flex; align-items:center; gap:10px; }
.rev-row:last-child { border-bottom:none; }
.rev-name { flex:1; font-size:14px; font-weight:700; min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.rev-val { font-size:14px; font-weight:800; color:var(--green); text-align:right; }
.rev-sub { font-size:11px; color:var(--muted); font-weight:600; text-align:right; }

/* GOALS */
.goal-row { background:var(--white); border-bottom:1px solid var(--border); padding:14px 16px; }
.goal-row:last-child { border-bottom:none; }
.goal-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
.goal-name { font-size:14px; font-weight:700; flex:1; min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-right:8px; }
.goal-nums { font-size:12px; font-weight:700; color:var(--muted); white-space:nowrap; }
.goal-nums span { color:var(--accent); font-weight:800; }
.progress-bar { height:6px; background:var(--border); border-radius:4px; overflow:hidden; }
.progress-fill { height:100%; border-radius:4px; background:var(--accent); transition:width 0.4s ease; }
.progress-fill.done { background:var(--green); }
.progress-fill.warn { background:var(--warn); }
.goal-footer { display:flex; justify-content:space-between; margin-top:5px; font-size:10px; font-weight:700; color:var(--muted); }
.goal-edit-btn { background:none; border:none; font-size:10px; font-weight:800; color:var(--accent); cursor:pointer; font-family:var(--font); padding:0; text-transform:uppercase; letter-spacing:0.5px; }

.goal-set-card { background:#f0fdf4; border:1.5px solid var(--green-br); border-radius:var(--r); padding:18px; margin-top:16px; }
.goal-set-title { font-size:13px; font-weight:900; color:var(--green); margin-bottom:15px; text-transform:uppercase; letter-spacing:0.5px; }

.pill-row { display:flex; gap:8px; margin-bottom:16px; }
.pill { padding:7px 20px; border-radius:40px; font-size:12px; font-weight:800; border:1.5px solid var(--border); background:var(--white); color:var(--muted); cursor:pointer; font-family:var(--font); letter-spacing:0.3px; transition:all 0.15s; }
.pill.active { background:var(--accent); color:#fff; border-color:var(--accent); }

.empty-state { text-align:center; padding:40px 20px; color:var(--muted); font-size:14px; font-weight:600; }
.empty-icon { font-size:40px; display:block; margin-bottom:10px; }

/* HISTORY */
.hist-row { background:var(--white); border-bottom:1px solid var(--border); padding:12px 16px; display:flex; align-items:center; gap:12px; }
.hist-row:last-child { border-bottom:none; }
.hist-badge { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0; }
.hist-badge.in  { background:var(--green-lt); }
.hist-badge.out { background:var(--orange-lt); }
.hist-info { flex:1; min-width:0; }
.hist-name { font-size:13px; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.hist-time { font-size:10px; color:var(--muted); font-weight:600; margin-top:2px; }
.hist-right { text-align:right; flex-shrink:0; }
.hist-val { font-size:13px; font-weight:800; }
.hist-val.in  { color:var(--green); }
.hist-val.out { color:var(--orange); }
.hist-doz { font-size:10px; color:var(--muted); font-weight:600; }
.loading-screen { display:flex; flex-direction:column; align-items:center; justify-content:center; flex:1; gap:12px; color:var(--muted); font-size:14px; font-weight:700; }
.spinner { width:32px; height:32px; border:3px solid var(--border); border-top-color:var(--accent); border-radius:50%; animation:spin 0.7s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
.toast { position:fixed; bottom:80px; left:50%; transform:translateX(-50%); background:#111827; color:#fff; padding:10px 22px; border-radius:40px; font-size:13px; font-weight:700; z-index:999; white-space:nowrap; pointer-events:none; animation:tin 0.25s ease,tout 0.3s ease 2.4s forwards; }
.toast.err { background:var(--orange); }
@keyframes tin  { from{opacity:0;transform:translate(-50%,10px);}to{opacity:1;transform:translate(-50%,0);} }
@keyframes tout { to{opacity:0;} }
`;

export default function App() {
  const [tab, setTab]             = useState(0);
  const [catalogue, setCatalogue] = useState([]);
  const [stock, setStock]         = useState([]);
  const [incoming, setIncoming]   = useState([]);
  const [sales, setSales]         = useState([]);
  const [goals, setGoals]         = useState([]);
  const [history, setHistory]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [syncState, setSyncState] = useState("ok");
  const [toast, setToast]         = useState(null);

  const [homeTab, setHomeTab] = useState("summary"); // summary | history
  const [incCatId, setIncCatId]     = useState("");
  const [incDoz, setIncDoz]         = useState("");
  const [incPrice, setIncPrice]     = useState("");
  const [arrivingId, setArrivingId] = useState(null);
  const [arriveDoz, setArriveDoz]   = useState("");
  // remove form
  const [remId, setRemId]   = useState("");
  const [remDoz, setRemDoz] = useState("");
  // catalogue form
  const [newName, setNewName]       = useState("");
  const [newPrice, setNewPrice]     = useState("");
  const [editingId, setEditingId]   = useState(null);
  const [editPrice, setEditPrice]   = useState("");
  // goal form
  const [goalCatId, setGoalCatId]   = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [editGoalId, setEditGoalId] = useState(null);
  const [editGoalVal, setEditGoalVal] = useState("");

  const pop    = (msg, type="") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };
  const popErr = (msg) => pop(msg,"err");

  // ── LOAD ──────────────────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    setSyncState("loading");
    try {
      const [cat, stk, inc, sal, gls, hist] = await Promise.all([
        db("catalogue?select=*&order=name.asc"),
        db("stock?select=*"),
        db("incoming?select=*&order=id.asc"),
        db("sales?select=*&order=id.asc"),
        db("goals?select=*"),
        db("history?select=*&order=created_at.desc&limit=50"),
      ]);
      setCatalogue(cat || []);
      setStock(stk || []);
      setIncoming(inc || []);
      setSales(sal || []);
      setGoals(gls || []);
      setHistory(hist || []);
      setSyncState("ok");
    } catch(e) {
      setSyncState("error");
      popErr("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ── DERIVED ───────────────────────────────────────────────────────────────
  const stockWithInfo = stock
    .map(s => { const cat = catalogue.find(c=>c.id===s.catalogue_id); return cat?{...s,cat}:null; })
    .filter(Boolean).sort((a,b)=>a.cat.name.localeCompare(b.cat.name));

  const incomingWithInfo = incoming
    .map(i => { const cat = catalogue.find(c=>c.id===i.catalogue_id); return cat?{...i,cat}:null; })
    .filter(Boolean);

  const warehouseValue  = stockWithInfo.reduce((s,x)=>s+x.dozens*x.cat.selling_price,0);
  const warehouseDozens = stockWithInfo.reduce((s,x)=>s+x.dozens,0);
  const incomingValue   = incomingWithInfo.reduce((s,x)=>s+x.dozens*x.price_per_doz,0);
  const remItem         = stockWithInfo.find(s=>s.catalogue_id===parseInt(remId));

  // sales derived
  const thisYearSales = sales.filter(s => s.date.includes(String(YEAR)));
  const totalRevenue  = thisYearSales.reduce((s,x)=>s+x.revenue,0);

  const revenueByProduct = catalogue.map(c => {
    const catSales = thisYearSales.filter(s=>s.catalogue_id===c.id);
    return { ...c, revenue: catSales.reduce((s,x)=>s+x.revenue,0), dozens: catSales.reduce((s,x)=>s+x.dozens,0) };
  }).filter(c=>c.revenue>0).sort((a,b)=>b.revenue-a.revenue);

  // goals derived — based on total dozens bought (incoming logs) this year
  const boughtThisYear = incoming
    .concat(sales.map(s=>({ catalogue_id: s.catalogue_id, _bought: false }))) // placeholder trick below
    .slice(0); // we track via incoming table total + stock total

  // Actually: bought = all incoming records ever for this year (we store date on incoming)
  // Simpler: bought = current stock + sold = total ever received
  const goalProgress = goals.map(g => {
    const cat = catalogue.find(c=>c.id===g.catalogue_id);
    if(!cat) return null;
    // total bought = stock on hand + total sold this year + incoming still on way
    const stockQty    = stock.find(s=>s.catalogue_id===g.catalogue_id)?.dozens || 0;
    const soldQty     = thisYearSales.filter(s=>s.catalogue_id===g.catalogue_id).reduce((s,x)=>s+x.dozens,0);
    const incomingQty = incoming.find(i=>i.catalogue_id===g.catalogue_id)?.dozens || 0;
    const boughtQty   = stockQty + soldQty + incomingQty;
    const pct         = Math.min((boughtQty/g.target_dozens)*100, 100);
    const remaining   = Math.max(g.target_dozens - boughtQty, 0);
    return { ...g, cat, boughtQty, remaining, pct };
  }).filter(Boolean).sort((a,b)=>a.cat.name.localeCompare(b.cat.name));

  // ── ACTIONS ───────────────────────────────────────────────────────────────
  const doLogPurchase = async () => {
    const doz = parseFloat(incDoz), price = parseFloat(incPrice);
    if(!incCatId||!doz||doz<=0||!price||price<=0) return;
    setSaving(true);
    try {
      const catId = parseInt(incCatId);
      const exists = incoming.find(i=>i.catalogue_id===catId);
      if(exists) {
        await db(`incoming?id=eq.${exists.id}`,{method:"PATCH",body:JSON.stringify({dozens:exists.dozens+doz,price_per_doz:price})});
      } else {
        await db("incoming",{method:"POST",body:JSON.stringify({catalogue_id:catId,dozens:doz,price_per_doz:price,date:new Date().toLocaleDateString("en-GB")})});
      }
      await loadAll();
      pop("✈ Logged as incoming");
      setIncCatId(""); setIncDoz(""); setIncPrice("");
    } catch(e){ popErr("Failed to save"); } finally{ setSaving(false); }
  };

  const doArrive = async (inc) => {
    const doz = parseFloat(arriveDoz);
    if(!doz||doz<=0) return;
    if(doz>inc.dozens){ pop("⚠ More than what's on the way!"); return; }
    setSaving(true);
    try {
      const remaining = inc.dozens - doz;
      if(remaining<=0){ await db(`incoming?id=eq.${inc.id}`,{method:"DELETE",prefer:""}); }
      else { await db(`incoming?id=eq.${inc.id}`,{method:"PATCH",body:JSON.stringify({dozens:remaining})}); }
      const existingStock = stock.find(s=>s.catalogue_id===inc.catalogue_id);
      if(existingStock){
        await db(`stock?catalogue_id=eq.${inc.catalogue_id}`,{method:"PATCH",body:JSON.stringify({dozens:existingStock.dozens+doz})});
      } else {
        await db("stock",{method:"POST",body:JSON.stringify({catalogue_id:inc.catalogue_id,dozens:doz})});
      }
      await db("history",{method:"POST",body:JSON.stringify({catalogue_id:inc.catalogue_id,action:"IN",dozens:doz,value:doz*inc.price_per_doz})});
      await loadAll();
      pop(`✔ ${doz} doz arrived`);
      setArrivingId(null); setArriveDoz("");
    } catch(e){ popErr("Failed to update"); } finally{ setSaving(false); }
  };

  const doRemove = async () => {
    const doz = parseFloat(remDoz);
    if(!remId||!doz||doz<=0||!remItem) return;
    if(doz>remItem.dozens){ pop("⚠ Not enough stock"); return; }
    setSaving(true);
    try {
      const remaining = remItem.dozens - doz;
      if(remaining<=0){ await db(`stock?catalogue_id=eq.${remItem.catalogue_id}`,{method:"DELETE",prefer:""}); }
      else { await db(`stock?catalogue_id=eq.${remItem.catalogue_id}`,{method:"PATCH",body:JSON.stringify({dozens:remaining})}); }
      // log sale
      const revenue = doz * remItem.cat.selling_price;
      await db("sales",{method:"POST",body:JSON.stringify({catalogue_id:remItem.catalogue_id,dozens:doz,revenue,date:new Date().toLocaleDateString("en-GB")})});
      await db("history",{method:"POST",body:JSON.stringify({catalogue_id:remItem.catalogue_id,action:"OUT",dozens:doz,value:revenue})});
      await loadAll();
      pop(`✔ Removed ${doz} doz · ${tzs(revenue)}`);
      setRemId(""); setRemDoz("");
    } catch(e){ popErr("Failed to update"); } finally{ setSaving(false); }
  };

  const doAddCatalogue = async () => {
    const price = parseFloat(newPrice);
    if(!newName.trim()||!price||price<=0) return;
    setSaving(true);
    try {
      await db("catalogue",{method:"POST",body:JSON.stringify({name:newName.trim(),selling_price:price})});
      await loadAll();
      pop(`✔ "${newName.trim()}" added`);
      setNewName(""); setNewPrice("");
    } catch(e){ popErr("Failed to save"); } finally{ setSaving(false); }
  };

  const saveEdit = async (id) => {
    const price = parseFloat(editPrice);
    if(!price||price<=0) return;
    setSaving(true);
    try {
      await db(`catalogue?id=eq.${id}`,{method:"PATCH",body:JSON.stringify({selling_price:price})});
      await loadAll();
      pop("✔ Price updated");
      setEditingId(null); setEditPrice("");
    } catch(e){ popErr("Failed to update"); } finally{ setSaving(false); }
  };

  const doSetGoal = async () => {
    const target = parseFloat(goalTarget);
    if(!goalCatId||!target||target<=0) return;
    setSaving(true);
    try {
      const catId  = parseInt(goalCatId);
      const exists = goals.find(g=>g.catalogue_id===catId);
      if(exists){
        await db(`goals?catalogue_id=eq.${catId}`,{method:"PATCH",body:JSON.stringify({target_dozens:target})});
      } else {
        await db("goals",{method:"POST",body:JSON.stringify({catalogue_id:catId,target_dozens:target})});
      }
      await loadAll();
      pop("✔ Goal saved");
      setGoalCatId(""); setGoalTarget("");
    } catch(e){ popErr("Failed to save goal"); } finally{ setSaving(false); }
  };

  const saveGoalEdit = async (catalogueId) => {
    const target = parseFloat(editGoalVal);
    if(!target||target<=0) return;
    setSaving(true);
    try {
      await db(`goals?catalogue_id=eq.${catalogueId}`,{method:"PATCH",body:JSON.stringify({target_dozens:target})});
      await loadAll();
      pop("✔ Goal updated");
      setEditGoalId(null); setEditGoalVal("");
    } catch(e){ popErr("Failed to update"); } finally{ setSaving(false); }
  };

  const handleIncCatChange = (id) => {
    setIncCatId(id);
    const cat = catalogue.find(c=>c.id===parseInt(id));
    setIncPrice(cat ? String(cat.selling_price) : "");
    setIncDoz("");
  };

  const TABS = [
    { label:"Home",     icon:"🏠" },
    { label:"Incoming", icon:"✈️" },
    { label:"Remove",   icon:"📤" },
    { label:"My Shop",  icon:"🏪" },
    { label:"Catalogue",icon:"🏷️" },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="shell">
        <div className="topbar">
          <div>
            <div className="topbar-title">Hofrec</div>
            <div className="topbar-sub">Stock Manager · Dozens</div>
          </div>
          <div className={`sync-dot ${syncState}`} />
        </div>

        {loading ? (
          <div className="loading-screen"><div className="spinner"/>Loading your data…</div>
        ) : (
          <div className="page">

            {/* ── HOME ── */}
            {tab === 0 && (
              <div>
                <div className="total-card blue">
                  <div className="total-lbl">Warehouse Value</div>
                  <div className="total-val">{tzs(warehouseValue)}</div>
                  <div className="total-sub">{warehouseDozens} dozens in stock</div>
                </div>

                {/* PILLS */}
                <div className="pill-row">
                  <button className={`pill ${homeTab==="summary"?"active":""}`} onClick={()=>setHomeTab("summary")}>Summary</button>
                  <button className={`pill ${homeTab==="history"?"active":""}`} onClick={()=>setHomeTab("history")}>History</button>
                </div>

                {/* SUMMARY VIEW */}
                {homeTab === "summary" && (
                  stockWithInfo.length === 0
                    ? <div className="empty-state"><span className="empty-icon">📦</span>No stock in warehouse yet.</div>
                    : <div className="item-list">
                        {stockWithInfo.map(s=>(
                          <div className="item-row" key={s.catalogue_id}>
                            <div className="item-row-main">
                              <div className="item-name">{s.cat.name}</div>
                              <div className="item-right">
                                <div className="item-val">{tzs(s.dozens*s.cat.selling_price)}</div>
                                <div className="item-sub">{s.dozens} doz · {tzs(s.cat.selling_price)}/doz</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                )}

                {/* HISTORY VIEW */}
                {homeTab === "history" && (
                  history.length === 0
                    ? <div className="empty-state"><span className="empty-icon">📋</span>No activity yet. Add or remove stock to see history.</div>
                    : <div className="item-list">
                        {history.map(h => {
                          const cat = catalogue.find(c=>c.id===h.catalogue_id);
                          const dt  = new Date(h.created_at);
                          const dateStr = dt.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
                          const timeStr = dt.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});
                          return (
                            <div className="hist-row" key={h.id}>
                              <div className={`hist-badge ${h.action.toLowerCase()}`}>
                                {h.action==="IN"?"📥":"📤"}
                              </div>
                              <div className="hist-info">
                                <div className="hist-name">{cat?.name||"Unknown"}</div>
                                <div className="hist-time">{dateStr} · {timeStr}</div>
                              </div>
                              <div className="hist-right">
                                <div className={`hist-val ${h.action.toLowerCase()}`}>
                                  {h.action==="IN"?"+":"−"}{tzs(h.value)}
                                </div>
                                <div className="hist-doz">{h.dozens} doz</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                )}
              </div>
            )}

            {/* ── INCOMING ── */}
            {tab === 1 && (
              <div>
                <div className="pg-heading">Incoming</div>
                <div className="pg-sub">Goods purchased and on their way.</div>
                <div style={{background:"var(--warn)",borderRadius:"var(--r)",padding:"18px 20px",marginBottom:20,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:-15,right:-15,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
                  <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.55)",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Total On The Way</div>
                  <div style={{fontSize:26,fontWeight:900,color:"#fff",lineHeight:1}}>{tzs(incomingValue)}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.55)",marginTop:6,fontWeight:600}}>{incomingWithInfo.length} shipment{incomingWithInfo.length!==1?"s":""} pending</div>
                </div>
                {incomingWithInfo.length>0 && (
                  <div className="incoming-card" style={{marginBottom:20}}>
                    {incomingWithInfo.map(i=>(
                      <div className="incoming-row" key={i.id}>
                        <div className="inc-top">
                          <div className="inc-dot"/>
                          <div style={{flex:1}}>
                            <div className="inc-name">{i.cat.name}</div>
                            <div className="inc-meta">{i.dozens} doz on the way · {i.date}</div>
                          </div>
                          <div style={{textAlign:"right"}}>
                            <div className="inc-val">{tzs(i.dozens*i.price_per_doz)}</div>
                            <div className="inc-val-sub">{tzs(i.price_per_doz)}/doz</div>
                          </div>
                        </div>
                        {arrivingId===i.id?(
                          <div className="arrive-form">
                            <div className="arrive-label">How many dozens arrived?</div>
                            <div className="arrive-row">
                              <input className="inp" type="number" placeholder={`max ${i.dozens}`} value={arriveDoz} onChange={e=>setArriveDoz(e.target.value)} autoFocus/>
                              <button className="arrive-btn" disabled={saving} onClick={()=>doArrive(i)}>Arrived ✔</button>
                            </div>
                            <div style={{marginTop:8,textAlign:"right"}}>
                              <span style={{fontSize:12,color:"var(--muted)",cursor:"pointer",fontWeight:700}} onClick={()=>{setArrivingId(null);setArriveDoz("");}}>cancel</span>
                            </div>
                          </div>
                        ):(
                          <button style={{background:"var(--green-lt)",border:"1px solid var(--green-br)",borderRadius:8,padding:"7px 14px",fontSize:12,fontWeight:800,color:"var(--green)",cursor:"pointer",fontFamily:"var(--font)",width:"100%"}}
                            onClick={()=>{setArrivingId(i.id);setArriveDoz("");}}>
                            Tap when goods arrive
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="new-purchase">
                  <div className="new-purchase-title">＋ Log New Purchase</div>
                  {catalogue.length===0
                    ? <div style={{fontSize:13,color:"var(--muted)",fontWeight:600,textAlign:"center",padding:"12px 0"}}>Add products in the Catalogue tab first.</div>
                    : <>
                        <div className="field">
                          <label className="lbl">Product</label>
                          <div className="sel-wrap">
                            <select className="sel" value={incCatId} onChange={e=>handleIncCatChange(e.target.value)}>
                              <option value="">— select product —</option>
                              {catalogue.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="field">
                          <label className="lbl">Dozens Purchased</label>
                          <input className="inp" type="number" placeholder="e.g. 20" value={incDoz} onChange={e=>setIncDoz(e.target.value)}/>
                        </div>
                        <div className="field">
                          <label className="lbl">Price per Dozen (TZS)</label>
                          <input className="inp" type="number" placeholder="e.g. 32000" value={incPrice} onChange={e=>setIncPrice(e.target.value)}/>
                        </div>
                        {incCatId&&incDoz>0&&incPrice>0&&(
                          <div className="preview-box blue">
                            <span>{catalogue.find(c=>c.id===parseInt(incCatId))?.name}</span>
                            <span>{incDoz} doz · {tzs(incDoz*incPrice)}</span>
                          </div>
                        )}
                        <button className="cta cta-blue" disabled={saving} onClick={doLogPurchase}>{saving?"Saving…":"Log as Incoming"}</button>
                      </>
                  }
                </div>
              </div>
            )}

            {/* ── REMOVE ── */}
            {tab === 2 && (
              <div className="form-card">
                <div className="form-heading">Remove from Warehouse</div>
                <div className="form-sub">Goods sold — counted as revenue.</div>
                {stockWithInfo.length===0
                  ? <div className="empty-state"><span className="empty-icon">📦</span>Warehouse is empty.</div>
                  : <>
                      <div className="field">
                        <label className="lbl">Product</label>
                        <div className="sel-wrap">
                          <select className="sel" value={remId} onChange={e=>{setRemId(e.target.value);setRemDoz("");}}>
                            <option value="">— select product —</option>
                            {stockWithInfo.map(s=>(
                              <option key={s.catalogue_id} value={s.catalogue_id}>{s.cat.name} ({s.dozens} doz)</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="field">
                        <label className="lbl">Dozens</label>
                        <input className="inp" type="number" placeholder="e.g. 2" value={remDoz} onChange={e=>setRemDoz(e.target.value)}/>
                      </div>
                      {remItem&&remDoz>0&&(
                        <div className={`preview-box ${parseFloat(remDoz)>remItem.dozens?"warn":"blue"}`}>
                          <span>{remItem.cat.name}</span>
                          <span>{parseFloat(remDoz)>remItem.dozens?"⚠ Exceeds stock!": `−${remDoz} doz · ${tzs(remDoz*remItem.cat.selling_price)}`}</span>
                        </div>
                      )}
                      <button className="cta cta-orange" disabled={saving} onClick={doRemove}>{saving?"Saving…":"Remove from Stock"}</button>
                    </>
                }
              </div>
            )}

            {/* ── MY SHOP ── */}
            {tab === 3 && (
              <div>
                <div className="pg-heading">My Shop</div>
                <div className="pg-sub">Revenue & yearly goals — {YEAR}</div>

                {/* Revenue card */}
                <div className="total-card green">
                  <div className="total-lbl">Total Revenue {YEAR}</div>
                  <div className="total-val">{tzs(totalRevenue)}</div>
                  <div className="total-sub">{thisYearSales.length} sales recorded this year</div>
                </div>

                {/* Revenue by product */}
                {revenueByProduct.length > 0 && (
                  <>
                    <div className="section-lbl">Revenue by Product</div>
                    <div className="item-list" style={{marginBottom:20}}>
                      {revenueByProduct.map(c=>(
                        <div className="rev-row" key={c.id}>
                          <div className="rev-name">{c.name}</div>
                          <div>
                            <div className="rev-val">{tzs(c.revenue)}</div>
                            <div className="rev-sub">{c.dozens} doz sold</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Goals */}
                <div className="section-lbl">Yearly Goals (Dozens Bought)</div>
                {goalProgress.length === 0
                  ? <div className="empty-state" style={{padding:"24px 0"}}><span className="empty-icon">🎯</span>No goals set yet.</div>
                  : <div className="item-list" style={{marginBottom:20}}>
                      {goalProgress.map(g=>(
                        <div className="goal-row" key={g.catalogue_id}>
                          <div className="goal-top">
                            <div className="goal-name">{g.cat.name}</div>
                            <div className="goal-nums"><span>{g.boughtQty}</span> / {g.target_dozens} doz</div>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{width:`${g.pct}%`,background: g.pct>=100?"var(--green)":g.pct>=70?"var(--accent)":"var(--warn)"}}/>
                          </div>
                          <div className="goal-footer">
                            <span>{g.pct>=100 ? "🎉 Goal reached!" : `${g.remaining} doz remaining`}</span>
                            <button className="goal-edit-btn" onClick={()=>{setEditGoalId(g.catalogue_id);setEditGoalVal(String(g.target_dozens));}}>Edit target</button>
                          </div>
                          {editGoalId===g.catalogue_id&&(
                            <div style={{marginTop:10,background:"var(--accent-lt)",borderRadius:10,padding:"12px 14px"}}>
                              <div style={{fontSize:10,fontWeight:800,color:"var(--accent)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>New yearly target (dozens)</div>
                              <div style={{display:"flex",gap:8}}>
                                <input className="inp" type="number" placeholder="e.g. 500" value={editGoalVal} onChange={e=>setEditGoalVal(e.target.value)} style={{flex:1,padding:"10px 13px",fontSize:14}} autoFocus/>
                                <button className="save-btn" disabled={saving} onClick={()=>saveGoalEdit(g.catalogue_id)}>{saving?"…":"Save"}</button>
                                <button className="save-btn" style={{background:"#e5e7eb",color:"var(--muted)"}} onClick={()=>setEditGoalId(null)}>Cancel</button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                }

                {/* Set new goal */}
                <div className="goal-set-card">
                  <div className="goal-set-title">🎯 Set a New Goal</div>
                  <div className="field">
                    <label className="lbl">Product</label>
                    <div className="sel-wrap">
                      <select className="sel" value={goalCatId} onChange={e=>setGoalCatId(e.target.value)}>
                        <option value="">— select product —</option>
                        {catalogue.filter(c=>!goals.find(g=>g.catalogue_id===c.id)).map(c=>(
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="field">
                    <label className="lbl">Target Dozens for {YEAR}</label>
                    <input className="inp" type="number" placeholder="e.g. 500" value={goalTarget} onChange={e=>setGoalTarget(e.target.value)}/>
                  </div>
                  <button className="cta cta-green" disabled={saving} onClick={doSetGoal}>{saving?"Saving…":"Set Goal"}</button>
                </div>
              </div>
            )}

            {/* ── CATALOGUE ── */}
            {tab === 4 && (
              <div>
                <div className="pg-heading">Catalogue</div>
                <div className="pg-sub">Your products. Tap Edit to update the price.</div>
                {catalogue.length===0
                  ? <div className="empty-state"><span className="empty-icon">🏷️</span>No products yet.</div>
                  : <div className="item-list" style={{marginBottom:20}}>
                      {catalogue.map(c=>(
                        <div className="item-row" key={c.id}>
                          <div className="item-row-main">
                            <div className="item-name">{c.name}</div>
                            <div className="item-right" style={{marginRight:10}}>
                              <div className="item-val">{tzs(c.selling_price)}</div>
                              <div className="item-sub">per dozen</div>
                            </div>
                            <button className={`edit-btn ${editingId===c.id?"cancel":""}`}
                              onClick={()=>editingId===c.id?setEditingId(null):(setEditingId(c.id),setEditPrice(String(c.selling_price)))}>
                              {editingId===c.id?"Cancel":"Edit"}
                            </button>
                          </div>
                          {editingId===c.id&&(
                            <div className="inline-edit">
                              <div className="inline-edit-label">New price per dozen (TZS)</div>
                              <div className="inline-edit-row">
                                <input className="inp" type="number" placeholder="e.g. 36000" value={editPrice} onChange={e=>setEditPrice(e.target.value)} autoFocus/>
                                <button className="save-btn" disabled={saving} onClick={()=>saveEdit(c.id)}>{saving?"…":"Save"}</button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                }
                <div className="add-cat-card">
                  <div className="add-cat-title">＋ Add New Product</div>
                  <div className="field">
                    <label className="lbl">Product Name</label>
                    <input className="inp" placeholder="e.g. Baby Dungarees 0–3m" value={newName} onChange={e=>setNewName(e.target.value)}/>
                  </div>
                  <div className="field">
                    <label className="lbl">Selling Price per Dozen (TZS)</label>
                    <input className="inp" type="number" placeholder="e.g. 36000" value={newPrice} onChange={e=>setNewPrice(e.target.value)}/>
                  </div>
                  <button className="cta cta-blue" disabled={saving} onClick={doAddCatalogue}>{saving?"Saving…":"Add to Catalogue"}</button>
                </div>
              </div>
            )}

          </div>
        )}

        <nav className="bottomnav">
          {TABS.map((t,i)=>(
            <button key={i} className={`tab-btn ${tab===i?"active":""}`} onClick={()=>setTab(i)}>
              {i===1&&incomingWithInfo.length>0&&<span className="tab-badge">{incomingWithInfo.length}</span>}
              <span className="tab-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
      </div>
      {toast&&<div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
