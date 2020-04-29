/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, useEffect, useRef } from 'react';
import { CaretDown16 } from '@carbon/icons-react';
import classNames from 'classnames';
import { settings } from 'carbon-components';
import { keys, match } from '../../internal/keyboard';

const { prefix } = settings;

export default function TreeNode({
  className,
  children,
  depth,
  isExpanded,
  label,
  onToggle,
  renderIcon: Icon,
  selected,
  ...rest
}) {
  const [expanded, setExpanded] = useState(isExpanded);
  const handleToggleClick = event => {
    setExpanded(!expanded);
    onToggle && onToggle(event, { isExpanded: !expanded });
  };
  const currentNode = useRef(null);
  const nodesWithProps = React.Children.map(children, node => {
    if (React.isValidElement(node)) {
      return React.cloneElement(node, { depth: depth + 1 });
    }
  });
  const treeNodeClasses = classNames(className, `${prefix}--tree-node`, {
    [`${prefix}--tree-node--selected`]: selected,
    [`${prefix}--tree-node--with-icon`]: Icon,
    [`${prefix}--tree-leaf-node`]: !children,
    [`${prefix}--tree-parent-node`]: children,
  });
  const toggleClasses = classNames(`${prefix}--tree-parent-node__toggle-icon`, {
    [`${prefix}--tree-parent-node__toggle-icon--expanded`]: expanded,
  });
  const handleKeyDown = event => {
    event.stopPropagation();

    if (children && match(event, keys.ArrowLeft)) {
      setExpanded(false);
    }
    if (children && match(event, keys.ArrowRight)) {
      setExpanded(true);
    }
    if (rest.onKeyDown) {
      rest.onKeyDown(event);
    }
  };

  useEffect(() => {
    /**
     * Negative margin shifts node to align with the left side boundary of the
     * tree
     * Dynamically calculate padding to recreate tree node indentation
     * - parent nodes have (depth + 1rem) left padding
     * - leaf nodes have (depth + 2.5rem) left padding without icons (because
     *   of expando icon + spacing)
     * - leaf nodes have (depth + 2rem) left padding with icons (because of
     *   reduced spacing between the expando icon and the node icon + label)
     */
    const calcOffset = () => {
      // parent node
      if (children) {
        return depth + 1;
      }
      // leaf node with icon
      if (Icon) {
        return depth + 2;
      }
      // leaf node without icon
      return depth + 2.5;
    };
    const currentNodeLabel = currentNode.current.querySelector(
      `.${prefix}--tree-node__label`
    );
    currentNodeLabel.style.marginLeft = `-${calcOffset()}rem`;
    currentNodeLabel.style.paddingLeft = `${calcOffset()}rem`;

    // sync props and state
    setExpanded(isExpanded);
  }, [children, depth, Icon, isExpanded]);

  if (!children) {
    return (
      <li
        {...rest}
        className={treeNodeClasses}
        onKeyDown={handleKeyDown}
        ref={currentNode}
        role="treeitem"
        tabIndex="-1">
        <div className={`${prefix}--tree-node__label`}>
          {Icon && <Icon className={`${prefix}--tree-node__icon`} />}
          {label}
        </div>
      </li>
    );
  }
  return (
    <li
      {...rest}
      aria-expanded={isExpanded}
      className={treeNodeClasses}
      onKeyDown={handleKeyDown}
      ref={currentNode}
      role="treeitem"
      tabIndex="-1">
      <div className={`${prefix}--tree-node__label`}>
        <button
          className={`${prefix}--tree-parent-node__toggle`}
          onClick={handleToggleClick}>
          <CaretDown16 className={toggleClasses} />
        </button>
        <span className={`${prefix}--tree-node__label__details`}>
          {Icon && <Icon className={`${prefix}--tree-node__icon`} />}
          {label}
        </span>
      </div>
      {expanded && (
        <ul role="group" className={`${prefix}--tree-node__children`}>
          {nodesWithProps}
        </ul>
      )}
    </li>
  );
}
