/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { settings } from 'carbon-components';
import { match } from '../../tools/key';

const { prefix } = settings;

const Switch = props => {
  const {
    className,
    index,
    name,
    onClick,
    onKeyDown,
    selected,
    text,
    ...other
  } = props;

  const tabRef = useRef();

  useEffect(() => {
    selected && tabRef.current.focus();
  });

  const handleClick = e => {
    e.preventDefault();
    onClick({ index, name, text });
  };

  const handleKeyDown = e => {
    const key = e.key || e.which;

    if (match(key, 'ArrowRight')) {
      onKeyDown({ index, name, text, key });
    }
    if (match(key, 'ArrowLeft')) {
      onKeyDown({ index, name, text, key });
    }
  };

  const classes = classNames(className, `${prefix}--content-switcher-btn`, {
    [`${prefix}--content-switcher--selected`]: selected,
  });

  const commonProps = {
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    className: classes,
  };

  return (
    <button
      ref={tabRef}
      role="tab"
      tabIndex={selected ? '0' : '-1'}
      aria-selected={selected}
      {...other}
      {...commonProps}>
      <span className={`${prefix}--content-switcher__label`}>{text}</span>
    </button>
  );
};

Switch.propTypes = {
  /**
   * Specify an optional className to be added to your Switch
   */
  className: PropTypes.string,

  /**
   * The index of your Switch in your ContentSwitcher that is used for event handlers.
   * Reserved for usage in ContentSwitcher
   */
  index: PropTypes.number,

  /**
   * Provide the name of your Switch that is used for event handlers
   */
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * A handler that is invoked when a user clicks on the control.
   * Reserved for usage in ContentSwitcher
   */
  onClick: PropTypes.func,

  /**
   * A handler that is invoked on the key down event for the control.
   * Reserved for usage in ContentSwitcher
   */
  onKeyDown: PropTypes.func,

  /**
   * Whether your Switch is selected. Reserved for usage in ContentSwitcher
   */
  selected: PropTypes.bool,

  /**
   * Provide the contents of your Switch
   */
  text: PropTypes.string.isRequired,
};

Switch.defaultProps = {
  selected: false,
  text: 'Provide text',
  onClick: () => {},
  onKeyDown: () => {},
};

export default Switch;
