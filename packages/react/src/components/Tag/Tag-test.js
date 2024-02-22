/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Add } from '@carbon/icons-react';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Tag from './';
import DismissibleTag from './DismissibleTag';
import OperationalTag from './OperationalTag';
import SelectableTag from './SelectableTag';

describe('Tag', () => {
  describe('automated accessibility testing', () => {
    it('should have no Axe violations', async () => {
      const { container } = render(<Tag type="red">test-tag</Tag>);
      await expect(container).toHaveNoAxeViolations();
    });

    it('should have no Axe violations DismissibleTag', async () => {
      const { container } = render(
        <DismissibleTag type="red">test-tag</DismissibleTag>
      );
      await expect(container).toHaveNoAxeViolations();
    });

    it('should have no Axe violations OperationalTag', async () => {
      const { container } = render(
        <OperationalTag type="red">test-tag</OperationalTag>
      );
      await expect(container).toHaveNoAxeViolations();
    });

    it('should have no Axe violations SelectableTag', async () => {
      const { container } = render(
        <SelectableTag type="red">test-tag</SelectableTag>
      );
      await expect(container).toHaveNoAxeViolations();
    });

    it('should have no AC violations', async () => {
      const { container } = render(
        <main>
          <Tag type="red">Dog</Tag>
        </main>
      );
      await expect(container).toHaveNoACViolations('Tag');
    });
  });

  it('should have an appropriate aria-label when (filterable)', () => {
    const children = 'tag-3';
    const { container } = render(
      <DismissibleTag type="red" title="Close tag">
        {children}
      </DismissibleTag>
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const button = container.querySelector('[aria-label]');
    const accessibilityLabel = button.getAttribute('aria-label');
    // This check would mirror our "Accessibility label must contain at least all of visible label"
    // requirement
    expect(accessibilityLabel).toEqual(expect.stringContaining('Close tag'));
  });

  it('should allow for a custom label', () => {
    render(<Tag type="red">Johnny Ramone</Tag>);
    expect(screen.getByText('Johnny Ramone')).toBeInTheDocument();
  });

  it('should allow for a custom icon', () => {
    render(
      <Tag type="red" renderIcon={() => <Add data-testid="test" />}>
        Dee Dee Ramone
      </Tag>
    );

    expect(screen.getByTestId('test')).toBeInTheDocument();
  });
});
