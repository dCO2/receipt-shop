import React from 'react'
import useEditor from './hooks/useEditor';
import FactoryElementsSidebar from './FactoryElementsSidebar';
import ElementPropertiesSidebar from './ElementPropertiesSidebar';

function EditorAreaSidebar() {
  const {focusedElement} = useEditor();
  return (
    <aside className="w-[400px] h-fit border border-solid rounded-md">
      {focusedElement && <ElementPropertiesSidebar/>}
      {!focusedElement && <FactoryElementsSidebar/>}
    </aside>
  )
}

export default EditorAreaSidebar