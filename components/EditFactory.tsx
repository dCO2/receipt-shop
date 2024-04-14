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
import { FactoryPaletteElementsType, FactoryElements } from "./FactoryElements";

function EditFactory({factory}: {factory: ReceiptFactory}){
  const {setElements, setElementsPalette} = useEditor();
  let arrOfPalleteEle: FactoryPaletteElementsType = {}

  useEffect(() => {
    const elements = JSON.parse(factory.content);
    let allFelements = FactoryElements;
    let strOfElements = elements.map(obj => obj['type']).filter(Boolean)

    for(let key of Object.keys(allFelements)){
      if(!(strOfElements.includes(String(key)))){
        arrOfPalleteEle[key] = FactoryElements[key]
      }
    }
    setElements(elements);
    setElementsPalette(arrOfPalleteEle);
  }, [factory, setElements, setElementsPalette]);

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
      <main className="m-4">
        <nav className="mb-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center">
              <span>Factory:</span>&nbsp;<span className="font-bold">{factory.name}</span>
            </h2>
            <div className="flex items-center justify-between gap-2">
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
        <div>
          {/* intent: to test draggable feature */}
          {/* <Draggables
            key={3456}
            id={3456}
            pos={{x:100,y:100}}
            content={"faaer"}
          /> */}
        </div>
      </main>
      <DragOverlayWrapper/>
    </DndContext>
  );
}

export default EditFactory;