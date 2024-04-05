import React, {forwardRef, useCallback, useState} from 'react';
import classNames from 'classnames';
import type {DraggableSyntheticListeners} from '@dnd-kit/core';
import type {Transform} from '@dnd-kit/utilities';

import styles from './Draggable.module.css';

export enum Axis {
  All,
  Vertical,
  Horizontal,
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
}

export const Draggable = forwardRef<HTMLButtonElement, Props>(
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
      ...props
    },
    ref
  ) {
    
    return (
      <div className='border border-solid border-red-400'>
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
        <button
          {...props}
          aria-label="Draggable"
          data-cypress="draggable-item"
          {...(handle ? {} : listeners)}
          tabIndex={handle ? -1 : undefined}
          ref={ref}
          style={buttonStyle}
        >
          <p className="text-white">holla! this should be a text frame...</p>
        </button>
      </div>
      <div 
        className={classNames('border border-solid border-green-400',
          styles.Draggable,
          styles.textframe
        )}
              style={
                {
                  ...style,
                  '--translate-x': `${transform?.x !== undefined ? 0 + transform?.x : 0}px`,
                  '--translate-y': `${transform?.y !== undefined ? 54 + transform?.y : 54}px`,
                } as React.CSSProperties
              }
        >
      </div>
      </div>
    );
  }
);
