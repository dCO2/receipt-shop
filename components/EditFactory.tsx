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

function EditFactory({factory}: {factory: ReceiptFactory}){
  const {setElements} = useEditor();

  useEffect(() => {
    const elements = JSON.parse(factory.content);
    setElements(elements);
  }, [factory, setElements]);

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