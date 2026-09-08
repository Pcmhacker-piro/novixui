import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { AuthCard } from "./auth-card";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useAuth();

  return (
    <DialogPrimitive.Root open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogPrimitive.Portal>
        {/* Backdrop */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300" />

        {/* Modal container */}
        <DialogPrimitive.Content
          aria-describedby="auth-modal-desc"
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 -translate-y-1/2 p-3 sm:p-4 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%] duration-300 max-h-[90vh] overflow-y-auto"
        >
          <DialogPrimitive.Title className="sr-only">Novix UI Authentication</DialogPrimitive.Title>
          <DialogPrimitive.Description id="auth-modal-desc" className="sr-only">
            Sign in or create a new community account with Google or email.
          </DialogPrimitive.Description>

          <div className="relative">
            {/* Close button */}
            <DialogPrimitive.Close
              aria-label="Close"
              className="absolute right-4 top-4 z-20 flex size-8 items-center justify-center rounded-full border border-white/10 bg-zinc-900/80 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-zinc-800 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-md"
            >
              <X className="size-4" />
            </DialogPrimitive.Close>

            <AuthCard onSuccess={closeAuthModal} compact />
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
