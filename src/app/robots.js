export default function robots() {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://dayflow.app";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/","/dashboard/"] },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
