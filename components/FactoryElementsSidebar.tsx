import React from 'react'
import SidebarBtnElement from './SidebarBtnElement'
import { FactoryElements } from './FactoryElements'

function FactoryElementsSidebar() {
  return (
    <div className="flex flex-col gap-0 p-2">
      <div>List of Elements</div>
      <div className="flex flex-col gap-1">
        <SidebarBtnElement factoryElement={FactoryElements.StoreLogoField} />
        <SidebarBtnElement factoryElement={FactoryElements.StoreEmailField} />
        <SidebarBtnElement factoryElement={FactoryElements.TextField} />
        <SidebarBtnElement factoryElement={FactoryElements.StoreNameField} />
        <SidebarBtnElement factoryElement={FactoryElements.StoreAddressField} />
        <SidebarBtnElement factoryElement={FactoryElements.StoreTelField} />
      </div>
    </div>
  )
}

export default FactoryElementsSidebar