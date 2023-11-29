"use client"
import React, { startTransition, useRef } from 'react'
import { FactoryElementInstance, FactoryElements } from './FactoryElements';
import { Button } from './ui/button';

function FactoryPrint({factoryUrl, factoryContent}:
  {factoryUrl: string; factoryContent: FactoryElementInstance[]}
){

  const factoryValues = useRef<{ [key: string]: string }>({});

  const printValue = (key: string, value: string) => {
    factoryValues.current[key] = value;
  };

  const printFactory = () => {console.log("FACTORY VALUES", factoryValues.current);};

  return (
    <div className="flex justify-center w-full h-full items-center p-8">
      <div
        className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background
        w-full p-8 overflow-y-auto border shadow-xl rounded"
      >
        {factoryContent.map((element) => {
          const FactoryElement = FactoryElements[element.type].factoryComponent;
          return (
            <FactoryElement
              key={element.id}
              elementInstance={element}
              printValue={printValue}
              // isInvalid={factoryErrors.current[element.id]}
              // defaultValue={factoryValues.current[element.id]}
            />
          );
        })}
        <Button
          className="mt-8"
          onClick={() => {
            startTransition(printFactory);
          }}
          // disabled={pending}
        >Print</Button>
      </div>
    </div>
  )
}

export default FactoryPrint;