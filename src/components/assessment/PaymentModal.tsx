"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@/components/ui/button";
import { XIcon, Lock, ShieldCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type PaymentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called when user confirms — runs sync + Stripe redirect or dev token login */
  onConfirmPayment: () => Promise<void>;
  isProcessing: boolean;
  errorMessage?: string | null;
};

const PRODUCT_NAME = "PCI Compliance Plan";
const PRICE = "$99";
const PRICE_LABEL = "One-time";

export function PaymentModal({
  open,
  onOpenChange,
  onConfirmPayment,
  isProcessing,
  errorMessage,
}: PaymentModalProps) {
  const handlePay = async () => {
    await onConfirmPayment();
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
            "rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden",
            "data-closing:opacity-0 data-opening:opacity-100",
          )}
        >
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Checkout</h2>
              <Dialog.Close
                render={
                  <Button variant="ghost" size="icon-sm" aria-label="Close" disabled={isProcessing} />
                }
              >
                <XIcon className="h-4 w-4" />
              </Dialog.Close>
            </div>

            <div className="px-6 py-5 space-y-5">
              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <Lock className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">{PRODUCT_NAME}</p>
                  <p className="text-sm text-slate-600 mt-0.5">
                    Full SAQ checklist, progress tracking, evidence notes, and PDF export. Based on PCI DSS
                    v4.0.1.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-b border-slate-200 py-4">
                <span className="text-slate-700">Total</span>
                <div className="text-right">
                  <span className="text-xl font-bold text-slate-900">{PRICE}</span>
                  <span className="ml-2 text-sm text-slate-500">({PRICE_LABEL})</span>
                </div>
              </div>

              <p className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="h-4 w-4 text-slate-400" aria-hidden />
                Secure payment powered by Stripe
              </p>

              {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  {errorMessage}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onOpenChange(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => void handlePay()}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                      Processing…
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" aria-hidden />
                      Pay {PRICE}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
