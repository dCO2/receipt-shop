import React from 'react'
import { FactoryElements } from './FactoryElements'
import { Button } from './ui/button';

function SidebarBtnElement({ factoryElement }: {
  factoryElement: FactoryElements
}){

  const {label, icon: Icon} = factoryElement.editorBtnElement;
  return (
    <Button>
      <Icon/>
      <p>{label}</p>
    </Button>
  )
}

export default SidebarBtnElement