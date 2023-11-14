"use client"

import { ReceiptFactory } from "@prisma/client";
import PreviewFactoryBtn from "./PreviewFactoryBtn";
import SaveFactoryBtn from "./SaveFactoryBtn";
import PublishFactoryBtn from "./PublishFactoryBtn";
import EditorArea from "./EditorArea";
import { DndContext } from "@dnd-kit/core";
import DragOverlayWrapper from "./DragOverlayWrapper";

function EditFactory({factory}: {factory: ReceiptFactory}){

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
                  <SaveFactoryBtn />
                  <PublishFactoryBtn/>
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