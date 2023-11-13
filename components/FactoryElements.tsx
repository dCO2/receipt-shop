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

  editorComponent: React.FC;
  factoryComponent: React.FC;
  propertiesComponent: React.FC;

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