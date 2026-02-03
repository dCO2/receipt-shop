"use client"

import { ElementType, FactoryElementInstance, FactoryElements, printFunction } from "../FactoryElements"
import { MdTextFields } from "react-icons/md";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useEffect, useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import useEditor from "../hooks/useEditor";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { RxLetterCaseToggle } from "react-icons/rx";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { RxTrash } from "react-icons/rx";
import { Button } from "../ui/button";
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

const type: ElementType = "InvoiceTableField";
const FontSize: {[key: number]: string} = {1: "text-xs", 2: "text-sm", 3: "text-base", 4: "text-lg"};
const draggableInitialPos: Coordinates = {x: 0, y: 0};

// Define inventory product interface for clarity
interface InventoryProduct {
  name: string;
  price: number;
  quantity: number;
}

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

function EditorComponent({elementInstance}: {elementInstance: FactoryElementInstance}){
  const element = elementInstance as CustomInstance;
  const { value: inventory, required, fontSize, placeHolder, helperText, draggableInitialPos } = element.extraAttributes;
  const { focusedElement, setFocusedElement, updateElement } = useEditor();

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

  // State for purchased items (what the user is buying)
  const [purchasedItems, setPurchasedItems] = useState<Array<{
    id: string; 
    productName: string; 
    quantity: number; 
    totalPrice: number;
    isAdded: boolean;
  }>>([
    { id: "1", productName: "", quantity: 0, totalPrice: 0, isAdded: false }
  ]);

  const handleProductSelect = (itemId: string, productName: string) => {
    const product = inventory.find(p => p.name === productName);
    if (!product) return;

    setPurchasedItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, productName, totalPrice: Number(product.price) * item.quantity }
        : item
    ));
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setPurchasedItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const product = inventory.find(p => p.name === item.productName);
        const price = product ? Number(product.price) : 0;
        // Limit quantity to available inventory
        const maxQuantity = product ? product.quantity : 0;
        const validQuantity = Math.min(quantity, maxQuantity);
        return { ...item, quantity: validQuantity, totalPrice: price * validQuantity };
      }
      return item;
    }));
  };

  const handleAddRow = (itemId: string) => {
    // Mark current row as added and create new row
    setPurchasedItems(prev => [
      ...prev.map(item => 
        item.id === itemId ? { ...item, isAdded: true } : item
      ),
      {
        id: Math.random().toString(),
        productName: "",
        quantity: 0,
        totalPrice: 0,
        isAdded: false
      }
    ]);
  };

  const handleDeleteRow = (itemId: string) => {
    // Don't allow deleting if only one row remains
    if (purchasedItems.length === 1) return;
    
    setPurchasedItems(prev => prev.filter(item => item.id !== itemId));
  };

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
      
      // Apply bounds (keep element within viewport)
      const elementWidth = 400; // Fixed width from style
      const elementHeight = 500; // Approximate height
      const minX = 0;
      const minY = 0;
      const maxX = window.innerWidth - elementWidth;
      const maxY = window.innerHeight - elementHeight;
      
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
  }, [isDragging, dragStart, currentPos, element, updateElement]);

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
        
        {inventory.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          Add products in properties first
        </p>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-2 font-medium">Product Name</th>
                <th className="text-left p-2 w-24 font-medium">Quantity</th>
                <th className="text-right p-2 font-medium">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {purchasedItems.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="p-2">
                    <ProductCombobox
                      inventory={inventory}
                      value={item.productName}
                      onSelect={(productName) => handleProductSelect(item.id, productName)}
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      min="0"
                      max={inventory.find(p => p.name === item.productName)?.quantity || 0}
                      value={item.quantity || ""}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-9 text-sm"
                      placeholder="0"
                    />
                  </td>
                  <td className="p-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-sm font-medium">
                        ${item.totalPrice.toFixed(2)}
                      </span>
                      <div className="flex gap-1">
                        {!item.isAdded && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddRow(item.id);
                            }}
                            className="h-7 w-7 p-0"
                          >
                            <PlusIcon className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {purchasedItems.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRow(item.id);
                            }}
                            className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <RxTrash className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
}

// Combobox component for product selection
function ProductCombobox({
  inventory,
  value,
  onSelect,
}: {
  inventory: InventoryProduct[];
  value: string;
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          onClick={(e) => e.stopPropagation()}
          className="w-full justify-between h-9 text-sm font-normal"
        >
          {value || "product..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search product..." />
          <CommandList>
            <CommandEmpty>No product found.</CommandEmpty>
            <CommandGroup>
              {inventory.map((product) => (
                <CommandItem
                  key={product.name}
                  value={product.name}
                  onSelect={(currentValue) => {
                    onSelect(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === product.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span>{product.name}</span>
                  <span className="ml-auto text-muted-foreground text-xs">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}