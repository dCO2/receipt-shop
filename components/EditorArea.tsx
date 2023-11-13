"use client"
import React from 'react'
import EditorAreaSidebar from './EditorAreaSidebar'
import { useDroppable } from '@dnd-kit/core'

function EditorArea() {
  const droppable = useDroppable({
    id: "editor-drop-area",
    data: {
      isEditorDropArea: true,
    },
  });

  return (
    <div>
      <div>
        <div>
          <p>Drop Here. This is your receipt.</p>
        </div>
      </div>
      <EditorAreaSidebar/>
    </div>
  )
}

export default EditorArea