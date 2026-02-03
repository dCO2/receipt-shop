"use client"
import React, { useCallback, useRef, useState, useTransition } from 'react'
import { FactoryElementInstance, FactoryElements } from './FactoryElements';
import { Button } from './ui/button';
import { PrintFactory } from '@/actions/factory';
import { toast } from './ui/use-toast';

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
  )
}

export default FactoryPrint;