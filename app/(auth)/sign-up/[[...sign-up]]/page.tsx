"use client";

import { SignUp } from "@clerk/nextjs";
import AuthPageLayout from "@/components/AuthPageLayout";
import ClerkLoadingWrapper from "@/components/ClerkLoadingWrapper";

export default function Page() {
  return (
    <AuthPageLayout>
      <ClerkLoadingWrapper variant="sign-up">
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          appearance={{
            elements: {
              rootBox: "max-w-[400px] md:w-[400px]",
              card: "max-w-[400px] md:w-[400px]",
            },
          }}
        />
      </ClerkLoadingWrapper>
    </AuthPageLayout>
  );
}

