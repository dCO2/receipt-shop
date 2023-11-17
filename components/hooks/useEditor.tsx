"use client";

import React, { useContext } from 'react'
import { EditorContext } from '../context/EditorContext';

function useEditor() {
  const context = useContext(EditorContext);

  if(!context){
    throw new Error("useEditor must be used within an EditorContext");
  }

  return context;
}

export default useEditor;