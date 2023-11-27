import React from "react";
import { TextEntryFactoryElement } from "./receiptentries/TextEntry";

export type ElementType = "TextField";

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
  }>;
  propertiesComponent: React.FC<{
    elementInstance: FactoryElementInstance;
  }>;

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
  TextField: TextEntryFactoryElement
};