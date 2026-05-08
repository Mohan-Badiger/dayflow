export default function sitemap() {
  return [
    { url: "/",         lastModified: new Date(), changeFrequency: "monthly",  priority: 1 },
    { url: "/auth",     lastModified: new Date(), changeFrequency: "yearly",   priority: 0.5 },
  ]
}
