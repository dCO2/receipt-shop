import React from "react";
import { StoreNameFieldFactoryElement } from "./receiptfields/StoreNameField";
import { StoreTelFieldFactoryElement } from "./receiptfields/StoreTelField";
import { StoreAddressFieldFactoryElement } from "./receiptfields/StoreAddressField";
import { StoreLogoFieldFactoryElement } from "./receiptfields/StoreLogo";
import { StoreEmailFieldFactoryElement } from "./receiptfields/StoreEmailField";
import { InvoiceTableFieldFactoryElement } from "./receiptfields/InvoiceTableField";

export type ElementType = "StoreNameField" | "StoreTelField" |
                          "StoreAddressField" | "StoreLogoField" | "StoreEmailField" |
                          "InvoiceTableField";

export type printFunction = (key: string, value: string) => void;

export type FactoryElements = {
  type: ElementType;

  construct: (id: string) => FactoryElementInstance;

  editorBtnElement: {
    icon: React.ElementType;
    label: string;
  }

  editorComponent: React.FC<{
    elementInstance: FactoryElementInstance;
    isInvalid?: boolean;
  }>;
  factoryComponent: React.FC<{
    elementInstance: FactoryElementInstance;
    printValue?: (key: string, value: string) => void;
    isInvalid?: boolean;
    defaultValue?: string;
    printMode?: boolean;
  }>;
  propertiesComponent: React.FC<{
    elementInstance: FactoryElementInstance;
  }>;

  validate: (factoryElement: FactoryElementInstance, currentValue: string) => boolean;
};

export type FactoryElementInstance = {
  id: string;
  type: ElementType;
  extraAttributes?: Record<string, any>;
}

export type FactoryElementType = {
  [key in ElementType]: FactoryElements
}

export type FactoryPaletteElementsType = {} | {
  [key in ElementType]: FactoryElements
}

export const FactoryElements: FactoryElementType = {
  StoreNameField: StoreNameFieldFactoryElement,
  StoreTelField: StoreTelFieldFactoryElement,
  StoreAddressField: StoreAddressFieldFactoryElement,
  StoreLogoField: StoreLogoFieldFactoryElement,
  StoreEmailField: StoreEmailFieldFactoryElement,
  InvoiceTableField: InvoiceTableFieldFactoryElement,
};

// Default placeholder values for each field type.
// Used to detect fields that have not been configured before publish.
const defaultPlaceholderValues: Record<ElementType, string> = {
  StoreNameField: "Input Store Name",
  StoreTelField: "Placeholder Contact",
  StoreAddressField: "Input Store Address",
  StoreEmailField: "type in email address",
  StoreLogoField: "upload logo",
  InvoiceTableField: "[]",
};

// Validates that all placed elements have been configured beyond their defaults.
// Returns the set of invalid element IDs.
export function validateElementsForPublish(
  elements: FactoryElementInstance[]
): Set<string> {
  const invalidIds = new Set<string>();

  for (const element of elements) {
    const placeholder = defaultPlaceholderValues[element.type];
    const currentValue = element.type === "InvoiceTableField"
      ? JSON.stringify(element.extraAttributes?.value ?? [])
      : String(element.extraAttributes?.value ?? "");

    if (currentValue === placeholder) {
      invalidIds.add(element.id);
    }
  }

  return invalidIds;
}
