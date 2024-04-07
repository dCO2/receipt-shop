import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  DndContext,
  useDraggable,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  PointerActivationConstraint,
  Modifiers,
  useSensors,
} from '@dnd-kit/core';
import type {Coordinates} from '@dnd-kit/utilities';

import Wrapper from './Wrapper/Wrapper';
import { Draggable } from './Draggable';
import { FactoryElementInstance } from './FactoryElements';

const defaultCoordinates = {
  x: 0,
  y: 0,
};

type DraggablesType = React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLButtonElement>>;
type DraggablesArrType = DraggablesType[];

// type CustomInstance = FactoryElementInstance & {
//   extraAttributes: typeof extraAttributes;
// };

interface InnerLabelProps {
  value: string;
  required: boolean;
  fontSize: string;
}

interface Props {
  activationConstraint?: PointerActivationConstraint;
  // axis?: Axis;
  handle?: boolean;
  modifiers?: Modifiers;
  buttonStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  label?: string;
  pos?: Coordinates | (() => Coordinates);
  content?: string;
  id: number;
  // value: string; 
  // required: boolean;
  // fontSize: string;
  // children: React.FC<InnerLabelProps>;

  element: FactoryElementInstance;
  children: React.FC<InnerLabelProps>;
}

function Draggables({
  activationConstraint,
  // axis,
  handle,
  label = 'Go ahead, drag me.',
  modifiers,
  style,
  buttonStyle,
  pos=defaultCoordinates,
  content="defauulttext",
  id,
  // value,
  // required,
  // fontSize,
  element,
  children,
}: Props) {
  const [{x, y}, setCoordinates] = useState<Coordinates>(pos);
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint,
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint,
  });
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={({delta}) => {
        setCoordinates(({x, y}) => {
          return {
            x: x + delta.x,
            y: y + delta.y,
          };
        });
      }}
      modifiers={modifiers}
    >
      <Wrapper>
        <DraggableItem
          // axis={axis}
          label={label}
          handle={handle}
          top={y}
          left={x}
          style={style}
          buttonStyle={buttonStyle}
          id={id}
          content={content}
        // value={value}
        // required={required}
        // fontSize={fontSize}
        element={element}
          
        >
          {children}
        </DraggableItem>
      </Wrapper>
    </DndContext>
  );
}

interface DraggableItemProps {
  label: string;
  handle?: boolean;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  // axis?: Axis;
  top?: number;
  left?: number;
  content?: string;
  id: number;
  // value: string; 
  // required: boolean;
  // fontSize: string;
  element: FactoryElementInstance;
  children: React.FC<InnerLabelProps>;
}

function DraggableItem({
  // axis,
  label,
  style,
  top,
  left,
  handle,
  buttonStyle,
  content,
  id,
  // value,
  // required,
  // fontSize,
  element,
  children,
}: DraggableItemProps) {
  const {attributes, isDragging, listeners, setNodeRef, transform} =
    useDraggable({
      id: 'draggable',
    });

  return (
    <div>
    <Draggable
      ref={setNodeRef}
      dragging={isDragging}
      handle={handle}
      label={label}
      listeners={listeners}
      style={{...style, top, left}}
      buttonStyle={buttonStyle}
      transform={transform}
      // axis={axis}
      id={id}
      content={content}
      {...attributes}
      // value={value}
      // required={required}
      // fontSize={fontSize}
      element={element}
    >
      {children}
    </Draggable>
    </div>
  );
}

export default Draggables