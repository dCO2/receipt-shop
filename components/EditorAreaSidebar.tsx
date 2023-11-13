import React from 'react'
import { FactoryElements } from './FactoryElements'
import SidebarBtnElement from './SidebarBtnElement'

function EditorAreaSidebar() {
  return (
    <aside className="">
      List of Elements
      <SidebarBtnElement factoryElement={FactoryElements.TextField} />
    </aside>
  )
}

export default EditorAreaSidebar