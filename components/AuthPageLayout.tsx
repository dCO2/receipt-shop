import Image from "next/image";
import { ReactNode } from "react";

function AuthPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full flex items-center justify-center">
      {/* Mobile: blurred background image */}
      <div className="absolute inset-0 md:hidden">
        <Image
          src="/sample-receipt.jpg"
          alt="Sample receipt"
          fill
          className="object-cover blur-sm opacity-30"
          priority
        />
      </div>

      {/* Centered group: form + image side by side on desktop */}
      <div className="relative z-10 flex items-center md:items-start justify-center gap-4 p-4 w-full md:w-auto">
        {children}

        {/* Desktop: receipt image */}
        <div className="hidden md:block relative">
          <Image
            src="/sample-receipt.jpg"
            alt="Sample receipt"
            width={400}
            height={600}
            className="rounded-lg object-contain max-h-[calc(100vh-96px)] w-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default AuthPageLayout;
