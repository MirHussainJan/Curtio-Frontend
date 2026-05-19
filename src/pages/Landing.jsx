import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Zap, BarChart2, Shield, Globe, Copy, Check,
  Link as LinkIcon, QrCode, Clock, Lock, Target, Users,
  RefreshCw, FileDown, Filter, Shuffle
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Shortener, { SHORTENER_DOMAIN, generateSlug } from '../components/Shortner'

const FEATURES = [
  { icon: <Zap size={20} className="text-indigo-500" />, title: 'Lightning Fast Shortening', desc: 'Turn any URL into a clean short link in under a second. No friction, no account needed for quick shares.' },
  { icon: <BarChart2 size={20} className="text-orange-500" />, title: 'Real-Time Analytics', desc: 'See every click: device, country, referrer, browser, OS — all updated live.' },
  { icon: <QrCode size={20} className="text-indigo-500" />, title: 'QR Code Generation', desc: 'Every link gets a downloadable QR code — PNG or SVG, ready for print or digital.' },
  { icon: <Globe size={20} className="text-orange-500" />, title: 'Custom Aliases', desc: 'Brand your links with human-readable slugs like brev.ly/your-campaign.' },
  { icon: <Clock size={20} className="text-indigo-500" />, title: 'Link Expiration', desc: 'Set an expiry date on any link. After it expires, visitors see a clean "expired" message.' },
  { icon: <Lock size={20} className="text-orange-500" />, title: 'Password Protection', desc: 'Add a password to any link. Only people with the password get redirected.' },
  { icon: <Target size={20} className="text-indigo-500" />, title: 'Retargeting Pixels', desc: 'Embed your Facebook, Google, or LinkedIn pixel into any link — retarget every visitor automatically.' },
  { icon: <Shuffle size={20} className="text-orange-500" />, title: 'Geo & Device Routing', desc: 'Send iOS users to the App Store, Android users to Play Store, and desktop users to your site — automatically.' },
]

const STATS = [
  { value: '2.4B+', label: 'Links shortened' },
  { value: '180+', label: 'Countries served' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '<50ms', label: 'Redirect speed' },
]

const FREE_FEATURES = [
  'Shorten any URL instantly',
  'Up to 5 links/day (no account)',
  'Share links anywhere',
  'QR code for every link',
]

const REGISTERED_FEATURES = [
  'Everything in Guest, plus:',
  '1 fully tracked link',
  'Real-time click analytics',
  'Device, country & referrer data',
  'Custom alias for your link',
  'Link expiration control',
  'Password protection',
  'Dashboard to manage your link',
]

export default function Landing() {
  const [url, setUrl] = useState('')
  const [shortened, setShortened] = useState(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function isValidUrl(str) {
    try { new URL(str); return true } catch { return false }
  }

  async function handleShorten(e) {
    e.preventDefault()
    setError('')
    if (!url.trim()) { setError('Please enter a URL.'); return }
    if (!isValidUrl(url)) { setError('Please enter a valid URL (include https://).'); return }
    setLoading(true)

    const token = localStorage.getItem('apiToken')


      // http://localhost:6090 -> BackURl for local testing

    if (token) {
      try {
        const res = await fetch('https://bravely-backend.vercel.app/api/urls', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            originalUrl: url
          })
        })
        const data = await res.json()
        if (data.success) {
          const shortenedUrl = `${SHORTENER_DOMAIN}/${data.url.shortCode}`
          setShortened(shortenedUrl)
        } else {
          if (data.message && data.message.includes('limit')) {
            setError("You have reached the free limit of 1 tracked link. Please delete your existing link from the Dashboard to create a new one, or log out to create a temporary guest link.")
          } else {
            setError(data.message || 'Could not shorten link.')
          }
        }
      } catch (err) {
        setError('Network error. Could not connect to server.')
      } finally {
        setLoading(false)
      }
    } else {
      setTimeout(() => {
        const slug = generateSlug()
        const shortenedUrl = `${SHORTENER_DOMAIN}/${slug}`
        console.log("Generated Short URL:", shortenedUrl)
        setShortened(shortenedUrl)
        setLoading(false)
      }, 700)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(shortened)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-100 rounded-full opacity-40 blur-3xl" />
          <div className="absolute -top-20 -right-40 w-[500px] h-[500px] bg-orange-100 rounded-full opacity-40 blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-indigo-100">
            <Zap size={14} fill="currentColor" /> Free forever · No credit card needed
          </span>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
            Shorten. Share.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-orange-500">
              Track.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 mb-4 max-w-xl mx-auto leading-relaxed">
            Brevly turns long URLs into clean, trackable links — with real-time analytics, QR codes, and link controls built right in.
          </p>

          {/* Free tier callout */}
          <div className="inline-flex items-center gap-2 text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
            Shorten instantly — no account needed.
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Sign up free</Link>
            to unlock analytics.
          </div>

          {/* Shortener */}
          <form onSubmit={handleShorten} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 bg-white border border-slate-200 rounded-2xl p-2 shadow-lg shadow-slate-100">
              <div className="flex items-center gap-3 flex-1 px-3">
                <LinkIcon size={18} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={url}
                  onChange={e => { setUrl(e.target.value); setShortened(null); setError('') }}
                  placeholder="Paste your long URL here..."
                  className="flex-1 text-slate-800 placeholder-slate-400 bg-transparent outline-none text-sm py-2"
                />
              </div>

              <Shortener loading={loading} />
            </div>
            {error && <p className="text-red-500 text-sm mt-2 text-left px-2">{error}</p>}
          </form>

          {shortened && (
            <div className="max-w-2xl mx-auto mt-4 bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                  <Zap size={14} className="text-white" fill="white" />
                </div>
                <span className="text-indigo-700 font-semibold text-sm truncate">{shortened}</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-sm font-medium bg-white border border-indigo-200 hover:border-indigo-400 text-indigo-600 px-4 py-2 rounded-lg transition-all shrink-0"
              >
                {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>
          )}

          {shortened && (
            <p className="text-xs text-slate-500 mt-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 inline-block">
              {localStorage.getItem('apiToken') ? (
                <span>
                  🎉 This link has been successfully saved to your account! Visit your{' '}
                  <Link to="/dashboard" className="text-indigo-600 font-semibold hover:underline">Dashboard</Link>
                  {' '}to track clicks, customize UTMs, set passwords, and view detailed visitor logs.
                </span>
              ) : (
                <span>
                  This link is active but <strong>not tracked</strong> — it's a guest link.{' '}
                  <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Create a free account</Link>
                  {' '}to get full click analytics on your link.
                </span>
              )}
            </p>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-100 bg-slate-50 py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Free vs Registered */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Always free. Seriously.
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              No credit card. No trial. No catch. Use Brevly as a guest or sign up to unlock analytics.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {/* Guest */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Guest</span>
                <span className="text-xs bg-slate-200 text-slate-600 font-semibold px-2 py-0.5 rounded-full">No account</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mb-1">Free</div>
              <p className="text-slate-500 text-sm mb-6">Paste and go. No signup, no waiting.</p>
              <ul className="space-y-3 mb-8">
                {FREE_FEATURES.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check size={16} className="text-slate-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
                <li className="flex items-start gap-2.5 text-sm text-slate-400">
                  <span className="w-4 h-4 mt-0.5 shrink-0 text-center">✗</span>
                  Analytics &amp; click tracking
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-400">
                  <span className="w-4 h-4 mt-0.5 shrink-0 text-center">✗</span>
                  Link management dashboard
                </li>
              </ul>
              <Link to="/" className="block text-center text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100 py-2.5 rounded-xl transition-colors">
                Use as Guest
              </Link>
            </div>

            {/* Free Account */}
            <div className="bg-white border-2 border-indigo-500 rounded-2xl p-7 relative shadow-lg shadow-indigo-100">
              <div className="absolute -top-3 left-6">
                <span className="bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Recommended
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">Free Account</span>
                <span className="text-xs bg-indigo-50 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">1 tracked link</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mb-1">Free</div>
              <p className="text-slate-500 text-sm mb-6">Sign up in 30 seconds. No card needed.</p>
              <ul className="space-y-3 mb-8">
                {REGISTERED_FEATURES.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check size={16} className={`mt-0.5 shrink-0 ${f.startsWith('Everything') ? 'text-slate-400' : 'text-indigo-500'}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="block text-center text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl transition-colors">
                Create Free Account
              </Link>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-5">
            One tracked link is all most people need. Use it for your most important destination — portfolio, landing page, calendar link.
          </p>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Everything you need to{' '}
              <span className="text-indigo-600">go further</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Brevly isn't just a URL shortener — it's a full link management platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">{f.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            How it works
          </h2>
          <p className="text-slate-500 text-lg mb-12">Three steps from long URL to full insight.</p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Paste your URL', desc: 'Drop any long URL into the Brevly shortener — no account needed for a basic short link.' },
              { step: '02', title: 'Get your short link', desc: 'Instantly receive a clean brev.ly/… link. Sign up to claim a custom alias and track it.' },
              { step: '03', title: 'Track every click', desc: 'Watch real-time analytics roll in: who clicked, from where, on what device, from which channel.' },
            ].map(item => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg mb-4 shadow-md shadow-indigo-200">
                  {item.step}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl px-8 py-14 text-center shadow-xl shadow-indigo-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to level up your links?
          </h2>
          <p className="text-indigo-200 text-lg mb-8 max-w-md mx-auto">
            Create your free account in 30 seconds. Get one tracked link with full analytics, forever free.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold text-sm px-7 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors shadow-sm"
          >
            Get Started — It's Free <ArrowRight size={16} />
          </Link>
          <p className="text-indigo-300 text-xs mt-4">No credit card · No trial · Cancel anytime</p>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap size={13} className="text-white" fill="white" />
            </div>
            <span className="font-extrabold text-slate-900">Brevly</span>
          </Link>
          <div className="flex items-center gap-5 text-sm text-slate-400">
            <Link to="/blog" className="hover:text-slate-700 transition-colors">Blog</Link>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Brevly</p>
        </div>
      </footer>
    </div>
  )
}
