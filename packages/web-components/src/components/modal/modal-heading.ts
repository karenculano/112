/**
 * @license
 *
 * Copyright IBM Corp. 2019, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { LitElement, html } from 'lit';
import { prefix } from '../../globals/settings';
import styles from './modal.scss?lit';
import { carbonElement as customElement } from '../../globals/decorators/carbon-element';

/**
 * Modal heading.
 *
 * @element cds-modal-heading
 */
@customElement(`${prefix}-modal-heading`)
class CDSModalHeading extends LitElement {
  render() {
    return html` <slot></slot> `;
  }

  static styles = styles; // `styles` here is a `CSSResult` generated by custom Vite loader
}

export default CDSModalHeading;
