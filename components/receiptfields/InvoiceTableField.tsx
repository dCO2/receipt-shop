"use client"

import { ElementType, FactoryElementInstance, FactoryElements, printFunction } from "../FactoryElements"
import { MdTextFields } from "react-icons/md";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import useEditor from "../hooks/useEditor";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { RxTrash } from "react-icons/rx";
import { Button } from "../ui/button";
import { useInvoiceTable, InventoryProduct, PurchasedItem } from "./shared/useInvoiceTable";
import { InvoiceTableContent } from "./shared/InvoiceTableContent";

const type: ElementType = "InvoiceTableField";
const FontSize: {[key: number]: string} = {1: "text-xs", 2: "text-sm", 3: "text-base", 4: "text-lg"};
const draggableInitialPos: Coordinates = {x: 0, y: 0};

const extraAttributes = {
  value: [] as InventoryProduct[],
  fontSize: FontSize[2],
  helperText: "user's purchases appear here",
  required: true,
  placeHolder: "insert table here",
  draggableInitialPos: draggableInitialPos
}

// Zod schema for individual product with proper validation
const inventoryProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
});

// Schema for complete properties including all extraAttributes
const propertiesSchema = z.object({
  value: z.array(inventoryProductSchema),
  fontSize: z.string(),
  helperText: z.string(),
  required: z.boolean(),
  placeHolder: z.string(),
  draggableInitialPos: z.object({
    x: z.number(),
    y: z.number(),
  }),
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
  factoryComponent: FactoryComponent,
  propertiesComponent: PropertiesComponent,

  validate: (factoryElement: FactoryElementInstance, currentValue: string): boolean => {
    // Validate that every product row has a selected product with quantity > 0
    try {
      const items: PurchasedItem[] = JSON.parse(currentValue || "[]");
      return items.length > 0 && items.every(item => item.productName && item.quantity > 0);
    } catch {
      return false;
    }
  },
};

type CustomInstance = FactoryElementInstance & {
  extraAttributes: typeof extraAttributes;
};

type propertiesSchemaType = z.infer<typeof propertiesSchema>;

function FactoryComponent({elementInstance, printValue, isInvalid, defaultValue, printMode, clearError}:
  {elementInstance: FactoryElementInstance; printValue?: printFunction; isInvalid?: boolean; defaultValue?: string; printMode?: boolean; clearError?: (key: string) => void}){
  
  const element = elementInstance as CustomInstance;
  const { value: inventory, draggableInitialPos } = element.extraAttributes;
  
  const {
    purchasedItems,
    handleProductSelect,
    handleQuantityChange,
    handleAddRow,
    handleDeleteRow,
  } = useInvoiceTable({
    inventory,
    defaultValue,
    onChange: (items) => {
      // Report value changes for printing
      printValue?.(element.id, JSON.stringify(items));
      // Clear validation error on user interaction
      clearError?.(element.id);
    },
  });

  // Calculate total
  const total = purchasedItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const style = {
    transform: `translate(${draggableInitialPos?.x || 0}px, ${draggableInitialPos?.y || 0}px)`,
    width: '400px',
  };

  return (
    <div
      style={style}
      className={cn(
        "bg-background border rounded-lg p-3",
        isInvalid && "border-destructive"
      )}
    >
      <InvoiceTableContent
        inventory={inventory}
        purchasedItems={purchasedItems}
        onProductSelect={handleProductSelect}
        onQuantityChange={handleQuantityChange}
        onAddRow={handleAddRow}
        onDeleteRow={handleDeleteRow}
        readOnly={printMode}
      />
      
      {/* Total */}
      <div className="mt-3 pt-3 border-t flex justify-between items-center">
        <span className="font-medium">Total:</span>
        <span className="font-bold text-lg">${total.toFixed(2)}</span>
      </div>
      
      {isInvalid && (
        <p className="text-xs text-destructive mt-2">All product rows must have a selected product with quantity greater than zero</p>
      )}
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
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      placeHolder: element.extraAttributes.placeHolder,
      draggableInitialPos: element.extraAttributes.draggableInitialPos,
    }
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  // useFieldArray for managing dynamic inventory rows
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "value",
  });

  function applyChanges(values: propertiesSchemaType){
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        ...values,
      },
    });
  };

  // Save current form values without validation (for auto-save on blur)
  const saveCurrentValues = () => {
    const currentValues = form.getValues();
    updateElement(element.id, {
      ...element,
      extraAttributes: currentValues,
    });
  };

  // Add new empty product row
  const handleAddProduct = () => {
    append({ name: "", price: 0, quantity: 1 });
  };

  return(
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="space-y-3"
        >
          {/* Inventory Products Table */}
          <div className="space-y-2">
            <Label>Inventory Products</Label>
            
            {/* Table Headers */}
            {fields.length > 0 && (
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Product Name</Label>
                </div>
                <div className="w-24">
                  <Label className="text-xs text-muted-foreground">Price</Label>
                </div>
                <div className="w-20">
                  <Label className="text-xs text-muted-foreground">Quantity</Label>
                </div>
                <div className="w-10" /> {/* Spacer for delete button */}
              </div>
            )}
            
            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No products added yet. Click &quot;Add Product&quot; to start.</p>
            )}
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                {/* Product Name Field */}
                <FormField
                  control={form.control}
                  name={`value.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Product name"
                          onBlur={(e) => {
                            field.onBlur();
                            saveCurrentValues();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") e.currentTarget.blur();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Price Field */}
                <FormField
                  control={form.control}
                  name={`value.${index}.price`}
                  render={({ field }) => (
                    <FormItem className="w-24">
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Price"
                          onBlur={(e) => {
                            field.onBlur();
                            saveCurrentValues();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") e.currentTarget.blur();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Quantity Field */}
                <FormField
                  control={form.control}
                  name={`value.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem className="w-20">
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="1"
                          placeholder="Qty"
                          onBlur={(e) => {
                            field.onBlur();
                            saveCurrentValues();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") e.currentTarget.blur();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Delete Row Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="h-10 w-10"
                >
                  <RxTrash className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {/* Add Product Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddProduct}
              className="w-full"
            >
              Add Product
            </Button>
          </div>

          {/* Font Size Selector */}
          <FormField
            control={form.control}
            name="fontSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Font Size</FormLabel>
                <FormControl>
                  <Tabs {...field} onValueChange={field.onChange}>
                    <TabsList className="grid w-full grid-cols-4">
                      {Object.entries(FontSize).map(([key, value]) => (
                        <TabsTrigger key={key} value={value}>
                          {key}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}

function EditorComponent({elementInstance, isInvalid}: {elementInstance: FactoryElementInstance; isInvalid?: boolean}){
  const element = elementInstance as CustomInstance;
  const { value: inventory, required, fontSize, placeHolder, helperText, draggableInitialPos } = element.extraAttributes;
  const { focusedElement, setFocusedElement, updateElement, editorRef } = useEditor();

  // Backward compatibility: handle old factories with posX/posY or undefined position
  const initialPos = draggableInitialPos || { x: 0, y: 0 };

  // Simple drag state
  const [isDragging, setIsDragging] = useState(false);
  const [currentPos, setCurrentPos] = useState(initialPos);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Update current position when element changes
  useEffect(() => {
    setCurrentPos(draggableInitialPos || { x: 0, y: 0 });
  }, [draggableInitialPos]);

  // Use shared hook for purchased items management
  const {
    purchasedItems,
    handleProductSelect,
    handleQuantityChange,
    handleAddRow,
    handleDeleteRow,
  } = useInvoiceTable({ inventory });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX - currentPos.x, y: e.clientY - currentPos.y });
    setFocusedElement(element);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate new position
      let newX = e.clientX - dragStart.x;
      let newY = e.clientY - dragStart.y;
      
      // Apply bounds
      const elementWidth = 400; // Fixed width from style
      const elementHeight = 500; // Approximate height
      const minX = 0;
      const minY = 0;
      let maxX = window.innerWidth - elementWidth;
      const maxY = window.innerHeight - elementHeight;

      // Use editor bounds for X if available
      if (editorRef?.current) {
        const editorRect = editorRef.current.getBoundingClientRect();
        maxX = editorRect.width - elementWidth;
      }
      
      newX = Math.max(minX, Math.min(newX, maxX));
      newY = Math.max(minY, Math.min(newY, maxY));
      
      setCurrentPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Save position on drag end
      updateElement(element.id, {
        ...element,
        extraAttributes: {
          ...element.extraAttributes,
          draggableInitialPos: currentPos,
        },
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, currentPos, element, updateElement, editorRef]);

  const style = {
    transform: `translate(${currentPos.x}px, ${currentPos.y}px)`,
    width: '400px',
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      style={style}
      className="bg-background border-2 border-primary/20 rounded-lg"
    >
      {/* Drag Handle */}
      <div
        onMouseDown={handleMouseDown}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
        className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-t-lg cursor-grab active:cursor-grabbing hover:bg-muted transition-colors select-none touch-none"
      >
        <div className="flex flex-col gap-0.5">
          <div className="w-4 h-0.5 bg-muted-foreground/50 rounded"></div>
          <div className="w-4 h-0.5 bg-muted-foreground/50 rounded"></div>
          <div className="w-4 h-0.5 bg-muted-foreground/50 rounded"></div>
        </div>
        <p className="text-xs text-muted-foreground font-medium flex-1">Invoice Table</p>
        {isDragging && <span className="text-xs text-primary">●</span>}
      </div>

      {/* Content Area */}
      <div className="p-3">
        {helperText && <p className="text-xs text-muted-foreground mb-2">{helperText}</p>}
        
        <InvoiceTableContent
          inventory={inventory}
          purchasedItems={purchasedItems}
          onProductSelect={handleProductSelect}
          onQuantityChange={handleQuantityChange}
          onAddRow={handleAddRow}
          onDeleteRow={handleDeleteRow}
        />
        {isInvalid && <p className="text-xs text-destructive mt-2">Add at least one product to the inventory</p>}
      </div>
    </div>
  );
}