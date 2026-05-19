import { Link, useLocation } from 'react-router-dom'
import { Zap, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar({ dark = false }) {
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard'
  const [mobileOpen, setMobileOpen] = useState(false)

  const base = dark
    ? 'bg-slate-900/80 backdrop-blur-md border-slate-800'
    : 'bg-white/80 backdrop-blur-md border-slate-200'

  const linkCls = dark
    ? 'text-slate-300 hover:text-white'
    : 'text-slate-600 hover:text-slate-900'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b ${base}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition-colors">
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <span className={`text-xl font-bold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
            Brevly
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-5">
          {!isDashboard && (
            <>
              <Link to="/blog" className={`text-sm font-medium transition-colors ${linkCls}`}>Blog</Link>
              <Link to="/login" className={`text-sm font-medium transition-colors ${linkCls}`}>Sign In</Link>
              <Link to="/register" className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">
                Get Started Free
              </Link>
            </>
          )}
          {isDashboard && (
            <button className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
              Sign Out
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className={`sm:hidden p-1.5 rounded-lg ${dark ? 'text-slate-300' : 'text-slate-600'}`}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={`sm:hidden border-t px-6 py-4 flex flex-col gap-3 ${dark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
          <Link to="/blog" className={`text-sm font-medium ${linkCls}`} onClick={() => setMobileOpen(false)}>Blog</Link>
          <Link to="/login" className={`text-sm font-medium ${linkCls}`} onClick={() => setMobileOpen(false)}>Sign In</Link>
          <Link to="/register" className="text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-lg text-center" onClick={() => setMobileOpen(false)}>
            Get Started Free
          </Link>
        </div>
      )}
    </nav>
  )
}
