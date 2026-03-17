"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type PaymentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  planLabel?: string;
};

export function PaymentModal({
  open,
  onOpenChange,
  onSuccess,
  planLabel = "Full checklist – $49",
}: PaymentModalProps) {
  const [simulating, setSimulating] = React.useState(false);

  const handleSimulateSuccess = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      onOpenChange(false);
      onSuccess();
    }, 800);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop
          className={cn(
            "fixed inset-0 z-50 bg-black/20 transition-opacity",
            "data-closing:opacity-0 data-opening:opacity-100",
          )}
        />
        <Dialog.Popup
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
            "rounded-xl border border-slate-200 bg-white shadow-xl",
            "data-closing:opacity-0 data-opening:opacity-100",
          )}
        >
          <Card className="border-0 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg">Complete payment</CardTitle>
              <Dialog.Close
                render={
                  <Button variant="ghost" size="icon-sm" aria-label="Close" />
                }
              >
                <XIcon className="h-4 w-4" />
              </Dialog.Close>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-slate-600">
                Payment form would appear here (Stripe integration). You would
                enter card details and complete the one-time charge for{" "}
                <strong>{planLabel}</strong>.
              </p>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <strong>Demo:</strong> Use the button below to simulate a
                successful payment and unlock the full checklist.
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleSimulateSuccess}
                  disabled={simulating}
                >
                  {simulating ? "Processing…" : "Simulate payment success"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
