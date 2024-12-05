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
// const iterableNull: Iterable<never> = [];

const extraAttributes = {
  value: [],
  fontSize: FontSize[2],
  helperText: "user's purchases appear here",
  required: true,
  placeHolder: "insert table here"
}

const dictionarySchema = z.object({
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
});

const arrdictSchema = z.array(dictionarySchema);
type arrdictSchemaType = z.infer<typeof arrdictSchema>;

const propertiesSchema = z.object({
  value: arrdictSchema,
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
        {value[0]['name']}
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

  const [inputs, setInputs] = useState<arrdictSchemaType>(element.extraAttributes.value);
  
  // Function to handle adding a new input field
  const handleAddInput = () => {
    setInputs([...inputs, { name: null, price: null, quantity: null, }]);
  };
  
  const handleEnterInput = () => {
    // setInputs([...inputs, { value: [] }]);
    const attr = {
      value: inputs,
      FontSize: element.extraAttributes.fontSize,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      placeHolder: element.extraAttributes.placeHolder,
    };

    applyChanges(attr);
    
  };

  // Function to handle input change
  const handleInputChange = (index: number, offset: string, event: ChangeEvent<HTMLInputElement>) => {
    const newInputs = [...inputs];
    newInputs[index][offset] = event.target.value;
    setInputs(newInputs);
  };

  return(
    <div>
    <Form {...form}>
      <form
        onBlur={handleEnterInput}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-3"
      >
        <div>
          {inputs?.map((input, index) => (
            <div className="flex flex-row" key={index}>
              <Input 
                key={index}
                value={input['name']}
                placeholder={'name'}
                onChange={(event) => handleInputChange(index, 'name', event)}      
              />
              <Input 
                key={index+1}
                value={input['price']}
                placeholder={'price'}
                onChange={(event) => handleInputChange(index, 'price', event)}      
              />
              <Input 
                key={index+2}
                value={input['quantity']}
                placeholder={'quantity'}
                onChange={(event) => handleInputChange(index, 'quantity', event)}      
              />
            </div>
          ))}
          <div className="flex flex-row justify-between">
            {/* Button to add new input field */}
            <button onClick={handleAddInput}>Add Product</button>
            <button onClick={handleEnterInput}>Enter All</button>
          </div>
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