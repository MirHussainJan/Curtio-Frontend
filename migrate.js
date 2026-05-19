import { createClient } from '@sanity/client'

const sanityClient = createClient({
  projectId: 'fk4ygrwd',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-14',
  token: 'skZl54nZl1b8XJ...', // Wait, I don't have the write token.
})
