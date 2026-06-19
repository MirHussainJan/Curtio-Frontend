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
  Activity,
  Funnel,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { SHORTENER_DOMAIN } from "../components/Shortner";
import Sidebar from "../components/Sidebar";
import Filter from "../components/filter";

const FREE_LIMIT = 100;
import {
  FaBots,
  FaConfluence,
  FaMountainSun,
  FaSignalMessenger,
  FaSlack,
  FaTrello,
  FaTwitch,
  FaYahoo,
} from "react-icons/fa6";
import {
  FaDiscord,
  FaFacebook,
  FaInstagram,
  FaLine,
  FaLinkedin,
  FaPinterest,
  FaReddit,
  FaSignal,
  FaSnapchat,
  FaTelegramPlane,
  FaTiktok,
  FaTwitter,
  FaViber,
  FaWhatsapp,
  FaYoutube,
  FaChrome,
  FaFirefox,
  FaSafari,
  FaEdge,
  FaOpera,
  FaInternetExplorer,
} from "react-icons/fa";
import { IoLogoWechat } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import { PiMicrosoftOutlookLogoDuotone } from "react-icons/pi";
import { BiLogoMicrosoftTeams } from "react-icons/bi";
import {
  SiAsana,
  SiGmail,
  SiGooglemeet,
  SiKik,
  SiNotion,
  SiThunderbird,
  SiZoom,
  SiTorbrowser,
  SiBrave,
} from "react-icons/si";
const COLORS = ["#4F46E5", "#F97316", "#22C55E", "#EAB308", "#EC4899"];

// Per-platform detection rules used across analytics pages
/**
 * Referer-based source detection rules.
 * Bot preview hits are already filtered on the backend,
 * so only real human clicks reach the analytics.
 */
const REFERER_RULES = [
  {
    source: "WhatsApp",
    pattern: /whatsapp\.com|wa\.me/i,
    color: "#4F46E5",
    icon: FaWhatsapp,
  },
  {
    source: "Telegram",
    pattern: /t\.me|telegram\.org|telegram\.me/i,
    color: "#4F46E5",
    icon: FaTelegramPlane,
  },
  {
    source: "Instagram",
    pattern: /instagram\.com|l\.instagram\.com/i,
    color: "#4F46E5",
    icon: FaInstagram,
  },
  {
    source: "Facebook",
    pattern:
      /facebook\.com|l\.facebook\.com|lm\.facebook\.com|m\.facebook\.com|fb\.com/i,
    color: "#4F46E5",
    icon: FaFacebook,
  },
  {
    source: "TikTok",
    pattern: /tiktok\.com/i,
    color: "#4F46E5",
    icon: FaTiktok,
  },
  {
    source: "Twitter/X",
    pattern: /twitter\.com|t\.co|x\.com/i,
    color: "#4F46E5",
    icon: FaTwitter,
  },
  {
    source: "LinkedIn",
    pattern: /linkedin\.com|lnkd\.in/i,
    color: "#4F46E5",
    icon: FaLinkedin,
  },
  {
    source: "Snapchat",
    pattern: /snapchat\.com/i,
    color: "#4F46E5",
    icon: FaSnapchat,
  },
  {
    source: "Pinterest",
    pattern: /pinterest\.com|pin\.it/i,
    color: "#4F46E5",
    icon: FaPinterest,
  },
  {
    source: "Reddit",
    pattern: /reddit\.com|redd\.it/i,
    color: "#4F46E5",
    icon: FaReddit,
  },
  {
    source: "Discord",
    pattern: /discord\.com|discordapp\.com/i,
    color: "#4F46E5",
    icon: FaDiscord,
  },
  {
    source: "YouTube",
    pattern: /youtube\.com|youtu\.be/i,
    color: "#4F46E5",
    icon: FaYoutube,
  },
  {
    source: "WeChat",
    pattern: /wechat\.com|weixin\.qq\.com/i,
    color: "#4F46E5",
    icon: IoLogoWechat,
  },
  { source: "Viber", pattern: /viber\.com/i, color: "#4F46E5", icon: FaViber },
  { source: "Line", pattern: /line\.me/i, color: "#4F46E5", icon: FaLine },
  {
    source: "Signal",
    pattern: /signal\.org/i,
    color: "#4F46E5",
    icon: FaSignalMessenger,
  },
  {
    source: "Twitch",
    pattern: /twitch\.tv/i,
    color: "#4F46E5",
    icon: FaTwitch,
  },
  {
    source: "MS Teams",
    pattern: /teams\.microsoft\.com|teams\.live\.com/i,
    color: "#4F46E5",
    icon: BiLogoMicrosoftTeams,
  },
  {
    source: "Outlook",
    pattern: /outlook\.live\.com|outlook\.office\.com/i,
    color: "#4F46E5",
    icon: PiMicrosoftOutlookLogoDuotone,
  },
  { source: "Zoom", pattern: /zoom\.us/i, color: "#4F46E5", icon: SiZoom },
  {
    source: "Google Meet",
    pattern: /meet\.google\.com/i,
    color: "#4F46E5",
    icon: SiGooglemeet,
  },
  {
    source: "Gmail",
    pattern: /mail\.google\.com/i,
    color: "#4F46E5",
    icon: SiGmail,
  },
  {
    source: "Yahoo Mail",
    pattern: /mail\.yahoo\.com/i,
    color: "#4F46E5",
    icon: FaYahoo,
  },
  { source: "Slack", pattern: /slack\.com/i, color: "#4F46E5", icon: FaSlack },
  {
    source: "Notion",
    pattern: /notion\.so/i,
    color: "#4F46E5",
    icon: SiNotion,
  },
  {
    source: "Trello",
    pattern: /trello\.com/i,
    color: "#4F46E5",
    icon: FaTrello,
  },
  {
    source: "Jira",
    pattern: /atlassian\.net.*jira/i,
    color: "#4F46E5",
    icon: FaMountainSun,
  },
  { source: "Asana", pattern: /asana\.com/i, color: "#4F46E5", icon: SiAsana },
  {
    source: "Confluence",
    pattern: /atlassian\.net.*wiki/i,
    color: "#4F46E5",
    icon: FaConfluence,
  },
  {
    source: "Google",
    pattern: /google\.\w+\/search|google\.\w+\/url/i,
    color: "#4F46E5",
    icon: Globe,
  },
  { source: "Bing", pattern: /bing\.com/i, color: "#4F46E5", icon: Globe },
];

const BROWSER_RULES = [
  { source: "Opera", pattern: /Opera|OPR\//i, color: "#4F46E5", icon: FaOpera },
  { source: "Edge", pattern: /Edg\//i, color: "#4F46E5", icon: FaEdge },
  { source: "Brave", pattern: /Brave/i, color: "#4F46E5", icon: SiBrave },
  {
    source: "Tor",
    pattern: /TorBrowser/i,
    color: "#4F46E5",
    icon: SiTorbrowser,
  },
  {
    source: "Chrome",
    pattern: /Chrome|CriOS/i,
    color: "#4F46E5",
    icon: FaChrome,
  },
  {
    source: "Firefox",
    pattern: /Firefox|FxiOS/i,
    color: "#4F46E5",
    icon: FaFirefox,
  },
  { source: "Safari", pattern: /Safari/i, color: "#4F46E5", icon: FaSafari },
  {
    source: "Internet Explorer",
    pattern: /Trident|MSIE/i,
    color: "#4F46E5",
    icon: FaInternetExplorer,
  },
];

function detectSource(log) {
  const ref = log.referer || "";
  if (ref) {
    for (const rule of REFERER_RULES) {
      if (rule.pattern.test(ref)) return rule.source;
    }
  }
  const ua = log.userAgent || "";
  for (const rule of BROWSER_RULES) {
    if (rule.pattern.test(ua)) return rule.source;
  }
  return "Direct";
}

const ALL_RULES = [...REFERER_RULES, ...BROWSER_RULES];
const platformIconMap = Object.fromEntries(
  ALL_RULES.map((r) => [r.source, r.icon]),
);

function StatCard({ icon, label, value, sub, className = "" }) {
  return (
    <div
      className={`bg-white border border-slate-100 rounded-2xl p-5 shadow-sm ${className}`}
    >
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
    <div
      className={`bg-white border border-slate-100 rounded-2xl shadow-sm ${className}`}
    >
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

    import("qrcode")
      .then((QRCode) => {
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
          },
        );
      })
      .catch(() => {
        if (!cancelled) setQrError("Could not load QR library.");
      });

    return () => {
      cancelled = true;
    };
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

  // Helper function to format date as YYYY-MM-DD
  const formatDateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Calculate date range: today to 7 days ago
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const defaultEndDate = formatDateToString(tomorrow);
  const defaultStartDate = formatDateToString(sevenDaysAgo);

  const [rawUrls, setRawUrls] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(null);
  const [qrLink, setQrLink] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [pendingStartDate, setPendingStartDate] = useState(defaultStartDate);
  const [pendingEndDate, setPendingEndDate] = useState(defaultEndDate);
  const [pendingCountry, setPendingCountry] = useState(selectedCountry);
  const [pendingDevice, setPendingDevice] = useState(selectedDevice);
  const [pendingSource, setPendingSource] = useState(selectedSource);

  useEffect(() => {
    if (filterOpen) {
      setPendingStartDate(startDate);
      setPendingEndDate(endDate);
      setPendingCountry(selectedCountry);
      setPendingDevice(selectedDevice);
      setPendingSource(selectedSource);
    }
  }, [
    filterOpen,
    startDate,
    endDate,
    selectedCountry,
    selectedDevice,
    selectedSource,
  ]);

  // Real calendar state — initialized to current month/year
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth()); // 0-indexed

  const handleDateClick = (dateStr) => {
    if (!pendingStartDate || (pendingStartDate && pendingEndDate)) {
      setPendingStartDate(dateStr);
      setPendingEndDate("");
    } else if (dateStr < pendingStartDate) {
      setPendingEndDate(pendingStartDate);
      setPendingStartDate(dateStr);
    } else {
      setPendingEndDate(dateStr);
    }
  };

  function prevMonth() {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  }

  // Number of days in the current calendar month
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  // Day-of-week the 1st falls on (0 = Sun)
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetchUrls();

    // Poll for real-time updates every 3 seconds
    const interval = setInterval(() => {
      fetchUrls(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [token]);

  async function fetchUrls(background = false) {
    if (!background) setLoading(true);
    if (!background) setError("");
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
        if (!background) setError(data.message || "Failed to fetch URLs.");
      }
    } catch (err) {
      if (!background)
        setError("Network error. Could not retrieve link statistics.");
    } finally {
      if (!background) setLoading(false);
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
            l.id === id ? { ...l, active: data.url.active } : l,
          ),
        );
        setRawUrls((prev) =>
          prev.map((u) =>
            u._id === id ? { ...u, active: data.url.active } : u,
          ),
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
        <p className="text-slate-500 font-semibold text-sm">
          Loading user analytics...
        </p>
      </div>
    );
  }

  // ── Aggregated Stats Calculations (filtered) ──
  // Build filtered logs across all links according to selected filters
  const allFilteredLogs = [];
  const perLinkCounts = {};
  links.forEach((l) => {
    (l.clickLogs || []).forEach((log) => {
      const clickedAt = log.clickedAt
        ? new Date(log.clickedAt).toISOString().slice(0, 10)
        : null;
      if (startDate && clickedAt && clickedAt < startDate) return;
      if (endDate && clickedAt && clickedAt > endDate) return;
      if (log.classification && log.classification !== "Human Browser") return;
      const ua = (log.userAgent || "").toLowerCase();
      const detectDevice = () => {
        if (/mobile|android|iphone|phone/i.test(ua)) return "Mobile";
        if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet";
        return "Desktop";
      };
      if (selectedDevice && detectDevice() !== selectedDevice) return;
      if (selectedCountry && (log.country || "") !== selectedCountry) return;
      // platform/source
      const matchedSource = detectSource(log);
      if (selectedSource && matchedSource !== selectedSource) return;

      allFilteredLogs.push({ ...log, linkId: l.id, short: l.short });
      perLinkCounts[l.id] = (perLinkCounts[l.id] || 0) + 1;
    });
  });

  const totalUrls = links.length;
  const totalClicks = allFilteredLogs.length;
  const activeLinks = links.filter((l) => l.active).length;
  const inactiveLinks = totalUrls - activeLinks;

  const parseDate = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const chartStart = parseDate(startDate);
  const chartEnd = parseDate(endDate);
  const clickHistory = [];
  const daysMap = {};

  const rangeStart =
    chartStart || new Date(new Date().setDate(new Date().getDate() - 6));
  const rangeEnd = chartEnd || chartStart || new Date();

  const iterator = new Date(rangeStart);
  while (iterator <= rangeEnd) {
    const dateStr = iterator.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    daysMap[dateStr] = 0;
    iterator.setDate(iterator.getDate() + 1);
  }

  allFilteredLogs.forEach((log) => {
    const clickedAt = log.clickedAt ? new Date(log.clickedAt) : null;
    if (!clickedAt) return;
    if (chartStart && clickedAt < chartStart) return;
    if (chartEnd && clickedAt > chartEnd) return;
    const dateStr = clickedAt.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    if (daysMap[dateStr] !== undefined) daysMap[dateStr]++;
  });

  Object.keys(daysMap).forEach((date) =>
    clickHistory.push({ date, clicks: daysMap[date] }),
  );

  // Devices Breakdown
  let mobile = 0,
    desktop = 0,
    tablet = 0;
  allFilteredLogs.forEach((log) => {
    const ua = (log.userAgent || "").toLowerCase();
    if (/mobile|android|iphone|phone/i.test(ua)) mobile++;
    else if (/tablet|ipad|playbook|silk/i.test(ua)) tablet++;
    else desktop++;
  });
  const divider = allFilteredLogs.length || 1;
  const deviceData = [
    { name: "Desktop", value: Math.round((desktop / divider) * 100) },
    { name: "Mobile", value: Math.round((mobile / divider) * 100) },
    { name: "Tablet", value: Math.round((tablet / divider) * 100) },
  ].filter((d) => d.value > 0);
  const finalDeviceData = deviceData;

  // Referrer/source counts using detectSource
  const sourceCounts = {};
  allFilteredLogs.forEach((log) => {
    const src = detectSource(log);
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });

  const referrerData = Object.entries(sourceCounts)
    .map(([source, visits]) => ({
      source,
      visits,
      color: "#4F46E5",
    }))
    .sort((a, b) => b.visits - a.visits);

  const geoDataMap = {};
  allFilteredLogs.forEach((log) => {
    const countryName = log.country || "Unknown";
    const countryCode = log.countryCode || "unknown";
    if (!geoDataMap[countryName]) {
      geoDataMap[countryName] = {
        country: countryName,
        countryCode,
        clicks: 0,
      };
    }
    geoDataMap[countryName].clicks += 1;
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

  const finalGeoData = geoData;

  console.log(finalGeoData);

  const topLinks = [...links].sort((a, b) => b.clicks - a.clicks).slice(0, 5);

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

      <div className="flex min-h-screen">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          linksCount={links.length}
          FREE_LIMIT={FREE_LIMIT}
        />

        {/* ── Main Content Area ── */}
        <main className="flex-1 min-w-0 md:ml-64 px-4 sm:px-6 md:px-8 py-6 md:py-8 space-y-6">
          {/* Top Header */}
          <main className="flex items-center justify-between">
            <div>
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
            </div>
            <div>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`px-3 py-2 border rounded-xl shadow-sm cursor-pointer flex items-center gap-2 transition-colors ${filterOpen ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                <Funnel size={18} />
                <span className="text-sm font-medium hidden sm:inline">
                  Filters
                </span>
              </button>
            </div>
          </main>

          {/* Filters Card */}
          {filterOpen && (
            <Filter
              startDate={pendingStartDate}
              endDate={pendingEndDate}
              setStartDate={setPendingStartDate}
              setEndDate={setPendingEndDate}
              calendarYear={calendarYear}
              calendarMonth={calendarMonth}
              prevMonth={prevMonth}
              nextMonth={nextMonth}
              firstDayOfWeek={firstDayOfWeek}
              daysInMonth={daysInMonth}
              handleDateClick={handleDateClick}
              finalGeoData={finalGeoData}
              finalDeviceData={finalDeviceData}
              referrerData={referrerData}
              selectedCountry={pendingCountry}
              setSelectedCountry={setPendingCountry}
              selectedDevice={pendingDevice}
              setSelectedDevice={setPendingDevice}
              selectedSource={pendingSource}
              setSelectedSource={setPendingSource}
              onClear={() => {
                setPendingStartDate("");
                setPendingEndDate("");
                setPendingCountry("");
                setPendingDevice("");
                setPendingSource("");
                setStartDate("");
                setEndDate("");
                setSelectedCountry("");
                setSelectedDevice("");
                setSelectedSource("");
              }}
              onApply={() => {
                setStartDate(pendingStartDate);
                setEndDate(pendingEndDate);
                setSelectedCountry(pendingCountry);
                setSelectedDevice(pendingDevice);
                setSelectedSource(pendingSource);
                setFilterOpen(false);
              }}
              setFilterOpen={setFilterOpen}
            />
          )}

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
              <AlertCircle size={17} className="text-red-500 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-red-800">Error</div>
                <div className="text-xs text-red-700 mt-0.5 break-words">
                  {error}
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <h2 className="text-base font-bold text-slate-900">
                  Aggregate Traffic Trend
                </h2>
                <p className="text-xs text-slate-400">
                  Total clicks recorded across all links in the last 7 days
                </p>
              </div>
              <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full w-max">
                Last 7 Days
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart
                data={clickHistory}
                margin={{ top: 4, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="globalClickGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                />
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
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Referrer Breakdown */}
            <Card className="p-6">
              <h2 className="text-base font-bold text-slate-900 mb-1">
                Referrer Breakdown
              </h2>
              <p className="text-xs text-slate-400 mb-5">
                Hits per platform — WhatsApp, TikTok, Direct and more
              </p>
              {referrerData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={referrerData}
                    margin={{ top: 4, right: 4, left: -20, bottom: 24 }}
                    barCategoryGap="30%"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#F1F5F9"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="source"
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                      tick={({ x, y, payload }) => {
                        const Icon = platformIconMap[payload.value] || Globe;
                        return (
                          <g transform={`translate(${x},${y})`}>
                            <Icon x={-8} y={8} size={16} color="#94A3B8" />
                          </g>
                        );
                      }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      formatter={(v, name, props) => [
                        v.toLocaleString() + " hits",
                        props.payload.source,
                      ]}
                      contentStyle={{
                        borderRadius: 10,
                        border: "1px solid #E2E8F0",
                        fontSize: 12,
                      }}
                      cursor={{ fill: "#F1F5F9" }}
                    />
                    <Bar dataKey="visits" radius={[6, 6, 0, 0]} maxBarSize={40}>
                      {referrerData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-center">
                  <Globe size={28} className="text-slate-200 mb-2" />
                  <p className="text-sm text-slate-400 font-medium">
                    No referrer data yet
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    Data will appear once your links get clicks
                  </p>
                </div>
              )}
            </Card>

            {/* Device Breakdown */}
            <Card className="p-6">
              <h2 className="text-base font-bold text-slate-900 mb-1">
                Device Breakdown
              </h2>
              <p className="text-xs text-slate-400 mb-5">
                Distribution of user device types across all clicks
              </p>
              {finalDeviceData.length > 0 ? (
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
                        contentStyle={{
                          borderRadius: 10,
                          border: "1px solid #E2E8F0",
                          fontSize: 12,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 flex-1">
                    {finalDeviceData.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-sm shrink-0"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                        <span className="text-xs text-slate-600 truncate">
                          {d.name}
                        </span>
                        <span className="text-xs font-bold text-slate-800 ml-auto pl-2">
                          {d.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[180px] text-center">
                  <Smartphone size={28} className="text-slate-200 mb-2" />
                  <p className="text-sm text-slate-400 font-medium">
                    No device data yet
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    Device stats will show once your links get clicks
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Geographic Breakdown & Top Links Row */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Country Share */}
            <Card className="p-6 lg:col-span-1">
              <h2 className="text-base font-bold text-slate-900 mb-1">
                Geographic Share
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Estimated visitor origins based on click patterns
              </p>
              {finalGeoData.length > 0 ? (
                <div className="space-y-3.5">
                  {finalGeoData.map((geo, i) => {
                    const max = finalGeoData[0]?.clicks || 1;
                    const pct = Math.round((geo.clicks / max) * 100);
                    return (
                      <div
                        key={geo.country}
                        className="flex items-center gap-3"
                      >
                        <span className="text-xl w-6 text-center shrink-0">
                          {geo.flag}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-700 font-semibold truncate">
                              {geo.country}
                            </span>

                            <span className="text-xs font-bold text-slate-800 ml-2">
                              {geo.clicks.toLocaleString()}
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${pct}%`,
                                background:
                                  i === 0
                                    ? "#4F46E5"
                                    : i === 1
                                      ? "#6366F1"
                                      : i === 2
                                        ? "#818CF8"
                                        : "#A5B4FC",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Globe size={28} className="text-slate-200 mb-2" />
                  <p className="text-sm text-slate-400 font-medium">
                    No geographic data yet
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    Country stats appear after clicks
                  </p>
                </div>
              )}
            </Card>

            {/* Top Performing Links */}
            <Card className="p-6 lg:col-span-2 overflow-hidden min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-bold text-slate-900">
                  Top Performing Links
                </h2>
                <div className="text-xs font-medium text-slate-400">
                  Sorted by clicks
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Your most popular shortened URLs and their settings
              </p>

              <div className="overflow-x-auto">
                <table
                  className="w-full text-left border-collapse"
                  style={{ minWidth: "600px" }}
                >
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
                        <td
                          colSpan={4}
                          className="text-center py-8 text-slate-400 text-sm"
                        >
                          No links created yet.
                        </td>
                      </tr>
                    ) : (
                      topLinks.map((link) => (
                        <tr
                          key={link.id}
                          className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors text-sm"
                        >
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
                                <ToggleRight
                                  size={20}
                                  className="text-indigo-500"
                                />
                              ) : (
                                <ToggleLeft
                                  size={20}
                                  className="text-slate-300"
                                />
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
