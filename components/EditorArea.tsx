"use client"
import React from 'react'
import EditorAreaSidebar from './EditorAreaSidebar'
import { DragEndEvent, useDndMonitor, useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils';
import useEditor from './hooks/useEditor';
import { ElementType, FactoryElementInstance, FactoryElements } from './FactoryElements';
import { idGenerator } from '@/lib/idGenerator';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from './ui/context-menu';

import styles from './EditorArea.module.css';
import classNames from 'classnames';


function EditorArea() {
  const { elements, addElement, focusedElement, setFocusedElement, editorRef } = useEditor();
  const droppable = useDroppable({
    id: "editor-drop-area",
    data: {
      isEditorDropArea: true,
    },
  });

  // handle element drag events using dnd-kit;
  // if the dragged item is what we need, then the necessary action is run
  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const { active, over, delta } = event;
      if(!active || !over) return;

      const isEditorBtnElement = active.data?.current?.isEditorBtnElement;

      if(isEditorBtnElement){
        const type = active.data?.current?.type;
        const newElement = FactoryElements[type as ElementType].construct(
          idGenerator()
        );
        
        // Set initial position based on where element was dropped
        // Calculate drop position relative to editor area
        if (editorRef?.current && newElement.extraAttributes) {
          const editorRect = editorRef.current.getBoundingClientRect();
          const dropX = Math.max(0, delta.x);
          const dropY = Math.max(0, delta.y);
          
          newElement.extraAttributes.draggableInitialPos = {
            x: dropX,
            y: dropY,
          };
        }
        
        addElement(0, newElement);
      }
    }
  });

  return (
    <div className="flex flex-col md:flex-row">
      <div
        className="w-full flex justify-center md:justify-start"
        onClick={() => { if(focusedElement) setFocusedElement(null)}}
      >
        {/* the corresponding UI content in the EditorArea is displayed for each of the various states
        (such as when the droppable isOver, !isOver, etc.) */}
        <div 
          ref={(node) => {
            // Combine droppable ref and editorRef
            droppable.setNodeRef(node);
            if (editorRef && 'current' in editorRef) {
              (editorRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            }
          }}
          className={cn(
            "relative max-w-[400px] min-h-[600px] bg-accent/40 rounded-md h-full flex flex-col flex-grow justify-start m-auto flex-1 overflow-y-auto",
            droppable.isOver && "ring-2 ring-primary/20")}
        >
          {!droppable.isOver && (elements.length==0) &&
            <p className="flex mx-auto flex-grow items-center text-sm md:text-base text-muted-foreground">Drop Here. This is your receipt.</p>
          }
          {/* {droppable.isOver &&
            <div className="p-4 w-full">
              <div className="h-[120px] bg-slate-200">
              </div>
            </div>
          } */}
          {(elements.length>0) &&
            <div className=''>
              {
                elements.map((element) =>(
                  <EditorElementWrapper key={element.id} element={element}/>
                ))
              }
            </div>
          }
        </div>
      </div>
      <div className="flex">
        <EditorAreaSidebar/>
      </div>
    </div>
  )
}

function EditorElementWrapper({element}: {element: FactoryElementInstance}){
  const { focusedElement, setFocusedElement, validationErrors, removeElement } = useEditor();
  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfEditorAreaElement: true,
    },
  });

  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfEditorAreaElement: true,
    },
  });

  const EditorElement = FactoryElements[element.type].editorComponent;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="contents">
          <EditorElement elementInstance={element}
            isInvalid={validationErrors.has(element.id)}
          />  
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={() => removeElement(element.id)}
        >
          Remove
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default EditorArea