"use client"

import { ElementType, FactoryElementInstance, FactoryElements } from "../FactoryElements"
import { MdTextFields } from "react-icons/md";
import { Label } from "../ui/label";
import { Input } from "../ui/input";


const type: ElementType = "TextField"

const extraAttributes = {
  label: "Text Entry",
  helperText: "Helper Text",
  required: false,
  placeHolder: "Type text here..."
}

export const TextEntryFactoryElement: FactoryElements = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  editorBtnElement: {
    icon: MdTextFields,
    label: "Text Entry"
  },
  editorComponent: EditorComponent,
  factoryComponent: () => <div>Factory Component</div>,
  propertiesComponent: PropertiesComponent,
};

type CustomInstance = FactoryElementInstance & {
  extraAttributes: typeof extraAttributes;
};

function PropertiesComponent({elementInstance}: {elementInstance: FactoryElementInstance}){
  const element = elementInstance as CustomInstance;

  return(
    <div>
      Factory Properties for {element?.extraAttributes?.label}
    </div>
  );
}

function EditorComponent({elementInstance}: {elementInstance: FactoryElementInstance}){
  const element = elementInstance as CustomInstance;
  const { label, required, placeHolder, helperText } = element.extraAttributes;
  return (
    <div>
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Input readOnly disabled placeholder={placeHolder}/>
      {helperText && <p>{helperText}</p>}
    </div>
  );
}