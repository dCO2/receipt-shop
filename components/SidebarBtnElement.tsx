import React from 'react'
import { FactoryElements } from './FactoryElements'
import { Button } from './ui/button';
import { useDraggable } from '@dnd-kit/core';

function SidebarBtnElement({ factoryElement }: {
  factoryElement: FactoryElements
}){

  const {label, icon: Icon} = factoryElement.editorBtnElement;
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
    >
      <div className="flex flex-row items-center">
        <Icon/> &nbsp;
        <p className="overflow-hidden whitespace-nowrap">{label}</p>
      </div>
    </Button>
  )
}

export function SidebarBtnElementDragOverlay({ factoryElement }: {
  factoryElement: FactoryElements
}){

  const {label, icon: Icon} = factoryElement.editorBtnElement;
  
  return (
    <Button>
      <Icon/> &nbsp;
      <span>{label}</span>
    </Button>
  )
}

export default SidebarBtnElement;