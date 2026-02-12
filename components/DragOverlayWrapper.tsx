import { Active, DragOverlay, useDndMonitor } from '@dnd-kit/core'
import React, { useEffect, useState } from 'react'
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { ElementType, FactoryElements } from './FactoryElements';
import { SidebarBtnElementDragOverlay } from './SidebarBtnElement';

export default function DragOverlayWrapper() {
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const updateDesktopState = () => setIsDesktop(mediaQuery.matches);

    updateDesktopState();
    mediaQuery.addEventListener('change', updateDesktopState);

    return () => mediaQuery.removeEventListener('change', updateDesktopState);
  }, []);

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
    <DragOverlay modifiers={isDesktop ? [snapCenterToCursor] : []} style={{ pointerEvents: 'none' }}>
      {node}
    </DragOverlay>
  )
}
