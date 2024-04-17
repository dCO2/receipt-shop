"use client"
import React from 'react'
import EditorAreaSidebar from './EditorAreaSidebar'
import { DragEndEvent, useDndMonitor, useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils';
import useEditor from './hooks/useEditor';
import { ElementType, FactoryElementInstance, FactoryElements } from './FactoryElements';
import { idGenerator } from '@/lib/idGenerator';

import styles from './EditorArea.module.css';
import classNames from 'classnames';


function EditorArea() {
  const { elements, addElement, focusedElement, setFocusedElement } = useEditor();
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
    }
  });

  return (
    <div className="flex ">
      <div
        className="w-full"
        onClick={() => { if(focusedElement) setFocusedElement(null)}}
      >
        {/* the corresponding UI content in the EditorArea is displayed for each of the various states
        (such as when the droppable isOver, !isOver, etc.) */}
        <div 
          ref={droppable.setNodeRef}
          className={cn(
            "max-w-[400px] min-h-[600px] bg-accent/40 rounded-md h-full flex flex-col flex-grow justify-start m-auto flex-1 overflow-y-auto",
            droppable.isOver && "ring-2 ring-primary/20")}
        >
          {!droppable.isOver && (elements.length==0) &&
            <p className="flex mx-auto flex-grow items-center">Drop Here. This is your receipt.</p>
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
  const { focusedElement, setFocusedElement } = useEditor();
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
    <div
      className={classNames("relative overscroll-none overscroll-x-contain",
        styles.EditorArea,
      )}
      // "text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
      
      // onClick={(e) => {
      //   e.stopPropagation();
      //   setFocusedElement(element);
      // }}
    >
    {/* <div 
      className="relative h-fit flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
      onClick={(e) => {
        e.stopPropagation();
        setFocusedElement(element);
      }}
    >
      <div ref={topHalf.setNodeRef} className="absolute w-full h-1/2 rounded-t-md"/>
      <div ref={bottomHalf.setNodeRef} className="absolute w-full bottom-0 h-1/2 rounded-b-md"/>
      <div
        className="flex w-full h-fit items-center rounded-md bg-accent/40 px-2 py-2 pointer-events-none">
        <EditorElement elementInstance={element}/>  
      </div>
    </div> */}
    <EditorElement elementInstance={element}
    />  
    </div>
  );
}

export default EditorArea