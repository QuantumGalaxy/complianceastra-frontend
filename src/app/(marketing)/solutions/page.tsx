import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SOLUTIONS = [
  {
    id: "ecommerce",
    title: "Ecommerce Payment Environments",
    description:
      "Online checkout, payment gateways, hosted carts. Understand what's in scope for your web store.",
    pain: "Is my checkout in scope? What about my hosting provider?",
    cta: "Start Ecommerce Assessment",
    href: "/assessments/new?env=ecommerce",
    detailHref: "/solutions/ecommerce",
  },
  {
    id: "pos",
    title: "POS Terminal Environments",
    description:
      "Physical terminals, integrated POS, multi-location retail. Network segmentation and terminal management.",
    pain: "How do I segment my network? Are all my locations in scope?",
    cta: "Start POS Assessment",
    href: "/assessments/new?env=pos",
    detailHref: "/solutions/pos",
  },
  {
    id: "payment_platform",
    title: "Payment Platform / Fintech",
    description:
      "APIs, multi-tenant systems, embedded payments. Scope card data exposure across your platform.",
    pain: "How do we scope card data across tenants? What about our third-party processors?",
    cta: "Start Platform Assessment",
    href: "/assessments/new?env=payment_platform",
    detailHref: "/solutions/payment-platform",
  },
];

export default function SolutionsPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900">Solutions by Environment</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            PCI DSS scoping differs by environment. We adapt our questions and guidance to your setup.
          </p>
        </header>
        <div className="grid gap-8 md:grid-cols-3">
          {SOLUTIONS.map((s) => (
            <Card key={s.id} className="border-slate-200 flex flex-col">
              <CardHeader>
                <CardTitle className="text-slate-900">{s.title}</CardTitle>
                <CardDescription>{s.description}</CardDescription>
                <p className="text-sm text-slate-500 italic mt-2">&quot;{s.pain}&quot;</p>
              </CardHeader>
              <CardContent className="mt-auto pt-0 flex gap-2">
                <Link href={s.href} className="flex-1">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">{s.cta}</Button>
                </Link>
                <Link href={s.detailHref}>
                  <Button variant="outline" className="w-full">
                    Learn more
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
