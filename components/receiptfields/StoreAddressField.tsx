"use client"

import { ElementType, FactoryElementInstance, FactoryElements, printFunction } from "../FactoryElements"
import { MdTextFields } from "react-icons/md";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import useEditor from "../hooks/useEditor";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import Draggables from "../Draggables";
import {
  restrictToFirstScrollableAncestor,
} from '@dnd-kit/modifiers';
import { Coordinates } from "@dnd-kit/core/dist/types";

const type: ElementType = "StoreAddressField";
const FontSize: {[key: number]: string} = {1: "text-xs", 2: "text-sm", 3: "text-base", 4: "text-lg"};
// const draggableInitialPos: {[key: string]: number} = {x:0,y:0}
const draggableInitialPos: Coordinates = {x:0,y:0}


const extraAttributes = {
  value: "Input Store Address",
  fontSize: FontSize[2],
  // yaxj: "sdoivn",
  helperText: "This is the address for the store. It will be displayed atop every factory and hence, receipt",
  required: true,
  placeHolder: "Type in address for store...",
  draggableInitialPos: draggableInitialPos
}

const posSchema = z.object({
  x: z.number(),
  y: z.number(),
})

const propertiesSchema = z.object({
  value: z.string().min(5).max(50),
  fontSize: z.string(),
  draggableInitialPos: posSchema,
});

export const StoreAddressFieldFactoryElement: FactoryElements = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  editorBtnElement: {
    icon: MdTextFields,
    label: "StoreAddress Field"
  },
  editorComponent: EditorComponent,
  factoryComponent: FactoryComponent,
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

function FactoryComponent({elementInstance, printValue, isInvalid, defaultValue}:
  {elementInstance: FactoryElementInstance; printValue?: printFunction; isInvalid?: boolean; defaultValue?: string}){
  
  const element = elementInstance as CustomInstance;
  const { value, fontSize, draggableInitialPos } = element.extraAttributes;

  const style = {
    transform: `translate(${draggableInitialPos?.x || 0}px, ${draggableInitialPos?.y || 0}px)`,
  };

  return (
    <div style={style}>
      <Label>
        <span className={cn(FontSize[parseInt(fontSize)], "whitespace-nowrap")}>{value}</span>
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
      draggableInitialPos: element.extraAttributes.draggableInitialPos,
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

  return(
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-3"
      >

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                This is name of the store. It will be displayed atop every factory and hence, receipt
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fontSize"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Choose font size...</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="1" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      text-xs
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="2" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      text-sm
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="3" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      text-base
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="4" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      text-lg
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

interface InnerLabelProps {
  value: string;
  required: boolean;
  fontSize: string;
}

const InnerLabel: React.FC<InnerLabelProps> = ({value, required, fontSize}: {value: string, required: boolean, fontSize: string}) => {
  return (
    <div
    >
      <Label>
        <span className={cn(FontSize[parseInt(fontSize)], "whitespace-nowrap")}>{value}</span>
        {required && "*"}
      </Label>
    </div>
  )
}

function EditorComponent({elementInstance}: {elementInstance: FactoryElementInstance}){
  const element = elementInstance as CustomInstance;
  // const { value, required, fontSize, placeHolder, helperText } = element.extraAttributes;
  // const { focusedElement, setFocusedElement } = useEditor();
  return (
    <div
    >
      <Draggables
        modifiers={[restrictToFirstScrollableAncestor]}
        key={3456}
        id={3456}
        pos={element.extraAttributes.draggableInitialPos}
        content={"faaer"}
        element={element}
      >
        {InnerLabel}
      </Draggables>
    </div>
  );
}