"use client"

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import { RxTrash } from "react-icons/rx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../ui/popover";
import { InventoryProduct, PurchasedItem } from "./useInvoiceTable";

interface InvoiceTableContentProps {
  inventory: InventoryProduct[];
  purchasedItems: PurchasedItem[];
  onProductSelect: (itemId: string, productName: string) => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onAddRow: (itemId: string) => void;
  onDeleteRow: (itemId: string) => void;
  readOnly?: boolean;
}

export function InvoiceTableContent({
  inventory,
  purchasedItems,
  onProductSelect,
  onQuantityChange,
  onAddRow,
  onDeleteRow,
  readOnly = false,
}: InvoiceTableContentProps) {
  if (inventory.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        Add products in properties first
      </p>
    );
  }

  return (
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
                {readOnly ? (
                  <span className="text-sm">{item.productName || "-"}</span>
                ) : (
                  <ProductCombobox
                    inventory={inventory}
                    value={item.productName}
                    onSelect={(productName) => onProductSelect(item.id, productName)}
                  />
                )}
              </td>
              <td className="p-2">
                {readOnly ? (
                  <span className="text-sm">{item.quantity}</span>
                ) : (
                  <Input
                    type="number"
                    min="0"
                    max={inventory.find(p => p.name === item.productName)?.quantity || 0}
                    value={item.quantity || ""}
                    onChange={(e) => onQuantityChange(item.id, parseInt(e.target.value) || 0)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-9 text-sm"
                    placeholder="0"
                  />
                )}
              </td>
              <td className="p-2 text-right">
                <div className="flex items-center justify-end gap-1">
                  <span className="text-sm font-medium">
                    ${item.totalPrice.toFixed(2)}
                  </span>
                  {!readOnly && (
                    <div className="flex gap-1">
                      {!item.isAdded && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddRow(item.id);
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
                            onDeleteRow(item.id);
                          }}
                          className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <RxTrash className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Combobox component for product selection
export function ProductCombobox({
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
