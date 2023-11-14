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
    >
      <Icon/>
      <p>{label}</p>
    </Button>
  )
}

export function SidebarBtnElementDragOverlay({ factoryElement }: {
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

export default SidebarBtnElement;