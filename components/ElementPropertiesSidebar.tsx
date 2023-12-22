import React from 'react'
import useEditor from './hooks/useEditor'
import { FactoryElements } from './FactoryElements';
import { Button } from './ui/button';

function ElementPropertiesSidebar() {
  const {focusedElement, setFocusedElement} = useEditor();
  if (!focusedElement) return null;

  const PropertiesComponent = FactoryElements[focusedElement?.type].propertiesComponent;
  return (
    <div className="flex flex-col gap-0 p-2">
      <div className="flex justify-between items-center">
        <p className="">Element Properties</p>
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => {setFocusedElement(null);}}
        >
          X
        </Button>
      </div>
      <PropertiesComponent elementInstance={focusedElement}/>
    </div>
  );
}

export default ElementPropertiesSidebar;