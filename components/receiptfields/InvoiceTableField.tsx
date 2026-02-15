"use client"

import { ElementType, FactoryElementInstance, FactoryElements, printFunction } from "../FactoryElements"
import { MdTextFields } from "react-icons/md";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useRef } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import useEditor from "../hooks/useEditor";
import { cn } from "@/lib/utils";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { RxTrash } from "react-icons/rx";
import { Button } from "../ui/button";
import { useInvoiceTable, InventoryProduct, PurchasedItem } from "./shared/useInvoiceTable";
import { InvoiceTableContent } from "./shared/InvoiceTableContent";

const type: ElementType = "InvoiceTableField";
const draggableInitialPos: Coordinates = {x: 0, y: 0};

const extraAttributes = {
  value: [] as InventoryProduct[],
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

  const style: React.CSSProperties = {
    position: 'absolute',
    transform: `translate(${draggableInitialPos?.x || 0}px, ${draggableInitialPos?.y || 0}px)`,
    width: '400px',
  };

  return (
    <div
      style={style}
      className={cn(
        "bg-background",
        isInvalid && "ring-2 ring-destructive"
      )}
    >
      <div>
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

  // Remove product row and save
  const handleRemoveProduct = (index: number) => {
    remove(index);
    // Schedule save after React processes the removal
    setTimeout(() => {
      saveCurrentValues();
    }, 0);
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
              <p className="text-xs text-muted-foreground italic text-center p-4">No products added yet. Click &quot;Add Product&quot; to start.</p>
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
                  onClick={() => handleRemoveProduct(index)}
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
        </form>
      </Form>
    </div>
  );
}

function EditorComponent({elementInstance, isInvalid}: {elementInstance: FactoryElementInstance; isInvalid?: boolean}){
  const element = elementInstance as CustomInstance;
  const { value: inventory, required, placeHolder, helperText, draggableInitialPos } = element.extraAttributes;
  const { focusedElement, setFocusedElement, updateElement, editorRef } = useEditor();

  // Backward compatibility: handle old factories with posX/posY or undefined position
  const initialPos = draggableInitialPos || { x: 0, y: 0 };

  // Simple drag state
  const [isDragging, setIsDragging] = useState(false);
  const [currentPos, setCurrentPos] = useState(initialPos);
  const [dragStartMouse, setDragStartMouse] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

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
    // Store absolute mouse position and element position at drag start
    setDragStartMouse({ x: e.clientX, y: e.clientY });
    setDragStartPos(currentPos);
    setFocusedElement(element);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate delta from drag start
      const deltaX = e.clientX - dragStartMouse.x;
      const deltaY = e.clientY - dragStartMouse.y;
      
      // New position = start position + delta
      let newX = dragStartPos.x + deltaX;
      let newY = dragStartPos.y + deltaY;
      
      // Get element dimensions
      const elementWidth = elementRef.current?.offsetWidth || 400;
      const elementHeight = elementRef.current?.offsetHeight || 200;
      
      // Apply bounds using editor area dimensions (400x600)
      const editorWidth = 400;
      const editorHeight = 600;
      
      const minX = 0;
      const minY = 0;
      const maxX = Math.max(0, editorWidth - elementWidth);
      const maxY = Math.max(0, editorHeight - elementHeight);
      
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
  }, [isDragging, dragStartMouse, dragStartPos, currentPos, element, updateElement]);

  const style: React.CSSProperties = {
    position: 'absolute',
    transform: `translate(${currentPos.x}px, ${currentPos.y}px)`,
    width: '400px',
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      ref={elementRef}
      style={style}
      className="bg-background border-2 border-primary/20 rounded-lg"
    >
      {/* Drag Handle - positioned above the content */}
      <div
        onMouseDown={handleMouseDown}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
        className="absolute -top-9 left-0 right-0 flex items-center gap-2 px-3 py-2 bg-muted/50 border-2 border-b-0 border-primary/20 rounded-t-lg cursor-grab active:cursor-grabbing hover:bg-muted transition-colors select-none touch-none"
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
      <div>
        <InvoiceTableContent
          inventory={inventory}
          purchasedItems={purchasedItems}
          onProductSelect={handleProductSelect}
          onQuantityChange={handleQuantityChange}
          onAddRow={handleAddRow}
          onDeleteRow={handleDeleteRow}
        />
        
        {/* Total row preview */}
        <div className="mt-3 pt-3 border-t flex justify-between items-center text-muted-foreground">
          <span className="font-medium">Total:</span>
          <span className="font-bold text-lg">$--</span>
        </div>
        
        {isInvalid && <p className="text-xs text-destructive mt-2 px-3">Add at least one product to the inventory</p>}
      </div>
    </div>
  );
}