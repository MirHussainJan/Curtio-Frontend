import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Zap,
  Plus,
  Copy,
  Check,
  BarChart2,
  ExternalLink,
  Trash2,
  Link as LinkIcon,
  TrendingUp,
  MousePointerClick,
  Search,
  ToggleLeft,
  ToggleRight,
  QrCode,
  Lock,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Info,
  LogOut,
} from "lucide-react";
import { SHORTENER_DOMAIN } from "../components/Shortner";

const FREE_LIMIT = 1;

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
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

function QrModal({ link, onClose }) {
  const svgData = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="white"/>
      <rect x="10" y="10" width="80" height="80" fill="none" stroke="#4F46E5" stroke-width="8"/>
      <rect x="30" y="30" width="40" height="40" fill="#4F46E5"/>
      <rect x="110" y="10" width="80" height="80" fill="none" stroke="#4F46E5" stroke-width="8"/>
      <rect x="130" y="30" width="40" height="40" fill="#4F46E5"/>
      <rect x="10" y="110" width="80" height="80" fill="none" stroke="#4F46E5" stroke-width="8"/>
      <rect x="30" y="130" width="40" height="40" fill="#4F46E5"/>
      <rect x="110" y="110" width="20" height="20" fill="#4F46E5"/>
      <rect x="140" y="110" width="20" height="20" fill="#4F46E5"/>
      <rect x="170" y="110" width="20" height="20" fill="#4F46E5"/>
      <rect x="110" y="140" width="20" height="20" fill="#4F46E5"/>
      <rect x="150" y="150" width="40" height="40" fill="#4F46E5"/>
      <text x="100" y="195" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#6366F1">${link.short}</text>
    </svg>
  `;
  const dataUrl = `data:image/svg+xml;base64,${btoa(svgData)}`;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-extrabold text-slate-900 text-lg mb-1">QR Code</h3>
        <p className="text-slate-500 text-sm mb-5">{link.short}</p>
        <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-center mb-5">
          <img src={dataUrl} alt="QR Code" className="w-48 h-48" />
        </div>
        <a
          href={dataUrl}
          download={`${link.slug}-qr.svg`}
          className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 rounded-xl mb-3 transition-colors"
        >
          Download SVG
        </a>
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

export default function Dashboard() {
  const navigate = useNavigate();

  // Safely parse user data
  const getStoredUser = () => {
    // Check new key first, then fallback to old key
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

  const [links, setLinks] = useState([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [error, setError] = useState("");

  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState(null);
  const [search, setSearch] = useState("");
  const [qrLink, setQrLink] = useState(null);

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const activeLinks = links.filter((l) => l.active).length;
  const atLimit = links.length >= FREE_LIMIT;

  useEffect(() => {
    if (token) {
      fetchLinks();
    } else {
      setLoadingLinks(false);
    }
  }, [token]);

  async function fetchLinks() {
    setLoadingLinks(true);
    setError("");
    try {
      const res = await fetch("https://bravely-backend.vercel.app/api/urls", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
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
        }));
        setLinks(mapped);
      } else {
        setError(data.message || "Failed to fetch short links.");
      }
    } catch (err) {
      setError("Network error. Could not connect to server.");
    } finally {
      setLoadingLinks(false);
    }
  }

  function handleCopy(id, short) {
    navigator.clipboard.writeText(short);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  }

  async function handleDelete(id, slug) {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
    setError("");
    try {
      const res = await fetch(`http://localhost:6090/api/urls/${slug}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setLinks((prev) => prev.filter((l) => l.id !== id));
      } else {
        setError(data.message || "Failed to delete link.");
      }
    } catch (err) {
      setError("Network error. Could not delete link.");
    }
  }

  async function handleToggle(id, slug) {
    setError("");
    try {
      const res = await fetch(`http://localhost:6090/api/urls/${slug}/toggle`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setLinks((prev) =>
          prev.map((l) =>
            l.id === id ? { ...l, active: data.url.active } : l,
          ),
        );
      } else {
        setError(data.message || "Failed to update link status.");
      }
    } catch (err) {
      setError("Network error. Could not update link status.");
    }
  }

  function buildFinalUrl(base) {
    const params = [];
    if (utmSource) params.push(`utm_source=${encodeURIComponent(utmSource)}`);
    if (utmMedium) params.push(`utm_medium=${encodeURIComponent(utmMedium)}`);
    if (utmCampaign)
      params.push(`utm_campaign=${encodeURIComponent(utmCampaign)}`);
    if (!params.length) return base;
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}${params.join("&")}`;
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (atLimit) return;
    setCreating(true);
    setError("");
    try {
      const finalUrl = buildFinalUrl(url);
      const res = await fetch("http://localhost:6090/api/urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          originalUrl: finalUrl,
          customAlias: alias,
          password: password || undefined,
          expiresAt: expiresAt || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchLinks();
        setUrl("");
        setAlias("");
        setPassword("");
        setExpiresAt("");
        setUtmSource("");
        setUtmMedium("");
        setUtmCampaign("");
        setShowAdvanced(false);
        setShowForm(false);
      } else {
        setError(data.message || "Failed to create short URL.");
      }
    } catch (err) {
      setError("Network error. Could not create short URL.");
    } finally {
      setCreating(false);
    }
  }

  const filtered = links.filter(
    (l) =>
      l.slug.toLowerCase().includes(search.toLowerCase()) ||
      l.original.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {qrLink && <QrModal link={qrLink} onClose={() => setQrLink(null)} />}

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex w-60 bg-white border-r border-slate-100 flex-col py-6 px-4 fixed top-0 left-0 bottom-0">
          <Link to="/" className="flex items-center gap-2 px-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap size={15} className="text-white" fill="white" />
            </div>
            <span className="text-lg font-extrabold text-slate-900">
              Brevly
            </span>
          </Link>
          <nav className="flex flex-col gap-1 flex-1">
            {[
              { icon: <LinkIcon size={16} />, label: "My Links", active: true },
              {
                icon: <BarChart2 size={16} />,
                label: "Analytics",
                active: false,
              },
              {
                icon: <TrendingUp size={16} />,
                label: "Campaigns",
                active: false,
              },
            ].map((item) => (
              <button
                key={item.label}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                  item.active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>

          {/* Free plan badge */}
          <div className="border border-indigo-100 bg-indigo-50 rounded-xl p-4 mb-4">
            <div className="text-xs font-bold text-indigo-700 mb-1">
              Free Plan
            </div>
            <div className="text-xs text-slate-500 mb-2">
              {links.length}/{FREE_LIMIT} tracked link used
            </div>
            <div className="h-1.5 bg-indigo-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${(links.length / FREE_LIMIT) * 100}%` }}
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center gap-3 px-2 mb-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                {userInitial}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-800 truncate">
                  {userName}
                </div>
                <div className="text-xs text-slate-400 truncate">
                  {userEmail}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 md:ml-60 px-4 md:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">
                My Links
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Manage and track your shortened URL.
              </p>
            </div>
            <button
              onClick={() => (atLimit ? null : setShowForm(!showForm))}
              className={`flex items-center gap-2 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm ${
                atLimit
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
              title={
                atLimit ? "Free plan: 1 tracked link limit" : "Create new link"
              }
            >
              <Plus size={16} /> New Link
            </button>
          </div>

          {/* At limit banner */}
          {atLimit && !showForm && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3 mb-6">
              <AlertCircle
                size={18}
                className="text-amber-500 shrink-0 mt-0.5"
              />
              <div>
                <div className="text-sm font-semibold text-amber-800">
                  You've used your 1 free tracked link.
                </div>
                <div className="text-xs text-amber-700 mt-0.5">
                  On the free plan, you can track one link with full analytics.
                  To manage it, use the controls below. Delete it to create a
                  new one, or stay tuned for more plans.
                </div>
              </div>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-start gap-3 mb-6">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-red-800">Error</div>
                <div className="text-xs text-red-700 mt-0.5">{error}</div>
              </div>
            </div>
          )}

          {/* Create form */}
          {showForm && !atLimit && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-4">
                Create Your Tracked Link
              </h2>
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Destination URL *
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    placeholder="https://your-long-url.com/..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Custom Alias (optional)
                  </label>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                    <span className="text-slate-400 text-sm pl-4 pr-2 whitespace-nowrap">
                      brev.ly/
                    </span>
                    <input
                      type="text"
                      value={alias}
                      onChange={(e) =>
                        setAlias(e.target.value.replace(/[^a-z0-9-]/gi, ""))
                      }
                      placeholder="my-link"
                      className="flex-1 py-2.5 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none"
                    />
                  </div>
                </div>

                {/* Advanced options toggle */}
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors pt-1"
                >
                  {showAdvanced ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                  {showAdvanced ? "Hide" : "Show"} advanced options (UTM,
                  password, expiry)
                </button>

                {showAdvanced && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-4">
                    {/* UTM Builder */}
                    <div>
                      <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                        <TrendingUp size={12} /> UTM Parameters
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          {
                            label: "Source",
                            val: utmSource,
                            set: setUtmSource,
                            ph: "twitter",
                          },
                          {
                            label: "Medium",
                            val: utmMedium,
                            set: setUtmMedium,
                            ph: "social",
                          },
                          {
                            label: "Campaign",
                            val: utmCampaign,
                            set: setUtmCampaign,
                            ph: "launch",
                          },
                        ].map((f) => (
                          <div key={f.label}>
                            <label className="block text-xs text-slate-500 mb-1">
                              {f.label}
                            </label>
                            <input
                              type="text"
                              value={f.val}
                              onChange={(e) => f.set(e.target.value)}
                              placeholder={f.ph}
                              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white"
                            />
                          </div>
                        ))}
                      </div>
                      {(utmSource || utmMedium || utmCampaign) && (
                        <div className="mt-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-500 font-mono break-all">
                          {buildFinalUrl(url || "https://your-url.com")}
                        </div>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                        <Lock size={12} /> Password Protection (optional)
                      </label>
                      <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave blank for no password"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white"
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        Visitors must enter this password before being
                        redirected.
                      </p>
                    </div>

                    {/* Expiry */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                        <Clock size={12} /> Link Expiration (optional)
                      </label>
                      <input
                        type="datetime-local"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white"
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        Link will stop redirecting after this date and time.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={creating}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
                  >
                    {creating ? (
                      <svg
                        className="animate-spin w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                    ) : (
                      "Create Link"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-slate-500 hover:text-slate-800 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <StatCard
              icon={<LinkIcon size={16} className="text-indigo-600" />}
              label="Total Links"
              value={links.length}
              sub={`${activeLinks} active · ${FREE_LIMIT} limit`}
            />
            <StatCard
              icon={<MousePointerClick size={16} className="text-orange-500" />}
              label="Total Clicks"
              value={totalClicks.toLocaleString()}
              sub="All time"
            />
            <StatCard
              icon={<TrendingUp size={16} className="text-indigo-600" />}
              label="Avg. CTR"
              value="3.4%"
              sub="Last 30 days"
            />
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search links..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Links Table */}
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            {loadingLinks ? (
              <div className="py-16 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3"></div>
                <div className="text-slate-500 text-sm font-medium">
                  Loading your tracked links...
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <LinkIcon size={28} className="text-slate-200 mx-auto mb-3" />
                <div className="text-slate-500 text-sm font-medium">
                  No links yet
                </div>
                <div className="text-slate-400 text-xs mt-1">
                  Create your first tracked link above.
                </div>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">
                      Short Link
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3 hidden md:table-cell">
                      Destination
                    </th>
                    <th className="text-right text-xs font-semibold text-slate-500 px-5 py-3">
                      Clicks
                    </th>
                    <th className="text-center text-xs font-semibold text-slate-500 px-5 py-3">
                      Status
                    </th>
                    <th className="text-right text-xs font-semibold text-slate-500 px-5 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((link, i) => (
                    <tr
                      key={link.id}
                      className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                            <Zap
                              size={12}
                              className="text-indigo-500"
                              fill="currentColor"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-indigo-600">
                              {link.short}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-slate-400">
                                {link.createdAt}
                              </span>
                              {link.password && (
                                <Lock
                                  size={10}
                                  className="text-amber-500"
                                  title="Password protected"
                                />
                              )}
                              {link.expiresAt && (
                                <Clock
                                  size={10}
                                  className="text-orange-500"
                                  title={`Expires ${link.expiresAt}`}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-xs text-slate-500 truncate max-w-[200px] block">
                          {link.original}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-sm font-bold text-slate-800">
                          {link.clicks.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleToggle(link.id, link.slug)}
                          className="flex items-center justify-center mx-auto"
                        >
                          {link.active ? (
                            <ToggleRight
                              size={22}
                              className="text-indigo-500"
                            />
                          ) : (
                            <ToggleLeft size={22} className="text-slate-300" />
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleCopy(link.id, link.short)}
                            title="Copy link"
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                          >
                            {copied === link.id ? (
                              <Check size={14} className="text-green-500" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                          <button
                            onClick={() => setQrLink(link)}
                            title="QR Code"
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-violet-600 transition-colors"
                          >
                            <QrCode size={14} />
                          </button>
                          <Link
                            to={`/analytics/${link.id}`}
                            title="Analytics"
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                          >
                            <BarChart2 size={14} />
                          </Link>
                          <a
                            href={link.original}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open destination"
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                          >
                            <ExternalLink size={14} />
                          </a>
                          <button
                            onClick={() => handleDelete(link.id, link.slug)}
                            title="Delete"
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <Info size={13} />
            <span>
              Free plan: 1 tracked link. Delete your current link to create a
              new one.
            </span>
          </div>
        </main>
      </div>
    </div>
  );
}
