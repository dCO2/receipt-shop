"use client"

import React, { useState } from 'react'
import useEditor from './hooks/useEditor';
import FactoryElementsSidebar from './FactoryElementsSidebar';
import ElementPropertiesSidebar from './ElementPropertiesSidebar';
import { Button } from './ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

function EditorAreaSidebar() {
  const {focusedElement} = useEditor();
  const [mobileExpanded, setMobileExpanded] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-[400px] h-fit border border-solid rounded-md">
        {focusedElement && <ElementPropertiesSidebar/>}
        {!focusedElement && <FactoryElementsSidebar/>}
      </aside>

      {/* Mobile sidebar - fixed at bottom-right with stable button position */}
      <div className="md:hidden fixed bottom-4 right-4 z-50 flex flex-col items-end">
        {/* Expandable content - positioned above button */}
        <div 
          className={cn(
            "mb-2 bg-background border border-solid rounded-md shadow-lg max-h-[60vh] overflow-y-auto w-[280px]",
            "transition-all duration-200 ease-out origin-bottom",
            mobileExpanded 
              ? "opacity-100 scale-100 translate-y-0" 
              : "opacity-0 scale-95 translate-y-2 pointer-events-none h-0 mb-0 overflow-hidden"
          )}
        >
          {focusedElement && <ElementPropertiesSidebar/>}
          {!focusedElement && <FactoryElementsSidebar/>}
        </div>
        {/* Button always stays in place */}
        <Button
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="flex items-center gap-2 text-sm"
        >
          <span>Build your Receipt</span>
          {mobileExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>
    </>
  )
}

export default EditorAreaSidebar