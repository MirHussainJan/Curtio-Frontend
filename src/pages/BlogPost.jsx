import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Clock, Calendar, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import { sanityClient } from '../lib/sanity'
import { PortableText } from '@portabletext/react'

const CATEGORY_COLORS_MAP = {
  Marketing: 'bg-indigo-50 text-indigo-600',
  Analytics: 'bg-orange-50 text-orange-600',
  'Tips & Tricks': 'bg-violet-50 text-violet-600',
  Product: 'bg-green-50 text-green-600',
}

const portableTextComponents = {
  block: {
    h2: ({children}) => <h2 className="text-2xl font-extrabold text-slate-900 mt-10 mb-4">{children}</h2>,
    h3: ({children}) => <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">{children}</h3>,
    normal: ({children}) => <p className="text-slate-600 leading-relaxed my-3">{children}</p>,
  },
  list: {
    bullet: ({children}) => <ul className="my-4 pl-5 space-y-2 list-disc">{children}</ul>,
    number: ({children}) => <ol className="my-4 pl-5 space-y-2 list-decimal">{children}</ol>,
  },
  listItem: {
    bullet: ({children}) => <li className="text-slate-600 leading-relaxed">{children}</li>,
    number: ({children}) => <li className="text-slate-600 leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({children}) => <strong className="font-semibold text-slate-800">{children}</strong>,
    em: ({children}) => <em>{children}</em>,
    code: ({children}) => <code className="bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
  },
}

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [others, setOthers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    sanityClient.fetch(
      `{
        "post": *[_type == "post" && slug.current == $slug][0],
        "others": *[_type == "post" && slug.current != $slug] | order(date desc)[0...2]
      }`,
      { slug }
    )
    .then(({ post, others }) => {
      setPost(post)
      setOthers(others)
      setIsLoading(false)
    })
    .catch(console.error)
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 text-center text-slate-400">Loading post...</div>
      </div>
    )
  }

  if (!post) return <Navigate to="/blog" />

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Cover */}
      <div className={`pt-16 bg-gradient-to-br ${post.coverColor} h-64 flex items-end`}>
        <div className="max-w-3xl mx-auto w-full px-6 pb-8">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-white/90 ${CATEGORY_COLORS_MAP[post.category] || 'text-slate-700'}`}>
            {post.category}
          </span>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 pb-20">
        {/* Back */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors mt-8 mb-6"
        >
          <ArrowLeft size={15} /> Back to Blog
        </Link>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 pb-8 border-b border-slate-100 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold">
            {post.author?.avatar}
          </div>
          <div>
            <div className="font-semibold text-slate-800 text-sm">{post.author?.name}</div>
            <div className="text-xs text-slate-400">{post.author?.role}</div>
          </div>
          <div className="ml-auto text-xs text-slate-400 flex items-center gap-3">
            <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
          </div>
        </div>

        {/* Body */}
        <div className="prose-like">
          {Array.isArray(post.content) ? (
            <PortableText value={post.content} components={portableTextComponents} />
          ) : (
            <div className="whitespace-pre-wrap text-slate-600">{post.content}</div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-14 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl px-8 py-10 text-center">
          <h3 className="text-xl font-extrabold text-white mb-2">Ready to try Brevly?</h3>
          <p className="text-indigo-200 text-sm mb-6">Free forever. One tracked link. Full analytics.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
          >
            Get Started Free <ArrowRight size={15} />
          </Link>
        </div>
      </article>

      {/* More posts */}
      {others.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50 py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-extrabold text-slate-900 mb-6">More from the blog</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {others.map(p => (
                <Link
                  key={p._id}
                  to={`/blog/${p.slug.current}`}
                  className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className={`h-24 bg-gradient-to-br ${p.coverColor}`} />
                  <div className="p-5 flex-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS_MAP[p.category] || 'bg-slate-100 text-slate-600'}`}>
                      {p.category}
                    </span>
                    <h3 className="font-bold text-slate-900 mt-2 group-hover:text-indigo-600 transition-colors text-sm leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{p.readTime} · {p.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-slate-100 py-8 px-6 text-center text-slate-400 text-sm">
        © {new Date().getFullYear()} Brevly. Built with ♥ for the web.
      </footer>
    </div>
  )
}
