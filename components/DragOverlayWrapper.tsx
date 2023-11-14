import { DragOverlay, useDndMonitor } from '@dnd-kit/core'
import React from 'react'

export default function DragOverlayWrapper() {
  useDndMonitor({
    onDragStart: (event) => {
      console.log("DRAG ITEM", event);
    },
  });
  const node = <div>"Node is dragged"</div>
  return (
    <DragOverlay>{node}</DragOverlay>
  )
}
