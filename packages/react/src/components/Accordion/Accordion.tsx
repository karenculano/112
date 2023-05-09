/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cx from 'classnames';
import { usePrefix } from '../../internal/usePrefix';
import PropTypes from 'prop-types';
import React, { PropsWithChildren } from 'react';
import * as FeatureFlags from '@carbon/feature-flags';
import { AccordionProvider } from './AccordionProvider';

interface AccordionProps {
  /**
   * Specify the alignment of the accordion heading
   * title and chevron. Defaults to `end`.
   */
  align?: 'start' | 'end';

  /**
   * Specify an optional className to be applied to
   * the container node.
   */
  className?: string;

  /**
   * Specify whether an individual AccordionItem
   * should be disabled.
   */
  disabled?: boolean;

  /**
   * Specify whether Accordion text should be flush,
   * default is `false`, does not work with `align="start"`.
   */
  isFlush?: boolean;

  /**
   * Specify the size of the Accordion. Currently
   * supports the following: `sm`, `md`, `lg`
   */
  size?: 'sm' | 'md' | 'lg';
}

interface AccordionV10Props extends Omit<AccordionProps, 'size'> {
  /**
   * Specify the size of the Accordion. Currently
   * supports the following: `sm`, `md`, `lg`, `xl`.
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Accordion = ({
  align = 'end',
  children,
  className: customClassName,
  disabled = false,
  isFlush = false,
  size = 'md',
  ...rest
}: PropsWithChildren<AccordionProps | AccordionV10Props>) => {
  const prefix = usePrefix();
  const className = cx(`${prefix}--accordion`, customClassName, {
    [`${prefix}--accordion--${align}`]: align,
    [`${prefix}--accordion--${size}`]: size,
    [`${prefix}--accordion--flush`]: isFlush && align !== 'start',
  });
  return (
    <AccordionProvider disabled={disabled}>
      <ul className={className} {...rest}>
        {children}
      </ul>
    </AccordionProvider>
  );
};

Accordion.propTypes = {
  /**
   * Specify the alignment of the accordion heading title and chevron.
   */
  align: PropTypes.oneOf(['start', 'end']),

  /**
   * Pass in the children that will be rendered within the Accordion
   */
  children: PropTypes.node,

  /**
   * Specify an optional className to be applied to the container node
   */
  className: PropTypes.string,

  /**
   * Specify whether an individual AccordionItem should be disabled
   */
  disabled: PropTypes.bool,

  /**
   * Specify whether Accordion text should be flush, default is false, does not work with align="start"
   */
  isFlush: PropTypes.bool,

  /**
   * Specify the size of the Accordion. Currently supports the following:
   */
  size: FeatureFlags.enabled('enable-v11-release')
    ? PropTypes.oneOf(['sm', 'md', 'lg'])
    : PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
};

export default Accordion;
