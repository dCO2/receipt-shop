import React from "react";
import { TextFieldFactoryElement } from "./receiptfields/TextField";

export type ElementType = "TextField";
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

type FactoryElementType = {
  [key in ElementType]: FactoryElements
}

export const FactoryElements: FactoryElementType = {
  TextField: TextFieldFactoryElement
};