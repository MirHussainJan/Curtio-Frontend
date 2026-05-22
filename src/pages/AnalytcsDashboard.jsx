import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Zap,
  Copy,
  Check,
  BarChart2,
  ExternalLink,
  Trash2,
  Link as LinkIcon,
  TrendingUp,
  MousePointerClick,
  ToggleLeft,
  ToggleRight,
  QrCode,
  Lock,
  Clock,
  Menu,
  X,
  LogOut,
  Pencil,
  Info,
  AlertCircle,
  Smartphone,
  Globe,
  Activity
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import { SHORTENER_DOMAIN } from "../components/Shortner";

const COLORS = ["#4F46E5", "#F97316", "#22C55E", "#EAB308", "#EC4899"];

function StatCard({ icon, label, value, sub, className = "" }) {
  return (
    <div className={`bg-white border border-slate-100 rounded-2xl p-5 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-extrabold text-slate-900">{value}</div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-slate-100 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-lg">
        <div className="font-semibold mb-0.5">{label}</div>
        <div>{payload[0].value.toLocaleString()} clicks</div>
      </div>
    );
  }
  return null;
};

function QrModal({ link, onClose }) {
  const canvasRef = useRef(null);
  const [qrReady, setQrReady] = useState(false);
  const [qrError, setQrError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setQrReady(false);
    setQrError("");

    import("qrcode").then((QRCode) => {
      if (cancelled || !canvasRef.current) return;
      QRCode.toCanvas(
        canvasRef.current,
        link.short,
        {
          width: 200,
          margin: 2,
          color: { dark: "#4F46E5", light: "#F8FAFC" },
        },
        (err) => {
          if (cancelled) return;
          if (err) {
            setQrError("Failed to generate QR code.");
          } else {
            setQrReady(true);
          }
        }
      );
    }).catch(() => {
      if (!cancelled) setQrError("Could not load QR library.");
    });

    return () => { cancelled = true; };
  }, [link.short]);

  function handleDownload() {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${link.slug}-qr.png`;
    a.click();
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-extrabold text-slate-900 text-lg mb-1">QR Code</h3>
        <p className="text-slate-500 text-sm mb-5 break-all">{link.short}</p>

        <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-center mb-5 min-h-[216px]">
          {qrError ? (
            <p className="text-xs text-red-500">{qrError}</p>
          ) : (
            <>
              {!qrReady && (
                <div className="absolute">
                  <div className="w-8 h-8 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                </div>
              )}
              <canvas
                ref={canvasRef}
                className={`rounded-lg transition-opacity duration-300 ${qrReady ? "opacity-100" : "opacity-0"}`}
              />
            </>
          )}
        </div>

        {!qrError && (
          <button
            onClick={handleDownload}
            disabled={!qrReady}
            className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm py-2.5 rounded-xl mb-3 transition-colors"
          >
            Download PNG
          </button>
        )}
        <button
          onClick={onClose}
          className="block w-full text-center text-slate-500 hover:text-slate-800 text-sm py-2 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function DeleteModal({ onConfirm, onCancel, deleting }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => !deleting && onCancel()}
    >
      <div
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={22} className="text-red-500" />
        </div>
        <h3 className="font-extrabold text-slate-900 text-lg mb-1">
          Delete this link?
        </h3>
        <p className="text-slate-500 text-sm mb-6">
          This action cannot be undone. The short link will stop working
          immediately.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {deleting ? (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <>
                <Trash2 size={14} /> Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AnalytcsDashboard() {
  const navigate = useNavigate();

  const getStoredUser = () => {
    const data =
      localStorage.getItem("LoginUser") || localStorage.getItem("user");
    if (!data || data === "undefined") return {};
    try {
      return JSON.parse(data);
    } catch (e) {
      return {};
    }
  };

  const storedUser = getStoredUser();
  const userName = storedUser.name || "User";
  const userEmail = storedUser.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

  function handleLogout() {
    localStorage.removeItem("apiToken");
    localStorage.removeItem("LoginUser");
    navigate("/login");
  }

  const token = localStorage.getItem("apiToken");

  const [rawUrls, setRawUrls] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(null);
  const [qrLink, setQrLink] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (token) {
      fetchUrls();
    } else {
      setLoading(false);
    }
  }, [token]);

  async function fetchUrls() {
    setLoading(true);
    setError("");
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/urls`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setRawUrls(data.urls);
        const mapped = data.urls.map((u) => ({
          id: u._id,
          slug: u.shortCode,
          original: u.originalUrl,
          short: `${SHORTENER_DOMAIN}/${u.shortCode}`,
          clicks: u.clicks,
          createdAt: new Date(u.createdAt).toISOString().slice(0, 10),
          active: u.active,
          password: u.password,
          expiresAt: u.expiresAt
            ? new Date(u.expiresAt).toISOString().slice(0, 16)
            : null,
          clickLogs: u.clickLogs || [],
        }));
        setLinks(mapped);
      } else {
        setError(data.message || "Failed to fetch URLs.");
      }
    } catch (err) {
      setError("Network error. Could not retrieve link statistics.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(id, short) {
    navigator.clipboard.writeText(short);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  }

  function handleDelete(id, slug) {
    setDeleteModal({ id, slug });
  }

  async function performDelete() {
    if (!deleteModal) return;
    const { id, slug } = deleteModal;
    setDeleting(true);
    setError("");
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/urls/${slug}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setLinks((prev) => prev.filter((l) => l.id !== id));
        setRawUrls((prev) => prev.filter((u) => u._id !== id));
        setDeleteModal(null);
      } else {
        setError(data.message || "Failed to delete link.");
        setDeleteModal(null);
      }
    } catch (err) {
      setError("Network error. Could not delete link.");
      setDeleteModal(null);
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggle(id, slug) {
    setError("");
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/urls/${slug}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setLinks((prev) =>
          prev.map((l) =>
            l.id === id ? { ...l, active: data.url.active } : l
          )
        );
        setRawUrls((prev) =>
          prev.map((u) =>
            u._id === id ? { ...u, active: data.url.active } : u
          )
        );
      } else {
        setError(data.message || "Failed to update link status.");
      }
    } catch (err) {
      setError("Network error. Could not update link status.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-4"></div>
        <p className="text-slate-500 font-semibold text-sm">Loading user analytics...</p>
      </div>
    );
  }

  // ── Aggregated Stats Calculations ──
  const totalUrls = links.length;
  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const activeLinks = links.filter((l) => l.active).length;
  const inactiveLinks = totalUrls - activeLinks;

  // Clicks Over Time (Last 7 Days)
  const clickHistory = [];
  const daysMap = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    daysMap[dateStr] = 0;
  }

  links.forEach((l) => {
    if (l.clickLogs) {
      l.clickLogs.forEach((log) => {
        const dateStr = new Date(log.clickedAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
        if (daysMap[dateStr] !== undefined) {
          daysMap[dateStr] += 1;
        }
      });
    }
  });

  Object.keys(daysMap).forEach((date) => {
    clickHistory.push({ date, clicks: daysMap[date] });
  });

  // Devices Breakdown
  let mobile = 0, desktop = 0, tablet = 0;
  let loggedClicks = 0;

  links.forEach((l) => {
    if (l.clickLogs) {
      l.clickLogs.forEach((log) => {
        loggedClicks++;
        const ua = log.userAgent.toLowerCase();
        if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
          mobile++;
        } else if (/tablet|ipad|playbook|silk/i.test(ua)) {
          tablet++;
        } else {
          desktop++;
        }
      });
    }
  });

  const divider = loggedClicks || 1;
  const deviceData = [
    { name: "Desktop", value: Math.round((desktop / divider) * 100) },
    { name: "Mobile", value: Math.round((mobile / divider) * 100) },
    { name: "Tablet", value: Math.round((tablet / divider) * 100) },
  ].filter((d) => d.value > 0);

  const finalDeviceData = deviceData.length > 0 ? deviceData : [{ name: "Desktop", value: 100 }];

  // Referrers Breakdown
  let direct = 0, social = 0, organic = 0;
  links.forEach((l) => {
    if (l.clickLogs) {
      l.clickLogs.forEach((log) => {
        const ua = log.userAgent.toLowerCase();
        if (/twitter|t.co|x.com|facebook|fb|instagram|linkedin/i.test(ua)) {
          social++;
        } else if (/google|yahoo|bing|duckduckgo/i.test(ua)) {
          organic++;
        } else {
          direct++;
        }
      });
    }
  });

  const referrerData = [
    { source: "Social Media", visits: social },
    { source: "Search Engines", visits: organic },
    { source: "Direct / Email", visits: direct || (totalClicks - social - organic) },
  ].filter(r => r.visits >= 0);

  // Aggregate real country data across all links
  const geoDataMap = {};
  links.forEach((l) => {
    if (l.clickLogs) {
      l.clickLogs.forEach((log) => {
        const countryName = log.country || "Unknown";
        const countryCode = log.countryCode || "unknown";
        if (!geoDataMap[countryName]) {
          geoDataMap[countryName] = {
            country: countryName,
            countryCode: countryCode,
            clicks: 0,
          };
        }
        geoDataMap[countryName].clicks += 1;
      });
    }
  });

  const getFlagEmoji = (code) => {
    if (!code || code.toLowerCase() === "unknown") return "🌐";
    try {
      const codePoints = code
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt(0));
      return String.fromCodePoint(...codePoints);
    } catch (e) {
      return "🌐";
    }
  };

  const geoData = Object.values(geoDataMap)
    .sort((a, b) => b.clicks - a.clicks)
    .map((g) => ({
      country: g.country,
      flag: getFlagEmoji(g.countryCode),
      clicks: g.clicks,
    }));

  const finalGeoData = geoData.length > 0 
    ? geoData 
    : [{ country: "Direct Visits", flag: "🌐", clicks: totalClicks || 0 }];

  // Top Clicked Links (Sorted by clicks desc)
  const topLinks = [...links].sort((a, b) => b.clicks - a.clicks).slice(0, 10);

  return (
    <div className="min-h-screen bg-slate-50">
      {qrLink && <QrModal link={qrLink} onClose={() => setQrLink(null)} />}
      {deleteModal && (
        <DeleteModal
          onConfirm={performDelete}
          onCancel={() => setDeleteModal(null)}
          deleting={deleting}
        />
      )}

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        {/* ── Sidebar ── */}
        <aside
          className={`
            fixed top-0 left-0 bottom-0 z-30 w-64 bg-white border-r border-slate-100
            flex flex-col py-6 px-4
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
          `}
        >
          {/* Close button — mobile only */}
          <div className="flex justify-end mb-2 md:hidden">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <X size={20} />
            </button>
          </div>

          <Link to="/" className="flex items-center gap-2 px-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
              <Zap size={15} className="text-white" fill="white" />
            </div>
            <span className="text-lg font-extrabold text-slate-900">Brevly</span>
          </Link>

          <nav className="flex flex-col gap-1 flex-1">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            >
              <LinkIcon size={16} /> My Links
            </Link>
            <Link
              to="/dashboard/analytics"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left bg-indigo-50 text-indigo-700 font-semibold"
            >
              <BarChart2 size={16} /> Analytics
            </Link>
            <Link
              to="/dashboard/campaigns"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            >
              <TrendingUp size={16} /> Campaigns
            </Link>
          </nav>

          <div className="border-t border-gray-400 pt-4">
            <div className="flex items-center gap-3 px-2 mb-3 min-w-0">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                {userInitial}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-800 truncate">{userName}</div>
                <div className="text-xs text-slate-400 truncate">{userEmail}</div>
              </div>
            </div>
            <Link
              to="/dashboard/editprofile"
              className="flex items-center justify-center gap-2 w-full bg-indigo-700 text-white text-sm font-medium px-3 py-2 rounded-xl text-center mt-2 cursor-pointer hover:bg-indigo-800 transition-colors"
            >
              <Pencil size={15} /> Edit Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-indigo-700 text-white text-sm font-medium px-3 py-2 rounded-xl text-center mt-2 cursor-pointer hover:bg-indigo-800 transition-colors flex w-full items-center justify-center gap-2"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </aside>

        {/* ── Main Content Area ── */}
        <main className="flex-1 min-w-0 md:ml-64 px-4 sm:px-6 md:px-8 py-6 md:py-8 space-y-6">
          {/* Top Header */}
          <div className="flex items-center justify-between gap-3">
            <button
              className="md:hidden p-2 rounded-xl border border-slate-200 bg-white shadow-sm text-slate-600 hover:bg-slate-50 shrink-0"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>

            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 truncate">
                Analytics Dashboard
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Understand user engagement and link performance globally.
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
              <AlertCircle size={17} className="text-red-500 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-red-800">Error</div>
                <div className="text-xs text-red-700 mt-0.5 break-words">{error}</div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<LinkIcon size={18} className="text-indigo-600" />}
              label="Total Links"
              value={totalUrls.toLocaleString()}
              sub="Created URLs"
            />
            <StatCard
              icon={<MousePointerClick size={18} className="text-orange-500" />}
              label="Total Clicks"
              value={totalClicks.toLocaleString()}
              sub="All time traffic"
            />
            <StatCard
              icon={<Activity size={18} className="text-green-500" />}
              label="Active Links"
              value={activeLinks.toLocaleString()}
              sub="Currently redirecting"
            />
            <StatCard
              icon={<ToggleLeft size={18} className="text-slate-400" />}
              label="Inactive Links"
              value={inactiveLinks.toLocaleString()}
              sub="Disabled links"
            />
          </div>

          {/* Clicks Over Time Aggregated Chart */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">Aggregate Traffic Trend</h2>
                <p className="text-xs text-slate-400">Total clicks recorded across all links in the last 7 days</p>
              </div>
              <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full w-max">
                Last 7 Days
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={clickHistory} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="globalClickGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#4F46E5"
                  strokeWidth={2.5}
                  fill="url(#globalClickGrad)"
                  dot={{ r: 4, fill: "#4F46E5", strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Referrers + Devices Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Top Referrers */}
            <Card className="p-6">
              <h2 className="text-base font-bold text-slate-900 mb-1">Referrer Breakdown</h2>
              <p className="text-xs text-slate-400 mb-5">Traffic source classification based on clicking clients</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={referrerData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="source" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip
                    formatter={(v) => [v.toLocaleString(), "visits"]}
                    contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 12 }}
                  />
                  <Bar dataKey="visits" fill="#4F46E5" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Device Breakdown */}
            <Card className="p-6">
              <h2 className="text-base font-bold text-slate-900 mb-1">Device Breakdown</h2>
              <p className="text-xs text-slate-400 mb-5">Distribution of user device types across all clicks</p>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="55%" height={180}>
                  <PieChart>
                    <Pie
                      data={finalDeviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {finalDeviceData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => [`${v}%`, ""]}
                      contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 flex-1">
                  {finalDeviceData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-xs text-slate-600 truncate">{d.name}</span>
                      <span className="text-xs font-bold text-slate-800 ml-auto pl-2">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Geographic Breakdown & Top Links Row */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Country Share */}
            <Card className="p-6 lg:col-span-1">
              <h2 className="text-base font-bold text-slate-900 mb-1">Geographic Share</h2>
              <p className="text-xs text-slate-400 mb-4">Estimated visitor origins based on click patterns</p>
              <div className="space-y-3.5">
                {finalGeoData.map((geo, i) => {
                  const max = finalGeoData[0]?.clicks || 1;
                  const pct = Math.round((geo.clicks / max) * 100);
                  return (
                    <div key={geo.country} className="flex items-center gap-3">
                      <span className="text-xl w-6 text-center shrink-0">{geo.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-700 font-semibold truncate">{geo.country}</span>
                          <span className="text-xs font-bold text-slate-800 ml-2">{geo.clicks.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              background: i === 0 ? "#4F46E5" : i === 1 ? "#6366F1" : i === 2 ? "#818CF8" : "#A5B4FC"
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Top Performing Links */}
            <Card className="p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-bold text-slate-900">Top Performing Links</h2>
                <div className="text-xs font-medium text-slate-400">Sorted by clicks</div>
              </div>
              <p className="text-xs text-slate-400 mb-4">Your most popular shortened URLs and their settings</p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <th className="py-2.5 pr-3">Short Link</th>
                      <th className="py-2.5 px-3 text-right">Clicks</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 pl-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topLinks.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-slate-400 text-sm">
                          No links created yet.
                        </td>
                      </tr>
                    ) : (
                      topLinks.map((link) => (
                        <tr key={link.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors text-sm">
                          <td className="py-3 pr-3 font-semibold text-indigo-600 max-w-[200px] truncate">
                            <div>
                              <div className="truncate">{link.short}</div>
                              <div className="text-[10px] text-slate-400 font-normal truncate mt-0.5">
                                {link.original}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-slate-800">
                            {link.clicks.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => handleToggle(link.id, link.slug)}
                              className="focus:outline-none inline-flex items-center justify-center cursor-pointer"
                            >
                              {link.active ? (
                                <ToggleRight size={20} className="text-indigo-500" />
                              ) : (
                                <ToggleLeft size={20} className="text-slate-300" />
                              )}
                            </button>
                          </td>
                          <td className="py-3 pl-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleCopy(link.id, link.short)}
                                title="Copy Link"
                                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                              >
                                {copied === link.id ? (
                                  <Check size={13} className="text-green-500" />
                                ) : (
                                  <Copy size={13} />
                                )}
                              </button>
                              <button
                                onClick={() => setQrLink(link)}
                                title="QR Code"
                                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                              >
                                <QrCode size={13} />
                              </button>
                              <Link
                                to={`/analytics/${link.id}`}
                                title="Detailed Analytics"
                                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                              >
                                <BarChart2 size={13} />
                              </Link>
                              <button
                                onClick={() => handleDelete(link.id, link.slug)}
                                title="Delete"
                                className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
