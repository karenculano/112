/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import classNames from 'classnames';
import { settings } from 'carbon-components';

const { prefix } = settings;

export default function TreeView({ children, className, ...rest }) {
  const nodesWithProps = React.Children.map(children, node => {
    if (React.isValidElement(node)) {
      return React.cloneElement(node, { depth: 0 });
    }
  });
  const treeClasses = classNames(className, `${prefix}--tree`);
  return (
    <ul className={treeClasses} role="tree" {...rest}>
      {nodesWithProps}
    </ul>
  );
}
