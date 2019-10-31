/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { settings } from 'carbon-components';

const { prefix } = settings;

/**
 * `ListBoxMenuItem` is a helper component for managing the container class
 * name, alongside any classes for any corresponding states, for a generic list
 * box menu item.
 */
const ListBoxMenuItem = ({
  children,
  isActive,
  isHighlighted,
  isCategoryItem,
  ...rest
}) => {
  const className = cx({
    [`${prefix}--list-box__menu-item`]: true,
    [`${prefix}--list-box__menu-item--active`]: isActive,
    [`${prefix}--list-box__menu-item--highlighted`]: isHighlighted,
  });
  const optionClassName = cx({
    [`${prefix}--list-box__menu-item__option`]: true,
    [`${prefix}--list-box__menu-item__option--category`]: isCategoryItem,
  });
  return (
    <div className={className} role="option" aria-selected={isActive} {...rest}>
      <div className={optionClassName}>{children}</div>
    </div>
  );
};

ListBoxMenuItem.propTypes = {
  /**
   * Specify any children nodes that hsould be rendered inside of the ListBox
   * Menu Item
   */
  children: PropTypes.node,

  /**
   * Specify whether the current menu item is "active".
   */
  isActive: PropTypes.bool.isRequired,

  /**
   * Specify whether the current menu item is "highlighed".
   */
  isHighlighted: PropTypes.bool.isRequired,

  /**
   * Specify whether the current menu item is contained within a category.
   */
  isCategoryItem: PropTypes.bool,
};

ListBoxMenuItem.defaultProps = {
  isActive: false,
  isHighlighted: false,
  isCategoryItem: false,
};

export default ListBoxMenuItem;
