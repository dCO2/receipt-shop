import { Active, DragOverlay, useDndMonitor } from '@dnd-kit/core'
import React, { useState } from 'react'
import { ElementType, FactoryElements } from './FactoryElements';
import { SidebarBtnElementDragOverlay } from './SidebarBtnElement';

export default function DragOverlayWrapper() {
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);

  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
    },
    onDragCancel: () => {
      setDraggedItem(null);
    },
    onDragEnd: () => {
      setDraggedItem(null);
    },
  });

  if(!draggedItem) return null;

  let node = <div></div>

  const isEditorBtnElement = draggedItem.data?.current?.isEditorBtnElement;

  if(isEditorBtnElement){
    const type = draggedItem.data?.current?.type as ElementType;
    node = <SidebarBtnElementDragOverlay factoryElement={FactoryElements[type]} />
  }

  return (
    <DragOverlay>{node}</DragOverlay>
  )
}
