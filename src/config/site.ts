import { SiteConfig } from "@/types"

// Determine the appropriate base URL depending on the environment.
// 1. If on the Vercel production environment, use the production URL.
// 2. If on a Vercel preview/branch deploy, use that branch URL.
// 3. Otherwise, assume we are running locally and fall back to http://localhost:3000.

const baseUrl = (() => {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
  }

  if (process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`
  }

  // Local development fallback
  return "http://localhost:3000"
})()

export const siteConfig: SiteConfig = {
  name: "NGP Wallet",
  author: "NGP",
  description:
    "Enterprise embedded wallet platform powered by Turnkey infrastructure.",
  keywords: [
    "NGP",
    "Turnkey",
    "Web3",
    "Embedded Wallet",
    "Next.js",
    "React",
    "Tailwind CSS",
  ],
  url: {
    base: baseUrl,
    author: "https://github.com/ngp",
  },
  links: {
    github: "https://github.com/ngp/ngp-wallet-int",
  },
  ogImage: `${baseUrl}/og.jpg`,
}
