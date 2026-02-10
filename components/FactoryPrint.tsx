"use client"
import React, { useCallback, useRef, useState, useTransition } from 'react'
import html2canvas from 'html2canvas';
import { FactoryElementInstance, FactoryElements } from './FactoryElements';
import { Button } from './ui/button';
import { PrintFactory } from '@/actions/factory';
import { toast } from './ui/use-toast';

function FactoryPrint({factoryUrl, factoryContent, factoryName}:
  {factoryUrl: string; factoryContent: FactoryElementInstance[]; factoryName: string}
){

  const factoryValues = useRef<{ [key: string]: string }>({}); // data that aggregates each value input into a receipt-factory
  const factoryErrors = useRef<{ [key: string]: boolean }>({}); // data that aggregates the errors in each value input into a receipt-factory
  const [renderKey, SetRenderKey] = useState(new Date().getTime()); // to trigger a rerender when validation fails. getTime to get random value
  
  const [pending, startTransition] = useTransition();
  const receiptRef = useRef<HTMLDivElement>(null);

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

  /* process called when a factory is printed - captures receipt as PNG and downloads */
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

    if (!receiptRef.current) return;

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const sanitizedName = factoryName.replace(/[^a-zA-Z0-9]/g, '-');
      link.download = `receipt-${sanitizedName}-${timestamp}.png`;
      link.href = dataUrl;
      link.click();

      // save print record to database
      const jsonContent = JSON.stringify(factoryValues.current);
      await PrintFactory(factoryUrl, jsonContent);

      toast({
        title: "Success",
        description: "Receipt downloaded successfully",
      });
    } catch (error) {
      console.error('Failed to generate PNG:', error);
      toast({
        title: "Error",
        description: "Failed to generate receipt image",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col justify-center w-full h-full items-center p-8">
      <div
        ref={receiptRef}
        key={renderKey}
        className="w-[400px] min-h-[600px] bg-accent/40 rounded-md h-full flex flex-col flex-grow justify-start m-auto flex-1 overflow-y-auto"
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
        {pending && <>Generating...</>}
      </Button>
    </div>
  )
}

export default FactoryPrint;