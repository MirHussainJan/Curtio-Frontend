import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'fk4ygrwd',
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2024-05-14', // use current date (YYYY-MM-DD) to target the latest API version
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
  return `https://cdn.sanity.io/images/fk4ygrwd/production/${id}-${dimensions}.${extension}`
}
