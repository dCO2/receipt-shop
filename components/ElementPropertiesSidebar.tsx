import React from 'react'
import useEditor from './hooks/useEditor'
import { FactoryElements } from './FactoryElements';
import { Button } from './ui/button';
import { X, HelpCircle } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';

function ElementPropertiesSidebar() {
  const {focusedElement, setFocusedElement} = useEditor();
  if (!focusedElement) return null;

  const elementConfig = FactoryElements[focusedElement?.type];
  const PropertiesComponent = elementConfig.propertiesComponent;
  const elementLabel = elementConfig.editorBtnElement.label;
  const helperText = focusedElement.extraAttributes?.helperText;

  return (
    <div className="flex flex-col gap-0 p-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <p className="font-medium">{elementLabel}</p>
          {helperText && (
            <HoverCard openDelay={0}>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent side="bottom" className="w-64 text-sm">
                {helperText}
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => {setFocusedElement(null);}}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <PropertiesComponent elementInstance={focusedElement}/>
    </div>
  );
}

export default ElementPropertiesSidebar;