import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://complianceastra.com";

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/dashboard`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/assessments/new`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/pci-saq-tool`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/pci-scope-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/pci-dss-requirements`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/solutions`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/solutions/ecommerce`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/solutions/pos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/solutions/payment-platform`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/resources`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/legal/disclaimer`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
  ];
}
