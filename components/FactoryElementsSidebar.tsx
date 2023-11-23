import React from 'react'
import SidebarBtnElement from './SidebarBtnElement'
import { FactoryElements } from './FactoryElements'

function FactoryElementsSidebar() {
  return (
    <div>
      List of Elements
      <SidebarBtnElement factoryElement={FactoryElements.TextField} />
    </div>
  )
}

export default FactoryElementsSidebar