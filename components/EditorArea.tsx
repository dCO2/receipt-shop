"use client"
import React from 'react'
import EditorAreaSidebar from './EditorAreaSidebar'
import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils';

function EditorArea() {
  const droppable = useDroppable({
    id: "editor-drop-area",
    data: {
      isEditorDropArea: true,
    },
  });

  return (
    <div className="flex w-full h-full">
      <div className="w-full">
        <div 
          ref={droppable.setNodeRef}
          className={cn(
            "max-w-[920px] h-full flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto",
            droppable.isOver && "ring-2 ring-primary/20")}
        >
          {!droppable.isOver &&
            <p className="flex flex-grow items-center">Drop Here. This is your receipt.</p>
          }
          {droppable.isOver &&
            <div className="p-4 w-full">
              <div className="h-[120px] bg-slate-200">
              </div>
            </div>
          }
        </div>
      </div>
      <EditorAreaSidebar/>
    </div>
  )
}

export default EditorArea