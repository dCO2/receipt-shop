import React from 'react'
import SidebarBtnElement from './SidebarBtnElement'
import { FactoryElements } from './FactoryElements'

function FactoryElementsSidebar() {
  return (
    <div>
      List of Elements
      <SidebarBtnElement factoryElement={FactoryElements.StoreLogoField} />
      <br/>
      <SidebarBtnElement factoryElement={FactoryElements.StoreEmailField} />
      <br/>
      <SidebarBtnElement factoryElement={FactoryElements.TextField} />
      <br/>
      <SidebarBtnElement factoryElement={FactoryElements.StoreNameField} />
      <br/>
      <SidebarBtnElement factoryElement={FactoryElements.StoreAddressField} />
      <br/>
      <SidebarBtnElement factoryElement={FactoryElements.StoreTelField} />
    </div>
  )
}

export default FactoryElementsSidebar