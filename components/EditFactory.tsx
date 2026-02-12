"use client"

import { ReceiptFactory } from "@prisma/client";
import PreviewFactoryBtn from "./PreviewFactoryBtn";
import SaveFactoryBtn from "./SaveFactoryBtn";
import PublishFactoryBtn from "./PublishFactoryBtn";
import EditorArea from "./EditorArea";
import { CollisionDetection, DndContext, pointerWithin, rectIntersection } from "@dnd-kit/core";
import DragOverlayWrapper from "./DragOverlayWrapper";
import { useEffect, useState } from "react";
import useEditor from "./hooks/useEditor";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";
import { toast } from "./ui/use-toast";
import { FactoryPaletteElementsType, FactoryElements } from "./FactoryElements";
import { Menu, ChevronRight } from "lucide-react";

const collisionDetectionStrategy: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args);
};

function EditFactory({factory}: {factory: ReceiptFactory}){
  const {setElements, setElementsPalette, setFocusedElement} = useEditor();
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  let arrOfPalleteEle: FactoryPaletteElementsType = {}

  useEffect(() => {
    const elements = JSON.parse(factory.content);
    let allFelements = FactoryElements;
    let strOfElements = elements.map(obj => obj['type']).filter(Boolean)
    setFocusedElement(null); // attempt: make editorareasidebar focus on no element when a new page is accessed

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
    <DndContext collisionDetection={collisionDetectionStrategy}>
      <main className="m-4 pb-24 md:pb-8">
        <nav className="mb-4">
          <div className="flex items-center justify-between gap-2 relative">
            <h2 className="flex items-center text-sm md:text-base">
              <span>Factory:</span>&nbsp;<span className="font-bold truncate max-w-[120px] md:max-w-none">{factory.name}</span>
            </h2>
            {/* Desktop nav buttons */}
            <div className="hidden md:flex items-center gap-2">
              <PreviewFactoryBtn/>
              {!factory.published && (
                <>
                  <SaveFactoryBtn id={factory.id} />
                  <PublishFactoryBtn id={factory.id}/>
                </>
              )}
            </div>
            {/* Mobile nav menu - absolute positioned to overlay */}
            <div className="flex md:hidden items-center absolute right-0 top-1/2 -translate-y-1/2">
              <div 
                className={`flex items-center gap-1 overflow-hidden transition-all duration-200 ease-out ${
                  navMenuOpen ? 'max-w-[200px] opacity-100 mr-1' : 'max-w-0 opacity-0'
                }`}
              >
                <PreviewFactoryBtn mobile/>
                {!factory.published && (
                  <>
                    <SaveFactoryBtn id={factory.id} mobile/>
                    <PublishFactoryBtn id={factory.id} mobile/>
                  </>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNavMenuOpen(!navMenuOpen)}
                className="h-8 w-8"
              >
                {navMenuOpen ? <ChevronRight className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
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