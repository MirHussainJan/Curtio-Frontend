import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
dotenv.config()

const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET,
  useCdn: false,
  apiVersion: process.env.VITE_SANITY_API_VERSION,
  token: process.env.VITE_SANITY_WRITE_TOKEN,
})



