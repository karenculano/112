/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { BreadcrumbItem } from '../../Breadcrumb';

describe('BreadcrumbItem', () => {
  afterEach(cleanup);

  describe('Component API', () => {
    it('should accept a `ref` for the outermost node', () => {
      const ref = jest.fn(() => React.createRef());
      render(
        <BreadcrumbItem href="/test" ref={ref}>
          Test
        </BreadcrumbItem>
      );
      expect(ref).toHaveBeenCalled();
      expect(ref).toHaveBeenCalledWith(screen.getByRole('listitem'));
    });
  });
});
