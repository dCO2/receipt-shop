"use client"

import { ElementType, FactoryElementInstance, FactoryElements, printFunction } from "../FactoryElements"
import { MdTextFields } from "react-icons/md";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useEffect, useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import useEditor from "../hooks/useEditor";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { RxLetterCaseToggle } from "react-icons/rx";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const type: ElementType = "InvoiceTableField";
const FontSize: {[key: number]: string} = {1: "text-xs", 2: "text-sm", 3: "text-base", 4: "text-lg"};

const extraAttributes = {
  value: "",
  fontSize: FontSize[2],
  helperText: "user's purchases appear here",
  required: true,
  placeHolder: "insert table here"
}

const propertiesSchema = z.object({
  value: z.string().min(5).max(50),
  fontSize: z.string(),
});

export const InvoiceTableFieldFactoryElement: FactoryElements = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  editorBtnElement: {
    icon: MdTextFields,
    label: "InvoiceTable Field"
  },
  editorComponent: EditorComponent,
  factoryComponent: factoryComponent,
  propertiesComponent: PropertiesComponent,

  validate: (factoryElement: FactoryElementInstance, currentValue: string): boolean => {
    const element = factoryElement as CustomInstance;
    if (element.extraAttributes.required) {
      return currentValue.length > 0;
    }

    return true;
  },
};

type CustomInstance = FactoryElementInstance & {
  extraAttributes: typeof extraAttributes;
};

type propertiesSchemaType = z.infer<typeof propertiesSchema>;

function factoryComponent({elementInstance, printValue, isInvalid, defaultValue}:
  {elementInstance: FactoryElementInstance; printValue?: printFunction; isInvalid?: boolean; defaultValue?: string}){
  
  const element = elementInstance as CustomInstance;

  const { value } = element.extraAttributes;

  return (
    <div>
      <Label>
        {value}
      </Label>
    </div>
  );
}

function PropertiesComponent({elementInstance}: {elementInstance: FactoryElementInstance}){
  const element = elementInstance as CustomInstance;
  const {updateElement} = useEditor();

  const form = useForm<propertiesSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      value: element.extraAttributes.value,
      fontSize: element.extraAttributes.fontSize,
    }
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: propertiesSchemaType){
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        ...values,
      },
    });
  };

  ///

  const [inputs, setInputs] = useState([{ value: [] }]);
  
  // Function to handle adding a new input field
  const handleAddInput = () => {
    setInputs([...inputs, { value: [] }]);
  };

  // Function to handle input change
  const handleInputChange = (index: number, offset: number, event: ChangeEvent<HTMLInputElement>) => {
    const newInputs = [...inputs];
    newInputs[index].value[offset] = event.target.value;
    setInputs(newInputs);
  };

  return(
    <div>
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-3"
      >
        <div>
          {inputs.map((input, index) => (
            <div className="flex flex-row" key={index}>
              <Input 
                key={index}
                value={input.value[0]}
                onChange={(event) => handleInputChange(index, 0, event)}      
              />
              <Input 
                key={index+1}
                value={input.value[1]}
                onChange={(event) => handleInputChange(index, 1, event)}      
              />
              <Input 
                key={index+2}
                value={input.value[2]}
                onChange={(event) => handleInputChange(index, 2, event)}      
              />
            </div>
          ))}
          {/* Button to add new input field */}
          <button onClick={handleAddInput}>Add Input</button>
        </div>
      </form>
    </Form>
    </div>
  );
}

function EditorComponent({elementInstance}: {elementInstance: FactoryElementInstance}){
  const element = elementInstance as CustomInstance;
  const { value, required, fontSize, placeHolder, helperText } = element.extraAttributes;
  const { focusedElement, setFocusedElement } = useEditor(); // temporary solution

  return (
    <div
    onClick={(e) => {
      e.stopPropagation();
      setFocusedElement(element);
    }}>
      {helperText && <p className="text-sm italic">{helperText}</p>}
    </div>
  );
}