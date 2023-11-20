"use client"
import React from 'react'
import EditorAreaSidebar from './EditorAreaSidebar'
import { DragEndEvent, useDndMonitor, useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils';
import useEditor from './hooks/useEditor';
import { ElementType, FactoryElementInstance, FactoryElements } from './FactoryElements';
import { idGenerator } from '@/lib/idGenerator';

function EditorArea() {
  const {elements, addElement} = useEditor();
  const droppable = useDroppable({
    id: "editor-drop-area",
    data: {
      isEditorDropArea: true,
    },
  });

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;
      if(!active || !over) return;

      const isEditorBtnElement = active.data?.current?.isEditorBtnElement;

      if(isEditorBtnElement){
        const type = active.data?.current?.type;
        const newElement = FactoryElements[type as ElementType].construct(
          idGenerator()
        );
        addElement(0, newElement);
      }

      console.log("DRAG END", event)
    }
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
          {!droppable.isOver && (elements.length==0) &&
            <p className="flex flex-grow items-center">Drop Here. This is your receipt.</p>
          }
          {droppable.isOver &&
            <div className="p-4 w-full">
              <div className="h-[120px] bg-slate-200">
              </div>
            </div>
          }
          {(elements.length>0) &&
            <div>
              {
                elements.map((element) =>(
                  <EditorElementWrapper key={element.id} element={element}/>
                ))
              }
            </div>
          }
        </div>
      </div>
      <EditorAreaSidebar/>
    </div>
  )
}

function EditorElementWrapper({element}: {element: FactoryElementInstance}){
  const EditorElement = FactoryElements[element.type].editorComponent;

  return <EditorElement elementInstance={element}/>;
}

export default EditorArea