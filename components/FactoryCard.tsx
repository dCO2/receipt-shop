"use client";

import { ReceiptFactory } from "@prisma/client";
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, PrinterIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DeleteFactory } from "@/actions/factory";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function FactoryCard({ factory }: { factory: ReceiptFactory }) {
  const [open, setOpen] = useState(false);
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  async function handleDelete() {
    setOpen(false);
    try {
      await DeleteFactory(factory.id);
      toast({
        title: "Deleted",
        description: "Factory has been deleted",
      });
      router.refresh();
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete factory",
        variant: "destructive",
      });
    }
  }

  return (
    <>
      <Card className="float-left max-w-xs min-w-[20rem]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            <div className="group flex items-center gap-1 min-w-0 overflow-hidden">
              <button
                onClick={() => setOpen(true)}
                className="flex-shrink-0 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-destructive hover:text-destructive/80"
                title="Delete factory"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
              <span className="ml-1 text-lg truncate font-bold">{factory.name}</span>
            </div>
            {factory.published && <Badge>Published</Badge>}
            {!factory.published && <Badge variant={"destructive"}>Draft</Badge>}
          </CardTitle>
          <CardDescription className="flex items-center justify-between text-muted-foreground text-xs">
            created{" "}
            {formatDistance(factory.createdAt, new Date(), {
              addSuffix: true,
            })}
            {factory.published && (
              <span className="flex items-center gap-2">
                <span>{factory.visits.toLocaleString()}</span>
                <EyeIcon className="h-4 w-4" />
                <span>{factory.prints.toLocaleString()}</span>
                <PrinterIcon className="h-4 w-4" />
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
          {factory.description || "No description"}
        </CardContent>
        <CardFooter>
          {factory.published && (
            <Button asChild className="w-full mt-2 text-sm gap-4">
              <Link href={`/factory/${factory.id}`}>
                <div className="flex flex-row items-center gap-1">
                  <EyeIcon className="h-4 w-4" /> view prints
                </div>
              </Link>
            </Button>
          )}
          {!factory.published && (
            <Button asChild variant={"secondary"} className="w-full mt-2 text-sm gap-4">
              <Link href={`/editfactory/${factory.id}`}>
                <div className="flex flex-row items-center gap-1">
                  <PencilSquareIcon className="h-4 w-4" /> edit factory
                </div>
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete factory?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <span className="font-medium">{factory.name}</span> from your
              factories. Existing printed receipts will be preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                startTransition(handleDelete);
              }}
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default FactoryCard;
