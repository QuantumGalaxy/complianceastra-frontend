"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function OrganizationSettingsPage() {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
      return;
    }
    // Placeholder: no org API yet
    setOrgName("");
  }, [token, isLoading, router]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: no org API yet
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="container max-w-2xl">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-slate-600">
            <li>
              <Link href="/dashboard" className="hover:text-slate-900">
                Dashboard
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-slate-900 font-medium">Organization Settings</li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Organization Settings</h1>
          <p className="text-slate-600 mt-1">Manage your organization profile</p>
        </div>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Organization Profile</CardTitle>
            <CardDescription>
              Organization details for reports and team features (coming soon)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Acme Inc."
                  className="mt-1"
                />
              </div>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={saved}
              >
                {saved ? "Saved" : "Save"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
