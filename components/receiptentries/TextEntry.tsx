"use client"

import { ElementType, FactoryElements } from "../FactoryElements"
import { MdTextFields } from "react-icons/md";


const type: ElementType = "TextField"

export const TextEntryFactoryElement: FactoryElements = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes: {
      label: "Text Entry",
      helperText: "Helper Text",
      required: false,
      placeHolder: "Value here..."
    }
  }),
  editorBtnElement: {
    icon: MdTextFields,
    label: "Text Entry"
  },
  editorComponent: () => <div>Editor Component</div>,
  factoryComponent: () => <div>Factory Component</div>,
  propertiesComponent: () => <div>Properties Component</div>,
}