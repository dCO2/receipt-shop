"use client";

import { ReactNode, createContext, useState } from "react";
import { FactoryElementInstance } from "../FactoryElements";

type EditorContextType = {
  elements: FactoryElementInstance[];
  addElement: (index: number, element: FactoryElementInstance) => void;
}

export const EditorContext = createContext<EditorContextType | null>(null);

export default function EditorContextProvider({children} : {children: ReactNode;}){
  const [elements, setElements] = useState<FactoryElementInstance[]>([]);

  const addElement = (index: number, element: FactoryElementInstance) => {
    setElements((prev) => {
      const newElements = [...prev];
      newElements.splice(index, 0, element);
      return newElements;
    });
  };

  return(
    <EditorContext.Provider
      value={{
        elements,
        addElement,
      }}
    >
      {children}
    </EditorContext.Provider>
  );

}