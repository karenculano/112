/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { settings } from 'carbon-components';
import { keys, match } from '../../internal/keyboard';

import SelectableContextMenuOption from './SelectableContextMenuOption';
import ContextMenuRadioGroup from './ContextMenuRadioGroup';

const { prefix } = settings;

const contextMenuWidth = 208; // in px

const ContextMenu = function ContextMenu({
  children,
  open,
  level = 1,
  x = 0,
  y = 0,
  ...rest
}) {
  const rootRef = useRef(null);
  const [shouldReverse, setShouldReverse] = useState(false);

  function resetFocus() {
    Array.from(
      rootRef?.current?.querySelectorAll('[tabindex="0"]') ?? []
    ).forEach((node) => {
      node.tabIndex = -1;
    });
  }

  function focusNode(node, focus = true) {
    if (node) {
      resetFocus();
      node.tabIndex = 0;

      if (focus) {
        node.focus();
      }
    }
  }

  function getValidNodes(list) {
    const nodes = Array.from(list.childNodes ?? []).reduce((acc, child) => {
      if (child.tagName === 'LI') {
        return [...acc, child];
      }

      if (child.classList.contains(`${prefix}--context-menu-radio-group`)) {
        return [...acc, ...child.childNodes];
      }

      return acc;
    }, []);

    return nodes.filter((node) =>
      node.matches(
        `li.${prefix}--context-menu-option:not(.${prefix}--context-menu-option--disabled)`
      )
    );
  }

  function getNextNode(current, direction) {
    const nodes = getValidNodes(current.parentNode);
    const currentIndex = nodes.indexOf(current);

    const nextNode = nodes[currentIndex + direction];

    return nextNode?.firstChild || null;
  }

  function getFirstSubNode(node) {
    const submenu = node.querySelector(`ul.${prefix}--context-menu`);

    if (submenu) {
      const subnodes = getValidNodes(submenu);

      return subnodes[0]?.firstChild || null;
    }

    return null;
  }

  function getParentNode(node) {
    const parentNode = node.parentNode.closest(
      `li.${prefix}--context-menu-option`
    );

    return parentNode?.firstChild || null;
  }

  function handleKeyDown(event) {
    event.stopPropagation();

    const currentNode = event.target.parentNode;
    let nodeToFocus;

    if (match(event, keys.ArrowUp)) {
      nodeToFocus = getNextNode(currentNode, -1);
    } else if (match(event, keys.ArrowDown)) {
      nodeToFocus = getNextNode(currentNode, 1);
    } else if (match(event, keys.ArrowRight)) {
      nodeToFocus = getFirstSubNode(currentNode);
    } else if (match(event, keys.ArrowLeft)) {
      nodeToFocus = getParentNode(currentNode);
    }

    focusNode(nodeToFocus);

    if (rest.onKeyDown) {
      rest.onKeyDown(event);
    }
  }

  function willFit() {
    if (rootRef?.current) {
      const bodyWidth = document.body.clientWidth;

      const reverseMap = [...Array(level)].reduce(
        (acc) => {
          const endX = acc.lastX + contextMenuWidth * acc.direction;
          const fits =
            acc.direction === 1 ? endX < bodyWidth : endX > contextMenuWidth;

          const newDirection = fits ? acc.direction : acc.direction * -1;
          const newLastX = fits
            ? endX
            : acc.lastX + contextMenuWidth * newDirection;

          return {
            direction: newDirection,
            lastX: newLastX,
            map: [...acc.map, newDirection === 1],
          };
        },
        { direction: 1, lastX: x, map: [] }
      );

      return reverseMap.map[level - 1];
    }

    return true;
  }

  useEffect(() => {
    const topLevelNodes = getValidNodes(rootRef?.current);

    if (topLevelNodes && topLevelNodes.length > 0) {
      focusNode(topLevelNodes[0].firstChild, false);
    }

    setShouldReverse(!willFit());
  }, [open, x, y]); // eslint-disable-line react-hooks/exhaustive-deps

  const someNodesHaveIcons = React.Children.toArray(children).some(
    (node) =>
      node.props.renderIcon ||
      node.type === SelectableContextMenuOption ||
      node.type === ContextMenuRadioGroup
  );

  const options = React.Children.map(children, (node) => {
    if (React.isValidElement(node)) {
      return React.cloneElement(node, {
        indented: someNodesHaveIcons,
        level: level,
        menuX: x,
      });
    }
  });

  const classes = classnames(`${prefix}--context-menu`, {
    [`${prefix}--context-menu--open`]: open,
    [`${prefix}--context-menu--reverse`]: shouldReverse,
  });

  return (
    <ul
      ref={rootRef}
      className={classes}
      onKeyDown={handleKeyDown}
      data-level={level}
      style={open ? { left: `${x}px`, top: `${y}px` } : null}
      role="menu">
      {options}
    </ul>
  );
};

ContextMenu.propTypes = {
  /**
   * Specify the children of the ContextMenu
   */
  children: PropTypes.node,

  /**
   * Internal: keeps track of the nesting level of the menu
   */
  level: PropTypes.number,

  /**
   * Specify whether the ContextMenu is currently open
   */
  open: PropTypes.bool,

  /**
   * Specify the x position where this menu is rendered
   */
  x: PropTypes.number,

  /**
   * Specify the y position where this menu is rendered
   */
  y: PropTypes.number,
};

export default ContextMenu;
