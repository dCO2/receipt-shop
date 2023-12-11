import React from 'react'
import SidebarBtnElement from './SidebarBtnElement'
import { FactoryElements } from './FactoryElements'

function FactoryElementsSidebar() {
  return (
    <div>
      List of Elements
      <br/>
      <SidebarBtnElement factoryElement={FactoryElements.TextField} />
      <br/>
      <SidebarBtnElement factoryElement={FactoryElements.StoreNameField} />
      <br/>
    </div>
  )
}

export default FactoryElementsSidebar