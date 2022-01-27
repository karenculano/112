/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Rewrites imports from 'carbon-components-react' to '@carbon/react'
 *
 * Transforms:
 *
 * import { Button } from 'carbon-components-react';
 * import { Tile, Tooltip } from 'carbon-components-react';
 * import CodeSnippet from 'carbon-components-react';
 *
 * Into:
 *
 * import { Button } from "@carbon/react";
 * import { Tile, Tooltip } from "@carbon/react";
 * import CodeSnippet from "@carbon/react";
 */

export const parser = 'babel';

export default function transformer(file, api) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.ImportDeclaration, {
      source: {
        value: 'carbon-components-react',
      },
    })
    .forEach((path) => {
      path.get('source').replaceWith(j.stringLiteral('@carbon/react'));
    })
    .toSource();
}
