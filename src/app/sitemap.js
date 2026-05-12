export default function sitemap() {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://dayflow.app";
  return [
    { url: `${baseUrl}/`,         lastModified: new Date(), changeFrequency: "monthly",  priority: 1 },
    { url: `${baseUrl}/login`,     lastModified: new Date(), changeFrequency: "yearly",   priority: 0.5 },
  ]
}
