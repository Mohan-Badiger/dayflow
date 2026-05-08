export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/","/dashboard/"] },
    sitemap: `${process.env.NEXTAUTH_URL}/sitemap.xml`,
  }
}
