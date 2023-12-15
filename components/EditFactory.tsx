"use client"

import { ReceiptFactory } from "@prisma/client";
import PreviewFactoryBtn from "./PreviewFactoryBtn";
import SaveFactoryBtn from "./SaveFactoryBtn";
import PublishFactoryBtn from "./PublishFactoryBtn";
import EditorArea from "./EditorArea";
import { DndContext } from "@dnd-kit/core";
import DragOverlayWrapper from "./DragOverlayWrapper";
import { useEffect } from "react";
import useEditor from "./hooks/useEditor";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";
import { toast } from "./ui/use-toast";

function EditFactory({factory}: {factory: ReceiptFactory}){
  const {setElements} = useEditor();

  useEffect(() => {
    const elements = JSON.parse(factory.content);
    setElements(elements);
  }, [factory, setElements]);

  if(factory.published){

    const shareUrl = `${window.location.origin}/print/${factory.shareURL}`;

    return(
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="max-w-md">
          <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-10">
            Factory Published!
          </h1>
          <h2 className="text-2xl">Share this factory</h2>
          <h3 className="text-xl text-muted-foreground border-b pb-10">
            Anyone with the link can make receipts
          </h3>
          <div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4">
            <Input className="w-full" readOnly value={shareUrl} />
            <Button
              className="mt-2 w-full"
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                toast({
                  title: "Copied!",
                  description: "Link copied to clipboard",
                });
              }}
            >
              Copy link
            </Button>
          </div>
          <div className="flex justify-between">
            <Button variant={"link"} asChild>
              <Link href={"/"} className="gap-2">
                <span>&lt;&lt;&lt;</span>
                Go back home
              </Link>
            </Button>
            <Button variant={"link"} asChild>
              <Link href={`/factory/${factory.id}`} className="gap-2">
                Factory details
                <span>&gt;&gt;&gt;</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return(
    <DndContext>
      <main>
        <nav>
          <div>
            <h2>
              <span>Factory:</span>
              {factory.name}
            </h2>
            <div>
              <PreviewFactoryBtn/>
              {!factory.published && (
                <>
                  <SaveFactoryBtn id={factory.id} />
                  <PublishFactoryBtn id={factory.id}/>
                </>
              )}
            </div>
          </div>
        </nav>
        <div>
          <EditorArea/>
        </div>
      </main>
      <DragOverlayWrapper/>
    </DndContext>
  );
}

export default EditFactory;