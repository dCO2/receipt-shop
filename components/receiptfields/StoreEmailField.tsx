"use client"

import { ElementType, FactoryElementInstance, FactoryElements, printFunction } from "../FactoryElements"
import { MdTextFields } from "react-icons/md";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import useEditor from "../hooks/useEditor";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { RxLetterCaseToggle } from "react-icons/rx";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import Draggables from "../Draggables";
import {
  restrictToFirstScrollableAncestor,
} from '@dnd-kit/modifiers';
import { Coordinates } from "@dnd-kit/core/dist/types";

const type: ElementType = "StoreEmailField";
const FontSize: {[key: number]: string} = {1: "text-xs", 2: "text-sm", 3: "text-base", 4: "text-lg"};
const draggableInitialPos: Coordinates = {x:0,y:0}

const extraAttributes = {
  value: "type in email address",
  fontSize: FontSize[2],
  helperText: "This is the email address for the store. It will be displayed atop every factory and hence, receipt",
  required: true,
  placeHolder: "Type in email for store...",
  draggableInitialPos: draggableInitialPos
}

const propertiesSchema = z.object({
  value: z.string().min(5).max(50),
  fontSize: z.string(),
});

export const StoreEmailFieldFactoryElement: FactoryElements = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  editorBtnElement: {
    icon: MdTextFields,
    label: "StoreEmail Field"
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
    <div>
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
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              {/* <FormDescription>
                This is email of the store. It will be displayed atop every factory and hence, receipt
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fontSize"
          render={({ field }) => (
            <Tabs
              onValueChange={(value) => {
                field.onChange(value);
                const currentValues = form.getValues();
                applyChanges({ ...currentValues, fontSize: value });
              }}
              defaultValue={field.value}
              className="flex flex-row space-y-1 list-image-none"
            >
              <TabsList>
                <TabsTrigger value="1">
                  <RxLetterCaseToggle className="w-3 h-3" />
                </TabsTrigger>
                <TabsTrigger value="2">
                  <RxLetterCaseToggle className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="3">
                  <RxLetterCaseToggle className="w-5 h-5" />
                </TabsTrigger>
                <TabsTrigger value="4">
                  <RxLetterCaseToggle className="w-6 h-6" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        />

        {/* <Tabs
          className="flex flex-row space-y-1 list-image-none"
        >
          <TabsList className="border">
            <TabsTrigger value="1">
              <RxLetterCaseToggle className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs> */}
        {/* <FormField
          control={form.control}
          name="fontSize"
          render={({ field }) => (
          )}
        /> */}
      </form>
    </Form>
    </div>
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

function EditorComponent({elementInstance, isInvalid}: {elementInstance: FactoryElementInstance; isInvalid?: boolean}){
  const element = elementInstance as CustomInstance;
  return (
    <div
    >
      <Draggables
        modifiers={[restrictToFirstScrollableAncestor]}
        key={3456}
        id={3456}
        pos={element.extraAttributes.draggableInitialPos}
        content={"faaer"}
        // value={value}
        // required={required}
        // fontSize={fontSize}
        element={element}
      >
        {InnerLabel}
      </Draggables>
      {isInvalid && <p className="text-xs text-destructive mt-1">This field is required</p>}
    </div>
  );
}