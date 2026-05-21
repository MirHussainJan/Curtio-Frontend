import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  useCdn: true,
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION,
})

export const urlForImage = (source) => {
  if (!source || !source.asset || !source.asset._ref) return ''
  const ref = source.asset._ref
  // Format: image-7d2d3a3f-1200x800-jpg
  const parts = ref.split('-')
  if (parts.length < 4) return ''
  const id = parts[1]
  const dimensions = parts[2]
  const extension = parts[3]
  return `${import.meta.env.VITE_SANITY_CDN_BASE_URL}/${import.meta.env.VITE_SANITY_PROJECT_ID}/${import.meta.env.VITE_SANITY_DATASET}/${id}-${dimensions}.${extension}`
}
