"use client"

import { useState, useCallback } from "react";

// Define inventory product interface
export interface InventoryProduct {
  name: string;
  price: number;
  quantity: number;
}

// Purchased item interface for user purchases
export interface PurchasedItem {
  id: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  isAdded: boolean;
}

// Initial empty purchased item
const createEmptyItem = (): PurchasedItem => ({
  id: Math.random().toString(),
  productName: "",
  quantity: 0,
  totalPrice: 0,
  isAdded: false,
});

interface UseInvoiceTableProps {
  inventory: InventoryProduct[];
  onChange?: (items: PurchasedItem[]) => void;
  initialItems?: PurchasedItem[];
  defaultValue?: string;
}

// Parse default value JSON string into PurchasedItem array
const parseDefaultValue = (defaultValue?: string): PurchasedItem[] | null => {
  if (!defaultValue) return null;
  try {
    const parsed = JSON.parse(defaultValue);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as PurchasedItem[];
    }
  } catch {
    // Invalid JSON, ignore
  }
  return null;
};

export function useInvoiceTable({ inventory, onChange, initialItems, defaultValue }: UseInvoiceTableProps) {
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>(() => {
    // Priority: defaultValue > initialItems > empty item
    const parsedDefault = parseDefaultValue(defaultValue);
    if (parsedDefault) return parsedDefault;
    if (initialItems) return initialItems;
    return [createEmptyItem()];
  });

  const handleProductSelect = useCallback((itemId: string, productName: string) => {
    const product = inventory.find(p => p.name === productName);
    if (!product) return;

    setPurchasedItems(prev => {
      const updated = prev.map(item =>
        item.id === itemId
          ? { ...item, productName, totalPrice: Number(product.price) * item.quantity }
          : item
      );
      onChange?.(updated);
      return updated;
    });
  }, [inventory, onChange]);

  const handleQuantityChange = useCallback((itemId: string, quantity: number) => {
    setPurchasedItems(prev => {
      const updated = prev.map(item => {
        if (item.id === itemId) {
          const product = inventory.find(p => p.name === item.productName);
          const price = product ? Number(product.price) : 0;
          // Limit quantity to available inventory
          const maxQuantity = product ? product.quantity : 0;
          const validQuantity = Math.min(quantity, maxQuantity);
          return { ...item, quantity: validQuantity, totalPrice: price * validQuantity };
        }
        return item;
      });
      onChange?.(updated);
      return updated;
    });
  }, [inventory, onChange]);

  const handleAddRow = useCallback((itemId: string) => {
    setPurchasedItems(prev => {
      const updated = [
        ...prev.map(item =>
          item.id === itemId ? { ...item, isAdded: true } : item
        ),
        createEmptyItem()
      ];
      onChange?.(updated);
      return updated;
    });
  }, [onChange]);

  const handleDeleteRow = useCallback((itemId: string) => {
    setPurchasedItems(prev => {
      // Don't allow deleting if only one row remains
      if (prev.length === 1) return prev;

      const updated = prev.filter(item => item.id !== itemId);
      onChange?.(updated);
      return updated;
    });
  }, [onChange]);

  return {
    purchasedItems,
    setPurchasedItems,
    handleProductSelect,
    handleQuantityChange,
    handleAddRow,
    handleDeleteRow,
  };
}
