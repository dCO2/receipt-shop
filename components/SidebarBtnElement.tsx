import React from 'react'
import { FactoryElements } from './FactoryElements'
import { Button } from './ui/button';
import { useDraggable } from '@dnd-kit/core';

function SidebarButtonContent({ factoryElement }: {
  factoryElement: FactoryElements
}) {
  const {label, icon: Icon} = factoryElement.editorBtnElement;

  return (
    <div className="flex flex-row items-center">
      <Icon/> &nbsp;
      <p className="overflow-hidden whitespace-nowrap">{label}</p>
    </div>
  )
}

function SidebarBtnElement({ factoryElement }: {
  factoryElement: FactoryElements
}){

  const draggable = useDraggable({
    id: `editor-btn-${factoryElement.type}`,
    data: {
      type: factoryElement.type,
      isEditorBtnElement: true,
    },
  });

  return (
    <Button
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className="flex justify-start w-fit"
      style={{ touchAction: 'none' }}
    >
      <SidebarButtonContent factoryElement={factoryElement} />
    </Button>
  )
}

export function SidebarBtnElementDragOverlay({ factoryElement }: {
  factoryElement: FactoryElements
}){
  
  return (
    <Button className="flex justify-start w-fit cursor-grabbing">
      <SidebarButtonContent factoryElement={factoryElement} />
    </Button>
  )
}

export default SidebarBtnElement;