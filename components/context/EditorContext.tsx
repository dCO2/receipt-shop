"use client";
import { ReactNode, createContext, useState } from "react";
import { FactoryElementInstance } from "../FactoryElements";

// type for EditorArea's context data;
// EditorArea should have a list of factory elements;
// EditorArea should be able to add & remove elements.
type EditorContextType = {
  elements: FactoryElementInstance[];
  addElement: (index: number, element: FactoryElementInstance) => void;
  removeElement: (id: string) => void;
}

export const EditorContext = createContext<EditorContextType | null>(null);

export default function EditorContextProvider({children} : {children: ReactNode;}){
  // EditorArea's context data
  const [elements, setElements] = useState<FactoryElementInstance[]>([]);

  // EditorArea's context actions
  const addElement = (index: number, element: FactoryElementInstance) => {
    setElements((prev) => {
      const newElements = [...prev];
      newElements.splice(index, 0, element);
      return newElements;
    });
  };

  const removeElement = () => {};

  return(
    <EditorContext.Provider
      value={{
        elements,
        addElement,
        removeElement,
      }}
    >
      {children}
    </EditorContext.Provider>
  );

}