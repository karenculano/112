/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React, {
  useLayoutEffect,
  useState,
  ReactNode,
  useRef,
  ForwardedRef,
} from 'react';
import classNames from 'classnames';
import { Close } from '@carbon/icons-react';
import { useId } from '../../internal/useId';
import { usePrefix } from '../../internal/usePrefix';
import { PolymorphicProps } from '../../types/common';
import { Text } from '../Text';
import deprecate from '../../prop-types/deprecate';
import { DefinitionTooltip } from '../Tooltip';
import { isEllipsisActive } from './isEllipsisActive';
import { useMergeRefs } from '@floating-ui/react';

export const TYPES = {
  red: 'Red',
  magenta: 'Magenta',
  purple: 'Purple',
  blue: 'Blue',
  cyan: 'Cyan',
  teal: 'Teal',
  green: 'Green',
  gray: 'Gray',
  'cool-gray': 'Cool-Gray',
  'warm-gray': 'Warm-Gray',
  'high-contrast': 'High-Contrast',
  outline: 'Outline',
};

export const SIZES = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

export interface TagBaseProps {
  /**
   * Provide content to be rendered inside of a `Tag`
   */
  children?: React.ReactNode;

  /**
   * Provide a custom className that is applied to the containing <span>
   */
  className?: string;

  /**
   * Specify if the `Tag` is disabled
   */
  disabled?: boolean;

  /**
   * @deprecated The `filter` prop has been deprecated and will be removed in the next major version. Use DismissibleTag instead.
   */
  filter?: boolean;

  /**
   * Specify the id for the tag.
   */
  id?: string;

  /**
   * @deprecated The `onClose` prop has been deprecated and will be removed in the next major version. Use DismissibleTag instead.
   */
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Optional prop to render a custom icon.
   * Can be a React component class
   */
  renderIcon?: React.ElementType;

  /**
   * Specify the size of the Tag. Currently supports either `sm`,
   * `md` (default) or `lg` sizes.
   */
  size?: keyof typeof SIZES;

  /**
   * **Experimental:** Provide a `Slug` component to be rendered inside the `Tag` component
   */
  slug?: ReactNode;

  /**
   * @deprecated The `title` prop has been deprecated and will be removed in the next major version. Use DismissibleTag instead.
   */
  title?: string;

  /**
   * Specify the type of the `Tag`
   */
  type?: keyof typeof TYPES;
}

export type TagProps<T extends React.ElementType> = PolymorphicProps<
  T,
  TagBaseProps
>;

const Tag = React.forwardRef(function Tag<T extends React.ElementType>(
  {
    children,
    className,
    id,
    type,
    filter, // remove filter in next major release - V12
    renderIcon: CustomIconElement,
    title = 'Clear filter', // remove title in next major release - V12
    disabled,
    onClose, // remove onClose in next major release - V12
    size,
    as: BaseComponent,
    slug,
    ...other
  }: TagProps<T>,
  forwardRef: ForwardedRef<HTMLElement | undefined>
) {
  const prefix = usePrefix();
  const tagRef = useRef<HTMLElement>();
  const ref = useMergeRefs([forwardRef, tagRef]);
  const tagId = id || `tag-${useId()}`;
  const [isEllipsisApplied, setIsEllipsisApplied] = useState(false);

  useLayoutEffect(() => {
    const newElement = tagRef.current?.getElementsByClassName(
      `${prefix}--tag__label`
    )[0];
    setIsEllipsisApplied(isEllipsisActive(newElement));
  }, [prefix, tagRef]);

  const conditions = [
    `${prefix}--tag--selectable`,
    `${prefix}--tag--filter`,
    `${prefix}--tag--operational`,
  ];

  const isInteractiveTag = conditions.some((el) => className?.includes(el));

  const tagClasses = classNames(`${prefix}--tag`, className, {
    [`${prefix}--tag--disabled`]: disabled,
    [`${prefix}--tag--filter`]: filter,
    [`${prefix}--tag--${size}`]: size, // TODO: V12 - Remove this class
    [`${prefix}--layout--size-${size}`]: size,
    [`${prefix}--tag--${type}`]: type,
    [`${prefix}--tag--interactive`]:
      other.onClick && !isInteractiveTag && isEllipsisApplied,
  });

  const typeText =
    type !== undefined && type in Object.keys(TYPES) ? TYPES[type] : '';

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClose) {
      event.stopPropagation();
      onClose(event);
    }
  };

  // Slug is always size `md` and `inline`
  let normalizedSlug;
  if (slug && slug['type']?.displayName === 'AILabel') {
    normalizedSlug = React.cloneElement(slug as React.ReactElement<any>, {
      size: 'sm',
      kind: 'inline',
    });
  }

  if (filter) {
    const ComponentTag = (BaseComponent as React.ElementType) ?? 'div';
    return (
      <ComponentTag className={tagClasses} id={tagId} {...other}>
        {CustomIconElement && size !== 'sm' ? (
          <div className={`${prefix}--tag__custom-icon`}>
            <CustomIconElement />
          </div>
        ) : (
          ''
        )}

        <Text
          title={typeof children === 'string' ? children : undefined}
          className={`${prefix}--tag__label`}>
          {children !== null && children !== undefined ? children : typeText}
        </Text>
        {normalizedSlug}
        <button
          type="button"
          className={`${prefix}--tag__close-icon`}
          onClick={handleClose}
          disabled={disabled}
          aria-label={title}
          title={title}>
          <Close />
        </button>
      </ComponentTag>
    );
  }

  const ComponentTag =
    BaseComponent ??
    (other.onClick || className?.includes(`${prefix}--tag--operational`)
      ? 'button'
      : 'div');

  const labelClasses = classNames({
    [`${prefix}--tag__label`]: !isInteractiveTag,
  });

  return (
    <ComponentTag
      ref={ref}
      disabled={disabled}
      className={tagClasses}
      id={tagId}
      type={ComponentTag === 'button' ? 'button' : undefined}
      {...other}>
      {CustomIconElement && size !== 'sm' ? (
        <div className={`${prefix}--tag__custom-icon`}>
          <CustomIconElement />
        </div>
      ) : (
        ''
      )}
      {isEllipsisApplied && !isInteractiveTag ? (
        <DefinitionTooltip
          openOnHover={false}
          definition={
            children !== null && children !== undefined ? children : typeText
          }
          className={`${prefix}--definition--tooltip--tag`}>
          <Text
            title={
              children !== null &&
              children !== undefined &&
              typeof children === 'string'
                ? children
                : typeText
            }
            className={labelClasses}>
            {children !== null && children !== undefined ? children : typeText}
          </Text>
        </DefinitionTooltip>
      ) : (
        <Text
          title={
            children !== null &&
            children !== undefined &&
            typeof children === 'string'
              ? children
              : typeText
          }
          className={labelClasses}>
          {children !== null && children !== undefined ? children : typeText}
        </Text>
      )}
      {slug && (
        <div className={`${prefix}--tag--wrapper--slug`}>{normalizedSlug}</div>
      )}
    </ComponentTag>
  );
});

Tag.propTypes = {
  /**
   * Provide an alternative tag or component to use instead of the default
   * wrapping element
   */
  as: PropTypes.elementType,

  /**
   * Provide content to be rendered inside of a `Tag`
   */
  children: PropTypes.node,

  /**
   * Provide a custom className that is applied to the containing <span>
   */
  className: PropTypes.string,

  /**
   * Specify if the `Tag` is disabled
   */
  disabled: PropTypes.bool,

  /**
   * Determine if `Tag` is a filter/chip
   */
  filter: deprecate(
    PropTypes.bool,
    'The `filter` prop has been deprecated and will be removed in the next major version. Use DismissibleTag instead.'
  ),

  /**
   * Specify the id for the tag.
   */
  id: PropTypes.string,

  /**
   * Click handler for filter tag close button.
   */
  onClose: deprecate(
    PropTypes.func,
    'The `onClose` prop has been deprecated and will be removed in the next major version. Use DismissibleTag instead.'
  ),

  /**
   * Optional prop to render a custom icon.
   * Can be a React component class
   */
  renderIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),

  /**
   * Specify the size of the Tag. Currently supports either `sm`,
   * `md` (default) or `lg` sizes.
   */
  size: PropTypes.oneOf(Object.keys(SIZES)),

  /**
   * **Experimental:** Provide a `Slug` component to be rendered inside the `Tag` component
   */
  slug: PropTypes.node,

  /**
   * Text to show on clear filters
   */
  title: deprecate(
    PropTypes.string,
    'The `title` prop has been deprecated and will be removed in the next major version. Use DismissibleTag instead.'
  ),

  /**
   * Specify the type of the `Tag`
   */
  type: PropTypes.oneOf(Object.keys(TYPES)),
};

export const types = Object.keys(TYPES);
export default Tag;
