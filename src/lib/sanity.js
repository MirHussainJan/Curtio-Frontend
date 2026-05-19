import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'fk4ygrwd',
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2024-05-14', // use current date (YYYY-MM-DD) to target the latest API version
})
