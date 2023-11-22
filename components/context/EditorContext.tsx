"use client";
import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";
import { FactoryElementInstance } from "../FactoryElements";

// type for EditorArea's context data;
// EditorArea should have a list of factory elements;
// plus actions on those elements.
type EditorContextType = {
  elements: FactoryElementInstance[];
  addElement: (index: number, element: FactoryElementInstance) => void;
  removeElement: (id: string) => void;

  // focused element is the element being edited
  focusedElement: FactoryElementInstance | null;
  setFocusedElement: Dispatch<SetStateAction<FactoryElementInstance | null>>;
}

export const EditorContext = createContext<EditorContextType | null>(null);

export default function EditorContextProvider({children} : {children: ReactNode;}){
  // EditorArea's context data
  const [elements, setElements] = useState<FactoryElementInstance[]>([]);
  const [focusedElement, setFocusedElement] = useState<FactoryElementInstance | null>(null);

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
        focusedElement,
        addElement,
        removeElement,
        setFocusedElement,
      }}
    >
      {children}
    </EditorContext.Provider>
  );

}