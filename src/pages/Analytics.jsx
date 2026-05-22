import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts'
import { ArrowLeft, Copy, Check, ExternalLink, MousePointerClick, TrendingUp, Globe, Smartphone, Zap } from 'lucide-react'
import { SHORTENER_DOMAIN } from '../components/Shortner'

const COLORS = ['#4F46E5', '#F97316', '#22C55E', '#EAB308', '#EC4899']

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border border-slate-100 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  )
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
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-lg">
        <div className="font-semibold mb-0.5">{label}</div>
        <div>{payload[0].value.toLocaleString()} clicks</div>
      </div>
    )
  }
  return null
}

export default function Analytics() {
  const { id } = useParams()
  const token = localStorage.getItem('apiToken')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [link, setLink] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
          const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/urls`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await res.json()
        if (data.success) {
          const match = data.urls.find(u => u._id === id)
          if (match) {
            setLink({
              ...match,
              short: `${SHORTENER_DOMAIN}/${match.shortCode}`,
              original: match.originalUrl
            })
          } else {
            setError('Link not found or not owned by you.')
          }
        } else {
          setError(data.message || 'Failed to fetch analytics.')
        }
      } catch (err) {
        setError('Network error. Could not connect to server.')
      } finally {
        setLoading(false)
      }
    }
    if (token && id) {
      fetchAnalytics()
    } else {
      setLoading(false)
      setError('Authentication token is missing. Please log in.')
    }
  }, [token, id])

  function handleCopy() {
    if (link) {
      navigator.clipboard.writeText(link.short)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-4"></div>
        <p className="text-slate-500 font-semibold text-sm">Loading dynamic click logs...</p>
      </div>
    )
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 max-w-md w-full shadow-lg text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 font-extrabold text-2xl mx-auto mb-4">⚠️</div>
          <h1 className="text-xl font-extrabold text-slate-900 mb-2">Analytics Unavailable</h1>
          <p className="text-slate-500 text-sm mb-6">{error || 'Could not retrieve link logs.'}</p>
          <Link to="/dashboard" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // ── Compute dynamic Recharts data from live logs ──
  const clickHistory = []
  const daysMap = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    daysMap[dateStr] = 0
  }
  if (link.clickLogs) {
    link.clickLogs.forEach(log => {
      const dateStr = new Date(log.clickedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      if (daysMap[dateStr] !== undefined) {
        daysMap[dateStr] += 1
      }
    })
  }
  Object.keys(daysMap).forEach(date => {
    clickHistory.push({ date, clicks: daysMap[date] })
  })

  let mobile = 0, desktop = 0, tablet = 0
  if (link.clickLogs) {
    link.clickLogs.forEach(log => {
      const ua = log.userAgent.toLowerCase()
      if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
        mobile++
      } else if (/tablet|ipad|playbook|silk/i.test(ua)) {
        tablet++
      } else {
        desktop++
      }
    })
  }
  const totalLogs = link.clickLogs.length || 1
  const deviceData = [
    { name: 'Desktop', value: Math.round((desktop / totalLogs) * 100) },
    { name: 'Mobile', value: Math.round((mobile / totalLogs) * 100) },
    { name: 'Tablet', value: Math.round((tablet / totalLogs) * 100) },
  ].filter(d => d.value > 0)

  const finalDeviceData = deviceData.length > 0 ? deviceData : [{ name: 'Desktop', value: 100 }]

  let direct = 0, social = 0, organic = 0
  if (link.clickLogs) {
    link.clickLogs.forEach(log => {
      const ua = log.userAgent.toLowerCase()
      if (/twitter|t.co|x.com|facebook|fb|instagram|linkedin/i.test(ua)) {
        social++
      } else if (/google|yahoo|bing|duckduckgo/i.test(ua)) {
        organic++
      } else {
        direct++
      }
    })
  }
  const referrerData = []
  if (social > 0) referrerData.push({ source: 'Social Media', visits: social })
  if (organic > 0) referrerData.push({ source: 'Search Engines', visits: organic })
  referrerData.push({ source: 'Direct / Email', visits: direct || link.clicks })

  // Aggregate real country data from click logs
  const geoDataMap = {};
  if (link.clickLogs) {
    link.clickLogs.forEach(log => {
      const countryName = log.country || 'Unknown';
      const countryCode = log.countryCode || 'unknown';
      if (!geoDataMap[countryName]) {
        geoDataMap[countryName] = {
          country: countryName,
          countryCode: countryCode,
          clicks: 0
        };
      }
      geoDataMap[countryName].clicks += 1;
    });
  }

  const getFlagEmoji = (code) => {
    if (!code || code.toLowerCase() === 'unknown') return '🌐';
    try {
      const codePoints = code
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
      return String.fromCodePoint(...codePoints);
    } catch (e) {
      return '🌐';
    }
  };

  const geoData = Object.values(geoDataMap)
    .sort((a, b) => b.clicks - a.clicks)
    .map(g => ({
      country: g.country,
      flag: getFlagEmoji(g.countryCode),
      clicks: g.clicks
    }));

  const finalGeoData = geoData.length > 0 ? geoData : [{ country: 'Direct Visits', flag: '🌐', clicks: link.clicks || 0 }];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
            <ArrowLeft size={16} />
            Dashboard
          </Link>
          <div className="w-px h-5 bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap size={13} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-slate-900 text-sm">{link.short}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={handleCopy} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
              {copied ? <><Check size={13} className="text-green-500" /> Copied!</> : <><Copy size={13} /> Copy</>}
            </button>
            <a
              href={link.original}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <ExternalLink size={13} /> Open
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Link info */}
        <div className="bg-white border border-slate-100 rounded-2xl px-6 py-4 shadow-sm">
          <div className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wide">Destination</div>
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
            value={link.clicks.toLocaleString()}
          />
          <StatPill
            icon={<TrendingUp size={18} className="text-orange-500" />}
            label="This Week"
            value={link.clickLogs.length.toLocaleString()}
          />
          <StatPill
            icon={<Globe size={18} className="text-indigo-600" />}
            label="Country Share"
            value={finalGeoData.length}
          />
          <StatPill
            icon={<Smartphone size={18} className="text-orange-500" />}
            label="Mobile Breakdown"
            value={`${Math.round((mobile / totalLogs) * 100)}%`}
          />
        </div>

        {/* Click history chart */}
        <Card className="p-6">
          <h2 className="text-base font-bold text-slate-900 mb-5">Clicks Over Time</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={clickHistory} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="clicks"
                stroke="#4F46E5"
                strokeWidth={2.5}
                fill="url(#clickGrad)"
                dot={{ r: 4, fill: '#4F46E5', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Referrers + Devices row */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Referrers bar chart */}
          <Card className="p-6">
            <h2 className="text-base font-bold text-slate-900 mb-5">Top Referrers</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={referrerData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="source" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip
                  formatter={(v) => [v.toLocaleString(), 'visits']}
                  contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12 }}
                />
                <Bar dataKey="visits" fill="#4F46E5" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Device pie chart */}
          <Card className="p-6">
            <h2 className="text-base font-bold text-slate-900 mb-5">Device Breakdown</h2>
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
                    formatter={(v) => [`${v}%`, '']}
                    contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {finalDeviceData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-xs text-slate-600">{d.name}</span>
                    <span className="text-xs font-bold text-slate-800 ml-auto pl-4">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Top countries */}
        <Card className="p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">Top Countries</h2>
          <div className="space-y-3">
            {finalGeoData.map((geo, i) => {
              const max = finalGeoData[0].clicks || 1
              const pct = Math.round((geo.clicks / max) * 100)
              return (
                <div key={geo.country} className="flex items-center gap-4">
                  <span className="text-xl w-7 text-center">{geo.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-700 font-medium">{geo.country}</span>
                      <span className="text-sm font-bold text-slate-800">{geo.clicks.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: i === 0 ? '#4F46E5' : i === 1 ? '#6366F1' : '#818CF8'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </main>
    </div>
  )
}
