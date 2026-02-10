"use client";

import { useClerk } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode, useState, useEffect } from "react";

interface ClerkLoadingWrapperProps {
  children: ReactNode;
  variant?: "sign-in" | "sign-up";
}

function LoadingSkeleton({ variant }: { variant: "sign-in" | "sign-up" }) {
  const rows = variant === "sign-up" ? 4 : 3;
  
  return (
    <div className="w-full max-w-[400px] space-y-4 p-6 sm:p-8 bg-card rounded-lg border">
      {/* Header placeholder */}
      <Skeleton className="h-8 w-48 mx-auto" />
      <Skeleton className="h-4 w-56 mx-auto" />
      
      {/* OAuth buttons */}
      <div className="space-y-2 pt-2">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
      
      {/* Divider */}
      <div className="flex items-center gap-2 py-2">
        <Skeleton className="h-px flex-1" />
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-px flex-1" />
      </div>
      
      {/* Input fields */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
      
      {/* Submit button */}
      <Skeleton className="h-10 w-full rounded-md mt-4" />
      
      {/* Footer link */}
      <Skeleton className="h-4 w-40 mx-auto" />
    </div>
  );
}

export default function ClerkLoadingWrapper({ children, variant = "sign-in" }: ClerkLoadingWrapperProps) {
  const { loaded } = useClerk();
  const [showContent, setShowContent] = useState(false);

  // Add slight delay after loaded to allow Clerk to fully render
  useEffect(() => {
    if (loaded) {
      const timer = setTimeout(() => setShowContent(true), 50);
      return () => clearTimeout(timer);
    }
  }, [loaded]);

  return (
    <div className="w-full max-w-[400px] md:w-[400px] flex flex-col items-center">
      {/* Skeleton - shown until content ready */}
      {!showContent && (
        <div className="w-full transition-opacity duration-200 ease-out">
          <LoadingSkeleton variant={variant} />
        </div>
      )}
      
      {/* Actual content - fades in */}
      {showContent && (
        <div className="w-full animate-in fade-in duration-200 flex justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
