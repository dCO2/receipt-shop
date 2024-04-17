"use client";
import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";
import { FactoryElementInstance, FactoryElements, FactoryElementType, FactoryPaletteElementsType } from "../FactoryElements";

// type for EditorArea's context data;
// EditorArea should have a list of factory elements;
// plus actions on those elements.
type EditorContextType = {
  elements: FactoryElementInstance[];
  elementsPalette: FactoryPaletteElementsType;

  addElement: (index: number, element: FactoryElementInstance) => void;
  removeElement: (id: string) => void;
  // re-add elements to the editor area once the page is saved / refreshed
  setElements: Dispatch<SetStateAction<FactoryElementInstance[]>>;
  setElementsPalette: Dispatch<SetStateAction<FactoryPaletteElementsType>>;

  // focused element is the element being edited
  focusedElement: FactoryElementInstance | null;
  setFocusedElement: Dispatch<SetStateAction<FactoryElementInstance | null>>;

  updateElement: (id: string, element: FactoryElementInstance) => void;
}

export const EditorContext = createContext<EditorContextType | null>(null);

export default function EditorContextProvider({children} : {children: ReactNode;}){
  // EditorArea's context data
  const [elements, setElements] = useState<FactoryElementInstance[]>([]);
  const [elementsPalette, setElementsPalette] = useState<FactoryPaletteElementsType>(FactoryElements);

  const [focusedElement, setFocusedElement] = useState<FactoryElementInstance | null>(null);

  // EditorArea's context actions
  const addElement = (index: number, element: FactoryElementInstance) => {
    setElements((prev) => {
      const newElements = [...prev];
      newElements.push(element);
      // newElements.splice(index, 0, element);
      return newElements;
    });

    setElementsPalette((prev) => {

      const newElementsPalette = {...prev};
      delete newElementsPalette[element.type];

      return newElementsPalette;
    });
  };

  const removeElement = () => {};

  const updateElement = (id: string, element: FactoryElementInstance) => {
    setElements(prev => {
      const newElements = [...prev];
      const index = newElements.findIndex(el => el.id === id);
      newElements[index] = element;
      return newElements;
    })
  };

  return(
    <EditorContext.Provider
      value={{
        elements,
        elementsPalette,
        focusedElement,
        addElement,
        removeElement,
        updateElement,
        setElements,
        setElementsPalette,
        

        setFocusedElement,
      }}
    >
      {children}
    </EditorContext.Provider>
  );

}