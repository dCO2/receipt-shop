import React from 'react'
import SidebarBtnElement from './SidebarBtnElement'
import { FactoryElements } from './FactoryElements'
import useEditor from './hooks/useEditor'

function FactoryElementsSidebar() {
  const {elementsPalette} = useEditor();
  
  return (
    <div className="flex flex-col gap-0 p-2">
      <div className="text-sm md:text-base font-medium text-muted-foreground mb-1">Build your Receipt</div>
      <div className="flex flex-col gap-1">
        {Object.values(elementsPalette).map((value, index) => (
          <SidebarBtnElement key={index} factoryElement={value}/>
          )
        )}
      </div>
    </div>
  )
}

export default FactoryElementsSidebar