import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  MousePointerClick,
  TrendingUp,
  Globe,
  Smartphone,
  Zap,
} from "lucide-react";
import Filter from "../components/filter";
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
  FaFacebookMessenger,
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
import { SHORTENER_DOMAIN } from "../components/Shortner";
import ShareModal from "../components/LinkShareModal";

const COLORS = ["#4F46E5", "#F97316", "#22C55E", "#EAB308", "#EC4899"];

const REFERER_RULES = [
  { source: "WhatsApp", pattern: /whatsapp/i, color: "#4F46E5", icon: FaWhatsapp },
  { source: "Messenger", pattern: /messenger/i, color: "#4F46E5", icon: FaFacebookMessenger },
  { source: "Facebook", pattern: /facebook|fbav|fban|fb_iab/i, color: "#4F46E5", icon: FaFacebook },
  { source: "Instagram", pattern: /instagram/i, color: "#4F46E5", icon: FaInstagram },
  { source: "TikTok", pattern: /tiktok|bytedance/i, color: "#4F46E5", icon: FaTiktok },
  { source: "YouTube", pattern: /youtube|youtu\.be/i, color: "#4F46E5", icon: FaYoutube },
  { source: "LinkedIn", pattern: /linkedin/i, color: "#4F46E5", icon: FaLinkedin },
  { source: "Twitter", pattern: /twitter|t\.co/i, color: "#4F46E5", icon: FaTwitter },
  { source: "Reddit", pattern: /reddit/i, color: "#4F46E5", icon: FaReddit },
  { source: "Pinterest", pattern: /pinterest/i, color: "#4F46E5", icon: FaPinterest },
  { source: "Snapchat", pattern: /snapchat/i, color: "#4F46E5", icon: FaSnapchat },
  { source: "Discord", pattern: /discord/i, color: "#4F46E5", icon: FaDiscord },
  { source: "Telegram", pattern: /telegram|t\.me/i, color: "#4F46E5", icon: FaTelegramPlane },
  { source: "Teams", pattern: /teams\.microsoft|teams\.cdn\.office|onecdn\.static\.microsoft/i, color: "#4F46E5", icon: BiLogoMicrosoftTeams },
  { source: "Slack", pattern: /slack/i, color: "#4F46E5", icon: FaSlack },
  { source: "Gmail", pattern: /mail\.google/i, color: "#4F46E5", icon: SiGmail },
  { source: "Outlook", pattern: /outlook/i, color: "#4F46E5", icon: PiMicrosoftOutlookLogoDuotone },
  { source: "WeChat", pattern: /wechat|micromessenger/i, color: "#4F46E5", icon: IoLogoWechat },
  { source: "Line", pattern: /line/i, color: "#4F46E5", icon: FaLine },
  { source: "Viber", pattern: /viber/i, color: "#4F46E5", icon: FaViber },
  { source: "Asana", pattern: /asana/i, color: "#4F46E5", icon: SiAsana },
  { source: "Trello", pattern: /trello/i, color: "#4F46E5", icon: FaTrello },
  { source: "Confluence", pattern: /atlassian|confluence/i, color: "#4F46E5", icon: FaConfluence },
  { source: "Zoom", pattern: /zoom\.us/i, color: "#4F46E5", icon: SiZoom },
  { source: "Google Meet", pattern: /meet\.google/i, color: "#4F46E5", icon: SiGooglemeet },
  { source: "Notion", pattern: /notion\.so/i, color: "#4F46E5", icon: SiNotion },
  { source: "Twitch", pattern: /twitch/i, color: "#4F46E5", icon: FaTwitch },
  { source: "Yahoo", pattern: /yahoo/i, color: "#4F46E5", icon: FaYahoo },
  { source: "Signal", pattern: /signal/i, color: "#4F46E5", icon: FaSignal },
];

const BROWSER_RULES = [
  { source: "Hola Browser", pattern: /Hola/i, color: "#4F46E5", icon: Globe },
  { source: "Opera", pattern: /Opera|OPR\//i, color: "#4F46E5", icon: FaOpera },
  { source: "Edge", pattern: /Edg\//i, color: "#4F46E5", icon: FaEdge },
  { source: "Brave", pattern: /Brave/i, color: "#4F46E5", icon: SiBrave },
  { source: "Tor", pattern: /TorBrowser/i, color: "#4F46E5", icon: SiTorbrowser },
  { source: "Firefox", pattern: /Firefox|FxiOS/i, color: "#4F46E5", icon: FaFirefox },
  { source: "Internet Explorer", pattern: /Trident|MSIE/i, color: "#4F46E5", icon: FaInternetExplorer },
  { source: "Chrome", pattern: /Chrome|CriOS/i, color: "#4F46E5", icon: FaChrome },
  { source: "Safari", pattern: /Safari/i, color: "#4F46E5", icon: FaSafari },
];

function detectSource(log) {
  const ref = log.referer || "";
  const ua = log.userAgent || "";

  // 1. Try to identify a real platform from referer
  for (const rule of REFERER_RULES) {
    if (rule.pattern.test(ref)) return rule.source;
  }

  // 2. Some apps leave a signature in the User-Agent instead of a referer
  for (const rule of REFERER_RULES) {
    if (rule.pattern.test(ua)) return rule.source;
  }

  // 3. If backend already tagged a real platform (not a browser fallback), trust it
  const isBrowserLabel = BROWSER_RULES.some((r) => r.source === log.source);
  if (log.source && log.source !== "unknown" && log.source !== "Direct" && !isBrowserLabel) {
    return log.source;
  }

  // 4. Otherwise fall back to browser detection
  for (const rule of BROWSER_RULES) {
    if (rule.pattern.test(ua)) return rule.source;
  }

  return "Direct";
}

// Combined icon map for charts
const ALL_RULES = [...REFERER_RULES, ...BROWSER_RULES];
const platformIconMap = Object.fromEntries(
  ALL_RULES.map((r) => [r.source, r.icon]),
);

function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white border border-slate-100 rounded-2xl shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function StatPill({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-xs text-slate-500 font-medium">{label}</div>
        <div className="text-2xl font-extrabold text-slate-900">{value}</div>
      </div>
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

export default function Analytics() {
  const { id } = useParams();
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

  const [filterOpen, setFilterOpen] = useState(false);
  const [shareLink, setShareLink] = useState(null);
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

  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());

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

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();

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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [link, setLink] = useState(null);
  const [copied, setCopied] = useState(false);

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

  useEffect(() => {
    async function fetchAnalytics(background = false) {
      try {
        if (!background) setLoading(true);
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${baseUrl}/urls`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          const match = data.urls.find((u) => u._id === id);
          if (match) {
            setLink({
              ...match,
              short: `${SHORTENER_DOMAIN}/${match.shortCode}`,
              original: match.originalUrl,
            });
          } else {
            if (!background) setError("Link not found or not owned by you.");
          }
        } else {
          if (!background)
            setError(data.message || "Failed to fetch analytics.");
        }
      } catch (err) {
        if (!background)
          setError("Network error. Could not connect to server.");
      } finally {
        if (!background) setLoading(false);
      }
    }

    if (!token || !id) {
      setLoading(false);
      setError("Authentication token is missing. Please log in.");
      return;
    }

    fetchAnalytics();

    // Poll for real-time analytics updates every 3 seconds
    const interval = setInterval(() => {
      fetchAnalytics(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [token, id]);

  function handleCopy() {
    if (link) {
      navigator.clipboard.writeText(link.short);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-4"></div>
        <p className="text-slate-500 font-semibold text-sm">
          Loading dynamic click logs...
        </p>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 max-w-md w-full shadow-lg text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 font-extrabold text-2xl mx-auto mb-4">
            ⚠️
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mb-2">
            Analytics Unavailable
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            {error || "Could not retrieve link logs."}
          </p>
          <Link
            to="/dashboard"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const filteredLogs = (link.clickLogs || []).filter((log) => {
    const clickedAt = log.clickedAt
      ? new Date(log.clickedAt).toISOString().slice(0, 10)
      : null;
    if (startDate && clickedAt && clickedAt < startDate) return false;
    if (endDate && clickedAt && clickedAt > endDate) return false;
    const ua = (log.userAgent || "").toLowerCase();
    const detectDevice = () => {
      if (/mobile|android|iphone|phone/i.test(ua)) return "Mobile";
      if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet";
      return "Desktop";
    };
    if (selectedDevice && detectDevice() !== selectedDevice) return false;
    if (selectedCountry && (log.country || "") !== selectedCountry)
      return false;
    const matchedSource = detectSource(log);
    if (selectedSource && matchedSource !== selectedSource) return false;
    return true;
  });

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

  filteredLogs.forEach((log) => {
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

  let mobile = 0,
    desktop = 0,
    tablet = 0;
  filteredLogs.forEach((log) => {
    const ua = (log.userAgent || "").toLowerCase();
    if (/mobile|android|iphone|phone/i.test(ua)) mobile++;
    else if (/tablet|ipad|playbook|silk/i.test(ua)) tablet++;
    else desktop++;
  });
  const divider = filteredLogs.length || 1;
  const deviceData = [
    { name: "Desktop", value: Math.round((desktop / divider) * 100) },
    { name: "Mobile", value: Math.round((mobile / divider) * 100) },
    { name: "Tablet", value: Math.round((tablet / divider) * 100) },
  ].filter((d) => d.value > 0);
  const finalDeviceData = deviceData;

  const sourceCounts = {};
  filteredLogs.forEach((log) => {
    const src = detectSource(log);
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });

  const referrerData = Object.entries(sourceCounts)
    .map(([source, visits]) => ({
      source,
      visits,
      icon: platformIconMap[source] || Globe,
    }))
    .sort((a, b) => b.visits - a.visits);

  const geoDataMap = {};
  filteredLogs.forEach((log) => {
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

  const finalGeoData = Object.values(geoDataMap)
    .sort((a, b) => b.clicks - a.clicks)
    .map((g) => ({
      country: g.country,
      flag: getFlagEmoji(g.countryCode),
      clicks: g.clicks,
    }));

  return (
    <div className="min-h-screen bg-slate-50">
      {shareLink && <ShareModal link={shareLink} onClose={() => setShareLink(null)} />}
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Dashboard
          </Link>
          <div className="w-px h-5 bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap size={13} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-slate-900 text-sm">
              {link.short}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-green-500" /> Copied!
                </>
              ) : (
                <>
                  <Copy size={13} /> Copy
                </>
              )}
            </button>
            <button
              onClick={() => setShareLink(link)}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <FaWhatsapp size={13} /> Share
            </button>
            <a
              href={link.original}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <ExternalLink size={13} /> Open
            </a>
            <button
              onClick={() => setFilterOpen((s) => !s)}
              className={`px-3 py-1.5 border rounded-lg text-sm flex items-center gap-2 ${filterOpen ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M22 3H2l7 9v7l6-4v-3l7-9z"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="hidden sm:inline text-sm font-medium">
                Filters
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
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
        {/* Link info */}
        <div className="bg-white border border-slate-100 rounded-2xl px-6 py-4 shadow-sm">
          <div className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wide">
            Destination
          </div>
          <a
            href={link.original}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-700 text-sm hover:text-indigo-600 transition-colors break-all"
          >
            {link.original}
          </a>
        </div>

        {/* Stats pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatPill
            icon={<MousePointerClick size={18} className="text-indigo-600" />}
            label="Total Clicks"
            value={filteredLogs.length.toLocaleString()}
          />
          <StatPill
            icon={<TrendingUp size={18} className="text-orange-500" />}
            label="In Range"
            value={filteredLogs.length.toLocaleString()}
          />
          <StatPill
            icon={<Globe size={18} className="text-indigo-600" />}
            label="Country Share"
            value={finalGeoData.length}
          />
          <StatPill
            icon={<Smartphone size={18} className="text-orange-500" />}
            label="Mobile Breakdown"
            value={`${Math.round((mobile / divider) * 100)}%`}
          />
        </div>

        {/* Click history chart */}
        <Card className="p-6">
          <h2 className="text-base font-bold text-slate-900 mb-5">
            Clicks Over Time
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={clickHistory}
              margin={{ top: 4, right: 0, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
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
                fill="url(#clickGrad)"
                dot={{ r: 4, fill: "#4F46E5", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Referrers + Devices row */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Referrers bar chart */}
          <Card className="p-6">
            <h2 className="text-base font-bold text-slate-900 mb-5">
              Top Browsers
            </h2>
            <ResponsiveContainer width="100%" height={200}>
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
                  formatter={(v) => [v.toLocaleString(), "visits"]}
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #E2E8F0",
                    fontSize: 12,
                  }}
                  cursor={{ fill: "#F1F5F9" }}
                />
                <Bar
                  dataKey="visits"
                  fill="#4F46E5"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Device pie chart */}
          <Card className="p-6">
            <h2 className="text-base font-bold text-slate-900 mb-5">
              Device Breakdown
            </h2>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie
                    data={finalDeviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {finalDeviceData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
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
              <div className="space-y-2">
                {finalDeviceData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: COLORS[i] }}
                    />
                    <span className="text-xs text-slate-600">{d.name}</span>
                    <span className="text-xs font-bold text-slate-800 ml-auto pl-4">
                      {d.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Top countries */}
        <Card className="p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Top Countries
          </h2>
          <div className="space-y-3">
            {finalGeoData.map((geo, i) => {
              const max = finalGeoData[0].clicks || 1;
              const pct = Math.round((geo.clicks / max) * 100);
              return (
                <div key={geo.country} className="flex items-center gap-4">
                  <span className="text-xl w-7 text-center">{geo.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-700 font-medium">
                        {geo.country}
                      </span>
                      <span className="text-sm font-bold text-slate-800">
                        {geo.clicks.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background:
                            i === 0
                              ? "#4F46E5"
                              : i === 1
                                ? "#6366F1"
                                : "#818CF8",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </main>
    </div>
  );
}
