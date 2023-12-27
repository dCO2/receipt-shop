"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

function VisitFactoryBtn({ shareUrl }: { shareUrl: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const shareLink = `${window.location.origin}/print/${shareUrl}`;
  return (
    <Button
      className="w-fit p-1"
      onClick={() => {
        window.open(shareLink, "_blank");
      }}
      variant={"outline"}
    >
      {/* <BookOpenIcon className="h-4 w-4"/> */}
      <ArrowUpRightIcon className="h-4 w-4 bg-white"/>
    </Button>
  );
}

export default VisitFactoryBtn;