import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
  Home, Zap, Brain, TrendingUp, FileText, Users, Settings, Activity,
  DollarSign, Target, Cpu, Shield, Crown, Globe, Layers, Briefcase,
  Radio, Eye, ArrowUpRight, ArrowDownRight, ChevronRight, CheckCircle,
  AlertTriangle, Clock, Play, Monitor, Bot, Rocket, Mail, MessageSquare,
  ExternalLink, Search, Bell, FileDown, Inbox, Phone, Sparkles, Power,
  BarChart3, Smartphone, MoreHorizontal, Building
} from "lucide-react";

const useCounter = (end, duration = 2000) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(id); }
      else setVal(Math.round(start));
    }, 16);
    return () => clearInterval(id);
  }, [end, duration]);
  return val;
};

const Spark = ({ data, color = "#6366f1", h = 32, w = 80 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  const uid = `sp-${color.replace(/#/g, "")}-${Math.random().toString(36).slice(2, 6)}`;
  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.4} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} />
      <polygon fill={`url(#${uid})`} points={`0,${h} ${pts} ${w},${h}`} opacity="0.3" />
    </svg>
  );
};

const GlowRing = ({ pct, size = 90, stroke = 6, color = "#6366f1", label }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
          strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${color}80)`, transition: "stroke-dashoffset 1.5s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{pct}%</span>
        {label && <span style={{ fontSize: 8, color: "#64748b", fontWeight: 600, letterSpacing: 1 }}>{label}</span>}
      </div>
    </div>
  );
};

const StatusDot = ({ status }) => {
  const colors = { active: "#34d399", building: "#fbbf24", planned: "#475569", live: "#34d399", beta: "#818cf8" };
  const c = colors[status] || "#475569";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c, boxShadow: `0 0 8px ${c}` }} />
      <span style={{ fontSize: 9, fontWeight: 700, color: c, letterSpacing: 1, textTransform: "uppercase" }}>{status}</span>
    </span>
  );
};

const card = (extra = "") => ({
  borderRadius: 16,
  background: "rgba(15,23,42,0.6)",
  border: "1px solid rgba(99,102,241,0.08)",
  backdropFilter: "blur(12px)",
  ...(extra === "p" ? { padding: "20px 24px" } : {})
});

const RevTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(15,23,42,0.95)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 12, padding: "12px 16px", backdropFilter: "blur(12px)" }}>
      <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>{label}</p>
      <p style={{ color: "#818cf8", fontSize: 16, fontWeight: 700 }}>${payload[0].value}K</p>
      {payload[1] && <p style={{ color: "#475569", fontSize: 12 }}>Prev: ${payload[1].value}K</p>}
    </div>
  );
};

/* DATA */
const revenueData = [
  { m: "Nov", rev: 112, prev: 94 }, { m: "Dec", rev: 128, prev: 108 },
  { m: "Jan", rev: 138, prev: 119 }, { m: "Feb", rev: 142, prev: 127 },
  { m: "Mar", rev: 156, prev: 138 }, { m: "Apr", rev: 148.5, prev: 145 }
];

const brands = [
  { name: "Elios AI Consulting", rev: 62, clients: 8, growth: 34, color: "#818cf8", spark: [38, 42, 48, 52, 56, 59, 62], status: "active", type: "Agency" },
  { name: "Elevated Engagement", rev: 42, clients: 14, growth: 22, color: "#34d399", spark: [28, 30, 33, 35, 38, 40, 42], status: "active", type: "Product" },
  { name: "33v Product Studio", rev: 28, clients: 6, growth: 45, color: "#f472b6", spark: [12, 15, 18, 20, 23, 25, 28], status: "active", type: "Studio" },
  { name: "AI Simple", rev: 12, clients: 4, growth: 18, color: "#fbbf24", spark: [6, 7, 8, 9, 10, 11, 12], status: "active", type: "SaaS" },
  { name: "FundingHub", rev: 4.5, clients: 2, growth: 60, color: "#38bdf8", spark: [1, 1.5, 2, 2.5, 3, 3.5, 4.5], status: "building", type: "Platform" }
];

const tools = [
  { name: "Content Matrix", url: "content-matrix-kappa.vercel.app", status: "live", brand: "Elios" },
  { name: "SUITE (5 AI Agents)", url: "suite-tan-nine.vercel.app", status: "live", brand: "Elios" },
  { name: "AI Receptionist Demo", url: "elevated-engagement-demo.vercel.app", status: "live", brand: "Elevated" },
  { name: "AI Readiness Assessment", url: "ai-readiness-assessment.vercel.app", status: "live", brand: "Elios" },
  { name: "Revenue Leak Calculator", url: "revenue-leak-calculator.vercel.app", status: "live", brand: "Elios" },
  { name: "PRESS (Landing Page)", url: "press-zeta.vercel.app", status: "live", brand: "Elios" },
  { name: "CEO HQ Mission Control", url: "ceo-hq.vercel.app", status: "beta", brand: "Elios" },
  { name: "Vault Ventures CRM", url: "vault-ventures.vercel.app", status: "building", brand: "33v" },
  { name: "Sales Acceleration OS", url: "", status: "planned", brand: "Elevated" },
  { name: "Lead Magnet Builder", url: "", status: "planned", brand: "Elios" },
  { name: "Client Portal", url: "", status: "planned", brand: "33v" },
  { name: "Empire Intelligence", url: "", status: "planned", brand: "33v" }
];

const engines = [
  { name: "Revenue Intelligence", icon: DollarSign, status: "active", metric: "+23% YoY" },
  { name: "Competitive Warfare", icon: Shield, status: "active", metric: "12 tracked" },
  { name: "Authority Acceleration", icon: Crown, status: "active", metric: "4.2K followers" },
  { name: "Network Infiltration", icon: Globe, status: "building", metric: "Q2 launch" },
  { name: "Content Multiplication", icon: Layers, status: "active", metric: "35 pieces/wk" },
  { name: "Deal Flow", icon: Briefcase, status: "active", metric: "$340K pipeline" },
  { name: "Client Ascension", icon: TrendingUp, status: "building", metric: "Beta" },
  { name: "Product Innovation", icon: Cpu, status: "active", metric: "12 tools live" },
  { name: "Talent Acquisition", icon: Users, status: "planned", metric: "Q3" },
  { name: "Market Intelligence", icon: Eye, status: "building", metric: "Data feeds" },
  { name: "Brand Amplification", icon: Radio, status: "active", metric: "3 brands" }
];

const recentDeals = [
  { name: "Trusted Roofing", value: "$5K + $3K/mo", stage: "Demo Scheduled", probability: 75, color: "#34d399" },
  { name: "Kent Enterprises", value: "$10K setup", stage: "Proposal Sent", probability: 60, color: "#818cf8" },
  { name: "Dr. Martinez Dental", value: "$3K + $1.5K/mo", stage: "Discovery", probability: 40, color: "#fbbf24" },
  { name: "Orlando Plumbing Co", value: "$5K + $2K/mo", stage: "AI Demo Sent", probability: 55, color: "#38bdf8" },
  { name: "Sunshine HVAC", value: "$8K setup", stage: "Negotiation", probability: 70, color: "#f472b6" }
];

const agentActivity = [
  { agent: "Rex", action: "Closed revenue analysis for Trusted Roofing", time: "2m ago", icon: TrendingUp, color: "#34d399" },
  { agent: "Maya", action: "Generated 30-day content calendar", time: "12m ago", icon: FileText, color: "#818cf8" },
  { agent: "Cody", action: "Deployed AI Receptionist for demo", time: "1h ago", icon: Bot, color: "#f472b6" },
  { agent: "Nova", action: "Optimized lead response workflow", time: "2h ago", icon: Zap, color: "#fbbf24" },
  { agent: "Priya", action: "Financial model updated, Q2 forecast ready", time: "3h ago", icon: DollarSign, color: "#38bdf8" }
];

const agents = [
  { id: "cody", name: "Cody", emoji: "\u{1F916}", desc: "Content Generation", tasks: 342, lastAction: "2m ago", status: "active" },
  { id: "rex", name: "Rex", emoji: "\u{1F4CA}", desc: "Revenue Analysis", tasks: 287, lastAction: "8m ago", status: "active" },
  { id: "maya", name: "Maya", emoji: "\u{1F465}", desc: "Lead Qualification", tasks: 415, lastAction: "15m ago", status: "active" },
  { id: "nova", name: "Nova", emoji: "\u{1F680}", desc: "Campaign Automation", tasks: 198, lastAction: "25m ago", status: "active" },
  { id: "priya", name: "Priya", emoji: "\u{1F9E0}", desc: "Market Intelligence", tasks: 156, lastAction: "1h ago", status: "active" }
];

const diagnosticData = {
  gripScore: 78,
  categories: [
    { name: "Growth Velocity", score: 85, color: "#34d399" },
    { name: "Revenue Health", score: 72, color: "#818cf8" },
    { name: "Infrastructure", score: 68, color: "#fbbf24" },
    { name: "Pipeline Strength", score: 79, color: "#f472b6" }
  ],
  findings: [
    "Revenue growth accelerating - MRR up 18% this quarter",
    "Lead quality improved 23% from optimized AI targeting",
    "Content engagement up 45% with Content Matrix deployment",
    "Sales cycle shortened by 3 days via AI Receptionist",
    "Customer acquisition cost reduced 18% across all brands"
  ]
};

const contentMetrics = [
  { name: "Mon", pieces: 8, engagement: 4.2 },
  { name: "Tue", pieces: 12, engagement: 5.1 },
  { name: "Wed", pieces: 6, engagement: 3.8 },
  { name: "Thu", pieces: 15, engagement: 6.2 },
  { name: "Fri", pieces: 10, engagement: 5.5 },
  { name: "Sat", pieces: 4, engagement: 3.2 },
  { name: "Sun", pieces: 3, engagement: 2.8 }
];

const pipelineStages = [
  { stage: "Prospecting", count: 127, value: "$190K", color: "#38bdf8" },
  { stage: "Qualified", count: 89, value: "$134K", color: "#818cf8" },
  { stage: "Proposal", count: 34, value: "$68K", color: "#fbbf24" },
  { stage: "Negotiation", count: 12, value: "$48K", color: "#f472b6" },
  { stage: "Closed Won", count: 8, value: "$42K", color: "#34d399" }
];

const engColor = { active: "#34d399", building: "#fbbf24", planned: "#475569" };
const toolsLive = tools.filter(t => t.status === "live").length;
const toolsBuild = tools.filter(t => t.status === "building" || t.status === "beta").length;

/* SIDEBAR */
const Sidebar = ({ activePanel, setActivePanel }) => {
  const navItems = [
    { id: "command", label: "Command Center", icon: Home },
    { id: "agents", label: "AI Agents", icon: Bot },
    { id: "intelligence", label: "Intelligence", icon: Brain },
    { id: "tools", label: "Factory Tools", icon: Cpu },
    { id: "pipeline", label: "Deal Pipeline", icon: Briefcase },
    { id: "revenue", label: "Revenue", icon: DollarSign },
    { id: "content", label: "Content Engine", icon: FileText },
    { id: "engines", label: "The 11 Engines", icon: Rocket },
    { id: "reports", label: "Reports", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div style={{ width: 240, minHeight: "100vh", background: "rgba(2,6,23,0.95)", borderRight: "1px solid rgba(99,102,241,0.1)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", padding: "20px 12px", flexShrink: 0 }}>
      <div style={{ padding: "0 8px 24px", borderBottom: "1px solid rgba(99,102,241,0.08)", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}>
            <Crown size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: "#fff" }}>CEO HQ</div>
            <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 1.5 }}>MISSION CONTROL</div>
          </div>
        </div>
        <div style={{ fontSize: 10, color: "#475569", marginTop: 8, paddingLeft: 2 }}>King (Los Silva)</div>
      </div>
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activePanel === item.id;
          return (
            <button key={item.id} onClick={() => setActivePanel(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: isActive ? "1px solid rgba(99,102,241,0.2)" : "1px solid transparent", background: isActive ? "rgba(99,102,241,0.1)" : "transparent", color: isActive ? "#818cf8" : "#64748b", cursor: "pointer", transition: "all 0.2s", fontSize: 13, fontWeight: 600, width: "100%", textAlign: "left" }}>
              <Icon size={16} />
              <span>{item.label}</span>
              {isActive && <ChevronRight size={14} style={{ marginLeft: "auto" }} />}
            </button>
          );
        })}
      </nav>
      <div style={{ ...card("p"), padding: "12px", textAlign: "center", marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px #34d399" }} />
          <span style={{ fontSize: 10, color: "#34d399", fontWeight: 600 }}>ALL SYSTEMS ONLINE</span>
        </div>
        <p style={{ fontSize: 9, color: "#334155" }}>Powered by Elios AI x 33v</p>
      </div>
    </div>
  );
};

/* COMMAND CENTER PANEL */
const CommandPanel = () => {
  const mrrAnim = useCounter(148500, 2200);
  const clientAnim = useCounter(34, 1400);
  const toolsAnim = useCounter(12, 1600);
  const arAnim = useCounter(847000, 2400);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "MONTHLY RECURRING", val: `$${(mrrAnim / 1000).toFixed(1)}K`, sub: "+18% this quarter", icon: DollarSign, gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)", glow: "rgba(99,102,241,0.15)", spark: [98, 108, 118, 126, 134, 142, 148.5], sparkColor: "#818cf8" },
          { label: "ACTIVE CLIENTS", val: clientAnim, sub: "+8 this quarter", icon: Users, gradient: "linear-gradient(135deg,#34d399,#059669)", glow: "rgba(52,211,153,0.15)", spark: [22, 24, 25, 27, 29, 31, 34], sparkColor: "#34d399" },
          { label: "TOOLS DEPLOYED", val: `${toolsAnim}/33`, sub: `${toolsLive} live, ${toolsBuild} building`, icon: Cpu, gradient: "linear-gradient(135deg,#f472b6,#ec4899)", glow: "rgba(244,114,182,0.15)", spark: [3, 4, 5, 6, 7, 9, 12], sparkColor: "#f472b6" },
          { label: "ANNUAL RUN RATE", val: `$${(arAnim / 1000).toFixed(0)}K`, sub: "On pace for $1M+", icon: Target, gradient: "linear-gradient(135deg,#f59e0b,#d97706)", glow: "rgba(245,158,11,0.15)", spark: [540, 580, 620, 680, 740, 790, 847], sparkColor: "#fbbf24" }
        ].map((kpi, i) => (
          <div key={i} style={{ position: "relative", overflow: "hidden", ...card("p"), transition: "all 0.3s ease" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: kpi.glow, filter: "blur(40px)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 1.5, marginBottom: 8 }}>{kpi.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{kpi.val}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
                  <ArrowUpRight size={12} color="#34d399" />
                  <span style={{ fontSize: 11, color: "#34d399", fontWeight: 600 }}>{kpi.sub}</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: kpi.gradient, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 16px ${kpi.glow}` }}>
                  <kpi.icon size={18} color="#fff" />
                </div>
                <Spark data={kpi.spark} color={kpi.sparkColor} h={28} w={64} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ ...card("p") }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 1.5 }}>REVENUE TREND</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginTop: 4 }}>$148.5K <span style={{ fontSize: 12, color: "#34d399", fontWeight: 600 }}>this month</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.06)" vertical={false} />
              <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 11 }} tickFormatter={v => `$${v}K`} />
              <Tooltip content={<RevTooltip />} />
              <Area type="monotone" dataKey="rev" stroke="#818cf8" strokeWidth={2.5} fill="url(#revGrad)" dot={{ r: 3, fill: "#818cf8", stroke: "#020617", strokeWidth: 2 }} />
              <Area type="monotone" dataKey="prev" stroke="#334155" strokeWidth={1.5} fill="transparent" strokeDasharray="4 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ ...card("p") }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 1.5, marginBottom: 16 }}>BRAND REVENUE MIX</div>
          {brands.map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < brands.length - 1 ? "1px solid rgba(99,102,241,0.06)" : "none" }}>
              <div style={{ width: 4, height: 32, borderRadius: 2, background: b.color }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{b.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>${b.rev}K</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                  <span style={{ fontSize: 10, color: "#64748b" }}>{b.clients} clients</span>
                  <span style={{ fontSize: 10, color: "#34d399", fontWeight: 600 }}>+{b.growth}%</span>
                </div>
                <div style={{ height: 2, background: "rgba(99,102,241,0.08)", borderRadius: 2, marginTop: 4 }}>
                  <div style={{ height: 2, borderRadius: 2, background: b.color, width: `${(b.rev / 62) * 100}%`, transition: "width 1s ease" }} />
                </div>
              </div>
              <Spark data={b.spark} color={b.color} h={20} w={48} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ ...card("p") }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 1.5, marginBottom: 16 }}>AI AGENT ACTIVITY</div>
          {agentActivity.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: i < agentActivity.length - 1 ? "1px solid rgba(99,102,241,0.06)" : "none" }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${a.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <a.icon size={14} color={a.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}><span style={{ color: a.color }}>{a.agent}</span> {a.action}</div>
                <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ ...card("p") }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 1.5 }}>ACTIVE PIPELINE</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>$340K</div>
          </div>
          {recentDeals.map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < recentDeals.length - 1 ? "1px solid rgba(99,102,241,0.06)" : "none" }}>
              <div style={{ width: 4, height: 28, borderRadius: 2, background: d.color }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{d.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{d.value}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                  <span style={{ fontSize: 10, color: "#64748b" }}>{d.stage}</span>
                  <span style={{ fontSize: 10, color: d.color, fontWeight: 600 }}>{d.probability}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* AI AGENTS PANEL */
const AgentsPanel = () => (
  <div>
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0 }}>AI Agent Suite</h2>
      <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>5 intelligent agents working across all brands</p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
      {agents.map(agent => (
        <div key={agent.id} style={{ ...card("p"), transition: "all 0.2s" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 28 }}>{agent.emoji}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{agent.name}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{agent.desc}</div>
              </div>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 12px #34d399", marginTop: 6 }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div><div style={{ fontSize: 10, color: "#475569", fontWeight: 600 }}>STATUS</div><div style={{ fontSize: 13, color: "#34d399", fontWeight: 700, marginTop: 2 }}>Active</div></div>
            <div><div style={{ fontSize: 10, color: "#475569", fontWeight: 600 }}>LAST ACTION</div><div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600, marginTop: 2 }}>{agent.lastAction}</div></div>
            <div><div style={{ fontSize: 10, color: "#475569", fontWeight: 600 }}>TASKS DONE</div><div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600, marginTop: 2 }}>{agent.tasks}</div></div>
          </div>
          <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px", borderRadius: 10, border: "1px solid rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.1)", color: "#818cf8", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
            <Play size={14} /> Deploy Agent
          </button>
        </div>
      ))}
    </div>
  </div>
);

/* INTELLIGENCE PANEL */
const IntelligencePanel = () => (
  <div>
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0 }}>Intelligence Dashboard</h2>
      <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>AI-powered diagnostic insights across the empire</p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16, marginBottom: 16 }}>
      <div style={{ ...card("p"), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 1.5, marginBottom: 16, alignSelf: "flex-start" }}>GRIP SCORE</div>
        <GlowRing pct={diagnosticData.gripScore} size={140} stroke={10} color="#818cf8" label="OVERALL" />
        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 12, textAlign: "center" }}>Empire Health Index</div>
      </div>
      <div style={{ ...card("p") }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 1.5, marginBottom: 16 }}>DIAGNOSTIC CATEGORIES</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {diagnosticData.categories.map(cat => (
            <div key={cat.name}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{cat.name}</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: cat.color }}>{cat.score}</span>
              </div>
              <div style={{ height: 6, background: "rgba(99,102,241,0.08)", borderRadius: 3 }}>
                <div style={{ height: 6, borderRadius: 3, background: cat.color, width: `${cat.score}%`, transition: "width 1.5s ease", boxShadow: `0 0 8px ${cat.color}40` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div style={{ ...card("p") }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 1.5, marginBottom: 16 }}>KEY FINDINGS</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {diagnosticData.findings.map((finding, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <CheckCircle size={16} color="#34d399" style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: 13, color: "#e2e8f0" }}>{finding}</span>
          </div>
        ))}
      </div>
    </div>
    <button style={{ width: "100%", marginTop: 16, padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}>
      <Sparkles size={16} /> Run New Diagnostic
    </button>
  </div>
);

/* TOOLS PANEL */
const ToolsPanel = () => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0 }}>Factory Tools</h2>
        <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>{toolsLive} live / {toolsBuild} building / {tools.length - toolsLive - toolsBuild} planned</p>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <GlowRing pct={Math.round((toolsLive / tools.length) * 100)} size={80} color="#34d399" label="LIVE" />
        <GlowRing pct={Math.round(((toolsLive + toolsBuild) / tools.length) * 100)} size={80} color="#818cf8" label="TOTAL" />
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
      {tools.map((tool, i) => (
        <div key={i} style={{ ...card("p"), transition: "all 0.2s", cursor: tool.url ? "pointer" : "default" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{tool.name}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{tool.brand}</div>
            </div>
            <StatusDot status={tool.status} />
          </div>
          {tool.url && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 12, padding: "6px 10px", background: "rgba(99,102,241,0.08)", borderRadius: 8 }}>
              <ExternalLink size={12} color="#818cf8" />
              <span style={{ fontSize: 11, color: "#818cf8", fontFamily: "monospace" }}>{tool.url}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

/* PIPELINE PANEL */
const PipelinePanel = () => (
  <div>
    <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: "0 0 24px" }}>Deal Pipeline</h2>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
      {[
        { label: "PIPELINE VALUE", val: "$340K", color: "#818cf8" },
        { label: "WEIGHTED VALUE", val: "$198K", color: "#34d399" },
        { label: "ACTIVE DEALS", val: "5", color: "#fbbf24" },
        { label: "AVG DEAL SIZE", val: "$6.8K", color: "#f472b6" }
      ].map((m, i) => (
        <div key={i} style={{ ...card("p"), textAlign: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 1.5 }}>{m.label}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: m.color, marginTop: 8 }}>{m.val}</div>
        </div>
      ))}
    </div>
    <div style={{ ...card("p"), marginBottom: 16 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 1.5, marginBottom: 16 }}>PIPELINE FUNNEL</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {pipelineStages.map((s, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{s.stage}</span>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>{s.count} leads</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.value}</span>
              </div>
            </div>
            <div style={{ height: 6, background: "rgba(99,102,241,0.08)", borderRadius: 3 }}>
              <div style={{ height: 6, borderRadius: 3, background: s.color, width: `${(s.count / 127) * 100}%`, transition: "width 1s ease" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ ...card("p") }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 1.5, marginBottom: 16 }}>ALL DEALS</div>
      {recentDeals.map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: i < recentDeals.length - 1 ? "1px solid rgba(99,102,241,0.06)" : "none" }}>
          <div style={{ width: 4, height: 44, borderRadius: 2, background: d.color }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{d.name}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{d.stage}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{d.value}</div>
            <div style={{ fontSize: 12, color: d.color, fontWeight: 600 }}>{d.probability}% confidence</div>
          </div>
          <div style={{ width: 120 }}>
            <div style={{ height: 6, background: "rgba(99,102,241,0.08)", borderRadius: 3 }}>
              <div style={{ height: 6, borderRadius: 3, background: d.color, width: `${d.probability}%`, transition: "width 1s ease" }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* REVENUE PANEL */
const RevenuePanel = () => {
  const weeklyData = [
    { name: "Mon", revenue: 4200 }, { name: "Tue", revenue: 5100 }, { name: "Wed", revenue: 4800 },
    { name: "Thu", revenue: 6200 }, { name: "Fri", revenue: 7100 }, { name: "Sat", revenue: 5900 }, { name: "Sun", revenue: 4300 }
  ];
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0 }}>Revenue Tracker (RISE)</h2>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Real-time revenue metrics and forecasting</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "YTD REVENUE", val: "$847K", sub: "+18.5% growth", color: "#34d399" },
          { label: "AVG DEAL SIZE", val: "$8,920", sub: "+5.2% vs last Q", color: "#818cf8" },
          { label: "SPEED TO LEAD", val: "2.3m", sub: "-1.2m improvement", color: "#fbbf24" }
        ].map((m, i) => (
          <div key={i} style={{ ...card("p") }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 1.5 }}>{m.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginTop: 8 }}>{m.val}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
              <ArrowUpRight size={12} color={m.color} />
              <span style={{ fontSize: 11, color: m.color, fontWeight: 600 }}>{m.sub}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ ...card("p") }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 1.5, marginBottom: 16 }}>WEEKLY REVENUE TREND</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.06)" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(1)}K`} />
            <Tooltip contentStyle={{ background: "rgba(15,23,42,0.95)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 12 }} labelStyle={{ color: "#94a3b8" }} />
            <Bar dataKey="revenue" fill="#818cf8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* CONTENT PANEL */
const ContentPanel = () => (
  <div>
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0 }}>Content Engine</h2>
      <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>AI-generated content calendar and performance</p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
      {[
        { label: "CONTENT CREATED", val: "156", sub: "+32 this month", icon: FileText, color: "#f472b6" },
        { label: "ENGAGEMENT RATE", val: "4.2%", sub: "+0.8% improvement", icon: TrendingUp, color: "#818cf8" },
        { label: "SCHEDULED POSTS", val: "28", sub: "Next 7 days", icon: Clock, color: "#fbbf24" }
      ].map((m, i) => (
        <div key={i} style={{ ...card("p") }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 1.5 }}>{m.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginTop: 8 }}>{m.val}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
                <ArrowUpRight size={12} color={m.color} />
                <span style={{ fontSize: 11, color: m.color, fontWeight: 600 }}>{m.sub}</span>
              </div>
            </div>
            <m.icon size={20} color={m.color} style={{ opacity: 0.6 }} />
          </div>
        </div>
      ))}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div style={{ ...card("p") }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 1.5, marginBottom: 16 }}>WEEKLY CONTENT OUTPUT</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={contentMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.06)" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "rgba(15,23,42,0.95)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 12 }} labelStyle={{ color: "#94a3b8" }} />
            <Bar dataKey="pieces" fill="#f472b6" radius={[4, 4, 0, 0]} name="Pieces" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ ...card("p") }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 1.5, marginBottom: 16 }}>UPCOMING CONTENT</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { title: "LinkedIn: AI Automation ROI Breakdown", status: "Scheduled", day: "Mon" },
            { title: "Blog: 5 Revenue Leaks Every SMB Has", status: "Drafting", day: "Tue" },
            { title: "Case Study: Trusted Roofing Results", status: "In Review", day: "Wed" },
            { title: "Twitter Thread: Content Matrix Launch", status: "Scheduled", day: "Thu" },
            { title: "Email: Weekly AI Insights Newsletter", status: "Queued", day: "Fri" }
          ].map((item, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "rgba(99,102,241,0.04)", borderRadius: 10, border: "1px solid rgba(99,102,241,0.06)" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{item.title}</div>
                <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{item.day}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: item.status === "Scheduled" ? "#34d399" : item.status === "Drafting" ? "#fbbf24" : "#818cf8", padding: "2px 8px", borderRadius: 6, background: item.status === "Scheduled" ? "rgba(52,211,153,0.1)" : item.status === "Drafting" ? "rgba(251,191,36,0.1)" : "rgba(129,140,248,0.1)" }}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ENGINES PANEL */
const EnginesPanel = () => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0 }}>The 11 Engines</h2>
        <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
          {engines.filter(e => e.status === "active").length} active / {engines.filter(e => e.status === "building").length} building / {engines.filter(e => e.status === "planned").length} planned
        </p>
      </div>
      <GlowRing pct={Math.round((engines.filter(e => e.status === "active").length / engines.length) * 100)} size={90} color="#34d399" label="ACTIVE" />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
      {engines.map((eng, i) => (
        <div key={i} style={{ ...card("p"), transition: "all 0.2s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${engColor[eng.status]}10`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${engColor[eng.status]}20` }}>
              <eng.icon size={20} color={engColor[eng.status]} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{eng.name}</div>
              <StatusDot status={eng.status} />
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>{eng.metric}</div>
        </div>
      ))}
    </div>
  </div>
);

/* REPORTS PANEL */
const ReportsPanel = () => (
  <div>
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0 }}>Reports</h2>
      <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Generated reports and historical analytics</p>
    </div>
    <div style={{ ...card("p") }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 1.5, marginBottom: 16 }}>RECENT REPORTS</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { name: "Monthly Performance Report", date: "April 1, 2026" },
          { name: "Q1 Strategic Review", date: "March 31, 2026" },
          { name: "Lead Quality Analysis", date: "March 28, 2026" },
          { name: "Content Performance Deep Dive", date: "March 25, 2026" },
          { name: "Competitor Benchmark", date: "March 20, 2026" },
          { name: "Empire Revenue Forecast", date: "March 15, 2026" },
          { name: "Brand Amplification Report", date: "March 10, 2026" }
        ].map((report, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "rgba(99,102,241,0.04)", borderRadius: 10, border: "1px solid rgba(99,102,241,0.06)", cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <FileDown size={16} color="#818cf8" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{report.name}</div>
                <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{report.date}</div>
              </div>
            </div>
            <ChevronRight size={16} color="#475569" />
          </div>
        ))}
      </div>
    </div>
    <button style={{ width: "100%", marginTop: 16, padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}>
      <FileDown size={16} /> Generate New Report
    </button>
  </div>
);

/* SETTINGS PANEL */
const SettingsPanel = () => (
  <div>
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0 }}>Settings</h2>
      <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Configure your dashboard and integrations</p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div style={{ ...card("p") }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 1.5, marginBottom: 16 }}>GENERAL</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { name: "Notifications", desc: "Real-time alerts for key metrics", on: true },
            { name: "Email Reports", desc: "Weekly summary to your inbox", on: true },
            { name: "Agent Alerts", desc: "Notify on AI agent completions", on: true },
            { name: "Dark Mode", desc: "Currently active", on: true }
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", background: "rgba(99,102,241,0.04)", borderRadius: 10, border: "1px solid rgba(99,102,241,0.06)" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{s.name}</div>
                <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{s.desc}</div>
              </div>
              <div style={{ width: 40, height: 22, borderRadius: 11, background: s.on ? "#34d399" : "#334155", transition: "background 0.2s", display: "flex", alignItems: "center", padding: 2 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", transform: s.on ? "translateX(18px)" : "translateX(0)", transition: "transform 0.2s" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...card("p") }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 1.5, marginBottom: 16 }}>INTEGRATIONS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { name: "Salesforce", status: "Connected" },
            { name: "HubSpot", status: "Connected" },
            { name: "Google Analytics", status: "Connected" },
            { name: "Stripe", status: "Connected" },
            { name: "Apollo", status: "Connected" },
            { name: "Slack", status: "Pending" }
          ].map((svc, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px", background: "rgba(99,102,241,0.04)", borderRadius: 10, border: "1px solid rgba(99,102,241,0.06)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: svc.status === "Connected" ? "#34d399" : "#fbbf24", boxShadow: `0 0 8px ${svc.status === "Connected" ? "#34d399" : "#fbbf24"}` }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", flex: 1 }}>{svc.name}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: svc.status === "Connected" ? "#34d399" : "#fbbf24" }}>{svc.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* MAIN APP */
export default function CEOHQMissionControl() {
  const [activePanel, setActivePanel] = useState("command");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const renderPanel = () => {
    switch (activePanel) {
      case "command": return <CommandPanel />;
      case "agents": return <AgentsPanel />;
      case "intelligence": return <IntelligencePanel />;
      case "tools": return <ToolsPanel />;
      case "pipeline": return <PipelinePanel />;
      case "revenue": return <RevenuePanel />;
      case "content": return <ContentPanel />;
      case "engines": return <EnginesPanel />;
      case "reports": return <ReportsPanel />;
      case "settings": return <SettingsPanel />;
      default: return <CommandPanel />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(145deg, #020617 0%, #0f172a 50%, #020617 100%)", color: "#e2e8f0", fontFamily: "'Inter','SF Pro Display',-apple-system,sans-serif" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "20%", left: "30%", width: 600, height: 600, borderRadius: "50%", background: "rgba(99,102,241,0.04)", filter: "blur(120px)" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "20%", width: 500, height: 500, borderRadius: "50%", background: "rgba(244,114,182,0.03)", filter: "blur(100px)" }} />
      </div>
      <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(2,6,23,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(99,102,241,0.08)", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2.5, color: "#fff" }}>CEO HQ MISSION CONTROL</span>
            <span style={{ fontSize: 10, color: "#475569", marginLeft: 12 }}>KING (LOS SILVA) &bull; LIVE OPS</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 10px #34d399" }} />
              <span style={{ fontSize: 10, color: "#34d399", fontWeight: 600 }}>ALL SYSTEMS ONLINE</span>
            </div>
            <span style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>{time.toLocaleTimeString("en-US", { hour12: false })}</span>
          </div>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "24px 24px 48px" }}>
          {renderPanel()}
        </div>
        <div style={{ borderTop: "1px solid rgba(99,102,241,0.06)", padding: "12px 24px", textAlign: "center" }}>
          <span style={{ fontSize: 10, color: "#334155" }}>CEO HQ MISSION CONTROL v3.0 &bull; Built by 33v Product Studio &bull; Powered by Claude</span>
        </div>
      </div>
    </div>
  );
}
