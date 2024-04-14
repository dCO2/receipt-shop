import React from "react";
import { TextFieldFactoryElement } from "./receiptfields/TextField";
import { StoreNameFieldFactoryElement } from "./receiptfields/StoreNameField";
import { StoreTelFieldFactoryElement } from "./receiptfields/StoreTelField";
import { StoreAddressFieldFactoryElement } from "./receiptfields/StoreAddressField";
import { StoreLogoFieldFactoryElement } from "./receiptfields/StoreLogo";
import { StoreEmailFieldFactoryElement } from "./receiptfields/StoreEmailField";
import { InventoryFieldFactoryElement } from "./receiptfields/InventoryField";
import { InvoiceTableFieldFactoryElement } from "./receiptfields/InvoiceTableField";

export type ElementType = "TextField" | "StoreNameField" | "StoreTelField" |
                          "StoreAddressField" | "StoreLogoField" | "StoreEmailField" |
                          "InventoryField" | "InvoiceTableField";

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
  }>;
  factoryComponent: React.FC<{
    elementInstance: FactoryElementInstance;
    printValue?: (key: string, value: string) => void;
    isInvalid?: boolean;
    defaultValue?: string;
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
  TextField: TextFieldFactoryElement,
  StoreNameField: StoreNameFieldFactoryElement,
  StoreTelField: StoreTelFieldFactoryElement,
  StoreAddressField: StoreAddressFieldFactoryElement,
  StoreLogoField: StoreLogoFieldFactoryElement,
  StoreEmailField: StoreEmailFieldFactoryElement,
  InventoryField: InventoryFieldFactoryElement,
  InvoiceTableField: InvoiceTableFieldFactoryElement,
};
