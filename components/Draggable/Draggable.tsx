import React, {forwardRef, useCallback, useState} from 'react';
import classNames from 'classnames';
import type {DraggableSyntheticListeners} from '@dnd-kit/core';
import type {Transform} from '@dnd-kit/utilities';

import styles from './Draggable.module.css';
import { FactoryElementInstance } from '../FactoryElements';
import useEditor from '../hooks/useEditor';

export enum Axis {
  All,
  Vertical,
  Horizontal,
}

interface InnerLabelProps {
  value: string;
  required: boolean;
  fontSize: string;
}

interface Props {
  axis?: Axis;
  dragOverlay?: boolean;
  dragging?: boolean;
  handle?: boolean;
  label?: string;
  listeners?: DraggableSyntheticListeners;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  transform?: Transform | null;
  content?: string;
  id: number;
  // value: string; 
  // required: boolean;
  // fontSize: string;
  // children: React.FC<InnerLabelProps>;

  element: FactoryElementInstance;
  children: React.FC<InnerLabelProps>;

}

export const Draggable = forwardRef<HTMLDivElement, Props>(
  function Draggable(
    {
      axis,
      dragOverlay,
      dragging,
      handle,
      label,
      listeners,
      transform,
      style,
      buttonStyle,
      content,
      id,
      // value,
      // required,
      // fontSize,
      element,
      children,
      ...props
    },
    ref
  ) {
    const InnerLabel = children
    const { value, required, fontSize, placeHolder, helperText } = element.extraAttributes;
    const { focusedElement, setFocusedElement } = useEditor();

    
    return (
      // this root div has a style of static, i.e., isn't moved when the draggable is moved
      <div
        className={classNames('border border-solid border-red-400',
          styles.Draggable,
          dragOverlay && styles.dragOverlay,
          dragging && styles.dragging,
          handle && styles.handle
        )}
        style={
          {
            ...style,
            '--translate-x': `${transform?.x ?? 0}px`,
            '--translate-y': `${transform?.y ?? 0}px`,
          } as React.CSSProperties
        }
      >
        <div
          {...props}
          aria-label="Draggable"
          data-cypress="draggable-item"
          {...(handle ? {} : listeners)}
          tabIndex={handle ? -1 : undefined}
          ref={ref}
          style={buttonStyle}

          onClick={(e) => {
            e.stopPropagation();
            setFocusedElement(element);
          }}
        >

          <InnerLabel
            // value={value}
            // required={required}
            // fontSize={fontSize}
            value={value}
            required={required}
            fontSize={fontSize}
          />
        </div>
      </div>
    );
  }
);
