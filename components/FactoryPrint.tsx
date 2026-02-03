"use client"
import React, { startTransition, useCallback, useRef, useState, useTransition } from 'react'
import { FactoryElementInstance, FactoryElements } from './FactoryElements';
import { Button } from './ui/button';
import { PrintFactory } from '@/actions/factory';
import { toast } from './ui/use-toast';
import { DndContext } from '@dnd-kit/core';
// import EditorArea from './EditorArea';
import DragOverlayWrapper from './DragOverlayWrapper';
import classNames from 'classnames';

function FactoryPrint({factoryUrl, factoryContent}:
  {factoryUrl: string; factoryContent: FactoryElementInstance[]}
){

  const factoryValues = useRef<{ [key: string]: string }>({}); // data that aggregates each value input into a receipt-factory
  const factoryErrors = useRef<{ [key: string]: boolean }>({}); // data that aggregates the errors in each value input into a receipt-factory
  const [renderKey, SetRenderKey] = useState(new Date().getTime()); // to trigger a rerender when validation fails. getTime to get random value
  
  const [printed, SetPrinted] = useState(false);
  const [pending, startTransition] = useTransition();

  /*
    function to validate (before printing) all the values input into a receipt-factory.
    side-effect is; factory-elements with invalid input is saved to factoryErrors data.
  */
  const validateFactory: () => boolean = useCallback(() => {
    for(const field of factoryContent){
      const inputValue = factoryValues.current[field.id] || "";
      const valid = FactoryElements[field.type].validate(field, inputValue); // call validate fxn for each factory-element
      
      if (!valid) {
        factoryErrors.current[field.id] = true; // invalid input is saved to factoryErrors data
      }
    }

    if (Object.keys(factoryErrors.current).length > 0) { // if factoryErrors data non-zero, return failed validation
      return false;
    }

    return true;

  }, [factoryContent]);

  /* function to aggregate each value input into a receipt-factory */
  const printValue = (key: string, value: string) => {
    factoryValues.current[key] = value;
  };

  /* process called when a factory is printed */
  const printFactory = async () => {
    factoryErrors.current = {};
    const validFactory = validateFactory();

    if(!validFactory){
      SetRenderKey(new Date().getTime());
      toast({
        title: "Error",
        description: "Please check the factory for errors",
        variant: "destructive"
      });

      return;
    }

    try {
      const jsonContent = JSON.stringify(factoryValues.current);
      await PrintFactory(factoryUrl, jsonContent);
      SetPrinted(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      });
    }

  };

  if(printed){
    return(
      <div>
        Printed!
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center w-full h-full items-center p-8">
      <div
        key={renderKey}
        className="w-[400px] min-h-[600px] bg-accent/40 rounded-md h-full flex flex-col flex-grow justify-start m-auto flex-1 overflow-y-auto"
        // className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background
        // w-full p-8 overflow-y-auto border shadow-xl rounded"
      >
        {factoryContent.map((element) => {
          const FactoryElement = FactoryElements[element.type].editorComponent;
          return (
            
            <EditorElementWrapper key={element.id} element={element}/>

            // <FactoryElement
            //   key={element.id}
            //   elementInstance={element}
              // printValue={printValue}
              // isInvalid={factoryErrors.current[element.id]}
              // defaultValue={factoryValues.current[element.id]}
            // />
          );
        })}
      </div>
      <Button
        className="mt-8"
        onClick={() => {
          startTransition(printFactory);
        }}
        disabled={pending}
      >
        {!pending && <>Print</>}
        {pending && <>spinnin icon</>}
      </Button>
    </div>

    // <DndContext>
    //     <div>
    //       <EditorArea/>
    //       <EditedArea/>
    //     </div>
    //     <div>
    //       {/* intent: to test draggable feature */}
    //       {/* <Draggables
    //         key={3456}
    //         id={3456}
    //         pos={{x:100,y:100}}
    //         content={"faaer"}
    //       /> */}
    //     </div>
    //   <DragOverlayWrapper/>
    // </DndContext>
  )
}

///////////////////////////



// function EditorArea() {
//   // const { elements, addElement, focusedElement, setFocusedElement } = useEditor();
//   // const droppable = useDroppable({
//   //   id: "editor-drop-area",
//   //   data: {
//   //     isEditorDropArea: true,
//   //   },
//   // });

//   // handle element drag events using dnd-kit;
//   // if the dragged item is what we need, then the necessary action is run
//   // useDndMonitor({
//   //   onDragEnd: (event: DragEndEvent) => {
//   //     const { active, over } = event;
//   //     if(!active || !over) return;

//   //     const isEditorBtnElement = active.data?.current?.isEditorBtnElement;

//   //     if(isEditorBtnElement){
//   //       const type = active.data?.current?.type;
//   //       const newElement = FactoryElements[type as ElementType].construct(
//   //         idGenerator()
//   //       );
//   //       addElement(0, newElement);
//   //     }
//   //   }
//   // });

//   return (
//     <div className="flex ">
//       <div
//         className="w-full"
//         // onClick={() => { if(focusedElement) setFocusedElement(null)}}
//       >
//         {/* the corresponding UI content in the EditorArea is displayed for each of the various states
//         (such as when the droppable isOver, !isOver, etc.) */}
//         <div 
//           // ref={droppable.setNodeRef}
//           // className={cn(
//           //   "max-w-[400px] min-h-[600px] bg-accent/40 rounded-md h-full flex flex-col flex-grow justify-start m-auto flex-1 overflow-y-auto",
//           //   droppable.isOver && "ring-2 ring-primary/20")}
//         >
//           {/* {!droppable.isOver && (elements.length==0) &&
//             <p className="flex mx-auto flex-grow items-center">Drop Here. This is your receipt.</p>
//           } */}
//           {/* {droppable.isOver &&
//             <div className="p-4 w-full">
//               <div className="h-[120px] bg-slate-200">
//               </div>
//             </div>
//           } */}
//           {(elements.length>0) &&
//             <div className=''>
//               {
//                 elements.map((element) =>(
//                   <EditorElementWrapper key={element.id} element={element}/>
//                 ))
//               }
//             </div>
//           }
//         </div>
//       </div>
//       {/* <div className="flex">
//         <EditorAreaSidebar/>
//       </div> */}
//     </div>
//   )
// }

function EditorElementWrapper({element}: {element: FactoryElementInstance}){
  // const { focusedElement, setFocusedElement } = useEditor();
  // const topHalf = useDroppable({
  //   id: element.id + "-top",
  //   data: {
  //     type: element.type,
  //     elementId: element.id,
  //     isTopHalfEditorAreaElement: true,
  //   },
  // });

  // const bottomHalf = useDroppable({
  //   id: element.id + "-bottom",
  //   data: {
  //     type: element.type,
  //     elementId: element.id,
  //     isBottomHalfEditorAreaElement: true,
  //   },
  // });

  const EditorElement = FactoryElements[element.type].editorComponent;

  return (
    <div
      className={classNames("relative overscroll-none overscroll-x-contain",
        // styles.EditorArea,
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




//////////////////////////

export default FactoryPrint;