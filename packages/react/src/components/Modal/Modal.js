/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { settings } from 'carbon-components';
import { Close20 } from '@carbon/icons-react';
import toggleClass from '../../tools/toggleClass';
import Button from '../Button';
import deprecate from '../../prop-types/deprecate';
import requiredIfGivenPropIsTruthy from '../../prop-types/requiredIfGivenPropIsTruthy';
import wrapFocus, {
  elementOrParentIsFloatingMenu,
} from '../../internal/wrapFocus';
import setupGetInstanceId from '../../tools/setupGetInstanceId';

const { prefix } = settings;
const getInstanceId = setupGetInstanceId();

export default class Modal extends Component {
  static propTypes = {
    /**
     * Provide the contents of your Modal
     */
    children: PropTypes.node,

    /**
     * Specify an optional className to be applied to the modal root node
     */
    className: PropTypes.string,

    /**
     * Specify whether the modal should be button-less
     */
    passiveModal: PropTypes.bool,

    /**
     * Provide whether the modal content has a form element.
     * If `true` is used here, non-form child content should have `bx--modal-content__regular-content` class.
     */
    hasForm: PropTypes.bool,

    /**
     * Specify a handler for closing modal.
     * The handler should care of closing modal, e.g. changing `open` prop.
     */
    onRequestClose: PropTypes.func,

    /**
     * Specify the DOM element ID of the top-level node.
     */
    id: PropTypes.string,

    /**
     * Specify the content of the modal header title.
     */
    modalHeading: PropTypes.node,

    /**
     * Specify the content of the modal header label.
     */
    modalLabel: PropTypes.node,

    /**
     * Specify a label to be read by screen readers on the modal root node
     */
    modalAriaLabel: PropTypes.string,

    /**
     * Specify the text for the secondary button
     */
    secondaryButtonText: PropTypes.node,

    /**
     * Specify the text for the primary button
     */
    primaryButtonText: PropTypes.node,

    /**
     * Specify whether the Modal is currently open
     */
    open: PropTypes.bool,

    /**
     * Specify a handler for "submitting" modal.
     * The handler should care of closing modal, e.g. changing `open` prop, if necessary.
     */
    onRequestSubmit: PropTypes.func,

    /**
     * Specify a handler for keypresses.
     */
    onKeyDown: PropTypes.func,

    /**
     * Provide a description for "close" icon that can be read by screen readers
     */
    iconDescription: PropTypes.string,

    /**
     * Specify whether the Button should be disabled, or not
     */
    primaryButtonDisabled: PropTypes.bool,

    /**
     * Specify a handler for the secondary button.
     * Useful if separate handler from `onRequestClose` is desirable
     */
    onSecondarySubmit: PropTypes.func,

    /**
     * Specify whether the Modal is for dangerous actions
     */
    danger: PropTypes.bool,

    /**
     * Specify whether the Modal is displaying an alert, error or warning
     * Should go hand in hand with the danger prop.
     */
    alert: PropTypes.bool,

    /**
     * Specify if Enter key should be used as "submit" action
     */
    shouldSubmitOnEnter: PropTypes.bool,

    /**
     * Specify CSS selectors that match DOM elements working as floating menus.
     * Focusing on those elements won't trigger "focus-wrap" behavior
     */
    selectorsFloatingMenus: PropTypes.arrayOf(PropTypes.string),

    /**
     * Specify a CSS selector that matches the DOM element that should
     * be focused when the Modal opens
     */
    selectorPrimaryFocus: PropTypes.string,

    /**
     * Specify the size variant.
     */
    size: PropTypes.oneOf(['xs', 'sm', 'lg']),

    /**
     * Deprecated; Used for advanced focus-wrapping feature using 3rd party library,
     * but it's now achieved without a 3rd party library.
     */
    focusTrap: deprecate(
      PropTypes.bool,
      `\nThe prop \`focusTrap\` for Modal has been deprecated, as the feature of \`focusTrap\` runs by default.`
    ),

    /**
     * Specify whether the modal contains scrolling content
     */
    hasScrollingContent: PropTypes.bool,

    /**
     * Required props for the accessibility label of the header
     */
    ['aria-label']: requiredIfGivenPropIsTruthy(
      'hasScrollingContent',
      PropTypes.string
    ),
  };

  static defaultProps = {
    onRequestClose: () => {},
    onRequestSubmit: () => {},
    primaryButtonDisabled: false,
    onKeyDown: () => {},
    passiveModal: false,
    iconDescription: 'Close',
    modalHeading: '',
    modalLabel: '',
    selectorPrimaryFocus: '[data-modal-primary-focus]',
    hasScrollingContent: false,
  };

  button = React.createRef();
  outerModal = React.createRef();
  innerModal = React.createRef();
  startTrap = React.createRef();
  endTrap = React.createRef();
  modalInstanceId = `modal-${getInstanceId()}`;
  modalLabelId = `${prefix}--modal-header__label--${this.modalInstanceId}`;
  modalHeadingId = `${prefix}--modal-header__heading--${this.modalInstanceId}`;
  modalBodyId = `${prefix}--modal-body--${this.modalInstanceId}`;

  handleKeyDown = (evt) => {
    if (this.props.open) {
      if (evt.which === 27) {
        this.props.onRequestClose(evt);
      }
      if (evt.which === 13 && this.props.shouldSubmitOnEnter) {
        this.props.onRequestSubmit(evt);
      }
    }
  };

  handleMousedown = (evt) => {
    if (
      this.innerModal.current &&
      !this.innerModal.current.contains(evt.target) &&
      !elementOrParentIsFloatingMenu(
        evt.target,
        this.props.selectorsFloatingMenus
      )
    ) {
      this.props.onRequestClose(evt);
    }
  };

  handleBlur = ({
    target: oldActiveNode,
    relatedTarget: currentActiveNode,
  }) => {
    const { open, selectorsFloatingMenus } = this.props;
    if (open && currentActiveNode && oldActiveNode) {
      const { current: modalNode } = this.innerModal;
      const { current: startTrapNode } = this.startTrap;
      const { current: endTrapNode } = this.endTrap;
      wrapFocus({
        modalNode,
        startTrapNode,
        endTrapNode,
        currentActiveNode,
        oldActiveNode,
        selectorsFloatingMenus,
      });
    }
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open) {
      this.beingOpen = true;
    } else if (prevProps.open && !this.props.open) {
      this.beingOpen = false;
    }
    toggleClass(
      document.body,
      `${prefix}--body--with-modal-open`,
      this.props.open
    );
  }

  initialFocus = (focusContainerElement) => {
    const containerElement = focusContainerElement || this.innerModal.current;
    const primaryFocusElement = containerElement
      ? containerElement.querySelector(this.props.selectorPrimaryFocus)
      : null;

    if (primaryFocusElement) {
      return primaryFocusElement;
    }

    return this.button && this.button.current;
  };

  focusButton = (focusContainerElement) => {
    const target = this.initialFocus(focusContainerElement);
    if (target) {
      target.focus();
    }
  };

  componentWillUnmount() {
    toggleClass(document.body, `${prefix}--body--with-modal-open`, false);
  }

  componentDidMount() {
    toggleClass(
      document.body,
      `${prefix}--body--with-modal-open`,
      this.props.open
    );
    if (!this.props.open) {
      return;
    }
    this.focusButton(this.innerModal.current);
  }

  handleTransitionEnd = (evt) => {
    if (
      evt.target === evt.currentTarget && // Not to handle `onTransitionEnd` on child DOM nodes
      this.outerModal.current &&
      this.outerModal.current.offsetWidth &&
      this.outerModal.current.offsetHeight &&
      this.beingOpen
    ) {
      this.focusButton(evt.currentTarget);
      this.beingOpen = false;
    }
  };

  render() {
    const {
      modalHeading,
      modalLabel,
      modalAriaLabel,
      passiveModal,
      hasForm,
      secondaryButtonText,
      primaryButtonText,
      open,
      onRequestClose,
      onRequestSubmit,
      onSecondarySubmit,
      iconDescription,
      primaryButtonDisabled,
      danger,
      alert,
      selectorPrimaryFocus, // eslint-disable-line
      selectorsFloatingMenus, // eslint-disable-line
      shouldSubmitOnEnter, // eslint-disable-line
      size,
      hasScrollingContent,
      ...other
    } = this.props;

    const onSecondaryButtonClick = onSecondarySubmit
      ? onSecondarySubmit
      : onRequestClose;

    const modalClasses = classNames({
      [`${prefix}--modal`]: true,
      [`${prefix}--modal-tall`]: !passiveModal,
      'is-visible': open,
      [`${prefix}--modal--danger`]: this.props.danger,
      [this.props.className]: this.props.className,
    });

    const containerClasses = classNames(`${prefix}--modal-container`, {
      [`${prefix}--modal-container--${size}`]: size,
    });

    const contentClasses = classNames(`${prefix}--modal-content`, {
      [`${prefix}--modal-content--with-form`]: hasForm,
      [`${prefix}--modal-scroll-content`]: hasScrollingContent,
    });

    const modalButton = (
      <button
        className={`${prefix}--modal-close`}
        type="button"
        onClick={onRequestClose}
        title={iconDescription}
        aria-label={iconDescription}
        ref={this.button}>
        <Close20
          aria-label={iconDescription}
          className={`${prefix}--modal-close__icon`}
        />
      </button>
    );

    const ariaLabel =
      modalLabel || this.props['aria-label'] || modalAriaLabel || modalHeading;
    const getAriaLabelledBy = modalLabel
      ? this.modalLabelId
      : this.modalHeadingId;

    const hasScrollingContentProps = hasScrollingContent
      ? {
          tabIndex: 0,
          role: 'region',
          'aria-label': ariaLabel,
          'aria-labelledby': getAriaLabelledBy,
        }
      : {};

    const alertDialogProps = alert
      ? {
          role: 'alertdialog',
          'aria-describedby': this.modalBodyId,
        }
      : {};

    const modalBody = (
      <div
        ref={this.innerModal}
        role="dialog"
        {...alertDialogProps}
        className={containerClasses}
        aria-label={ariaLabel}
        aria-modal="true"
        tabIndex="-1">
        <div className={`${prefix}--modal-header`}>
          {passiveModal && modalButton}
          {modalLabel && (
            <h2
              id={this.modalLabelId}
              className={`${prefix}--modal-header__label`}>
              {modalLabel}
            </h2>
          )}
          <h3
            id={this.modalHeadingId}
            className={`${prefix}--modal-header__heading`}>
            {modalHeading}
          </h3>
          {!passiveModal && modalButton}
        </div>
        <div
          id={this.modalBodyId}
          className={contentClasses}
          {...hasScrollingContentProps}
          aria-labelledby={getAriaLabelledBy}>
          {this.props.children}
        </div>
        {hasScrollingContent && (
          <div className={`${prefix}--modal-content--overflow-indicator`} />
        )}
        {!passiveModal && (
          <div className={`${prefix}--modal-footer`}>
            <Button kind="secondary" onClick={onSecondaryButtonClick}>
              {secondaryButtonText}
            </Button>
            <Button
              kind={danger ? 'danger' : 'primary'}
              disabled={primaryButtonDisabled}
              onClick={onRequestSubmit}
              ref={this.button}>
              {primaryButtonText}
            </Button>
          </div>
        )}
      </div>
    );

    return (
      <div
        {...other}
        onKeyDown={this.handleKeyDown}
        onMouseDown={this.handleMousedown}
        onBlur={this.handleBlur}
        className={modalClasses}
        role="presentation"
        onTransitionEnd={this.props.open ? this.handleTransitionEnd : undefined}
        ref={this.outerModal}>
        {/* Non-translatable: Focus-wrap code makes this `<span>` not actually read by screen readers */}
        <span
          ref={this.startTrap}
          tabIndex="0"
          role="link"
          className={`${prefix}--visually-hidden`}>
          Focus sentinel
        </span>
        {modalBody}
        {/* Non-translatable: Focus-wrap code makes this `<span>` not actually read by screen readers */}
        <span
          ref={this.endTrap}
          tabIndex="0"
          role="link"
          className={`${prefix}--visually-hidden`}>
          Focus sentinel
        </span>
      </div>
    );
  }
}
