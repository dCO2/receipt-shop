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


const type: ElementType = "StoreLogoField";
const FontSize: {[key: number]: string} = {1: "text-xs", 2: "text-sm", 3: "text-base", 4: "text-lg"};

const extraAttributes = {
  value: "Placeholder Logo",
  fontSize: FontSize[2],
  helperText: "This is logo of the store. It will be displayed atop every factory and hence, receipt",
  required: true,
  placeHolder: "Upload Logo..."
}

const propertiesSchema = z.object({
  value: z.string().min(5).max(50),
  fontSize: z.string(),
});

export const StoreLogoFieldFactoryElement: FactoryElements = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  editorBtnElement: {
    icon: MdTextFields,
    label: "StoreLogo Field"
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
                Upload logo
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

function EditorComponent({elementInstance}: {elementInstance: FactoryElementInstance}){
  const element = elementInstance as CustomInstance;
  const { value, required, fontSize, placeHolder, helperText } = element.extraAttributes;
  console.log(fontSize);
  return (
    <div>
      <Label>
        <span className={cn(FontSize[parseInt(fontSize)])}>{value}</span>
        {required && "*"}
      </Label>
      {helperText && <p className="text-sm italic">{helperText}</p>}
    </div>
  );
}