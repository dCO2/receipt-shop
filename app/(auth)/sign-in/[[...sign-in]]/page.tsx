"use client";

import { SignIn } from "@clerk/nextjs";
import AuthPageLayout from "@/components/AuthPageLayout";
import ClerkLoadingWrapper from "@/components/ClerkLoadingWrapper";

export default function Page() {
  return (
    <AuthPageLayout>
      <ClerkLoadingWrapper variant="sign-in">
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
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
