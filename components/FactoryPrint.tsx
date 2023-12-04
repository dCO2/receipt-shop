"use client"
import React, { startTransition, useCallback, useRef, useState } from 'react'
import { FactoryElementInstance, FactoryElements } from './FactoryElements';
import { Button } from './ui/button';

function FactoryPrint({factoryUrl, factoryContent}:
  {factoryUrl: string; factoryContent: FactoryElementInstance[]}
){

  const factoryValues = useRef<{ [key: string]: string }>({}); // data that aggregates each value input into a receipt-factory
  const factoryErrors = useRef<{ [key: string]: boolean }>({}); // data that aggregates the errors in each value input into a receipt-factory
  const [renderKey, SetRenderKey] = useState(new Date().getTime()); // to trigger a rerender when validation fails. getTime to get random value

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
  const printFactory = () => {
    factoryErrors.current = {};
    const validFactory = validateFactory();

    if(!validFactory){
      SetRenderKey(new Date().getTime());
      // toast({
      //   title: "Error",
      //   description: "Please check the factory for errors",
      //   variant: "destructive"
      // });

      return;
    }

    console.log("FACTORY VALUES", factoryValues.current);
  };

  return (
    <div className="flex justify-center w-full h-full items-center p-8">
      <div
        key={renderKey}
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
              isInvalid={factoryErrors.current[element.id]}
              defaultValue={factoryValues.current[element.id]}
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