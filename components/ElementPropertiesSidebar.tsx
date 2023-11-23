import React from 'react'
import useEditor from './hooks/useEditor'
import { FactoryElements } from './FactoryElements';
import { Button } from './ui/button';

function ElementPropertiesSidebar() {
  const {focusedElement, setFocusedElement} = useEditor();
  if (!focusedElement) return null;

  const PropertiesComponent = FactoryElements[focusedElement?.type].propertiesComponent;
  return (
    <div>
      <div>
        <p className="text-sm text-foreground/70">Element Properties</p>
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => {setFocusedElement(null);}}
        >
          close
        </Button>
      </div>
      <PropertiesComponent elementInstance={focusedElement}/>
    </div>
  );
}

export default ElementPropertiesSidebar