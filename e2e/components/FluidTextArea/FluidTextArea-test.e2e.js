/**
 * Copyright IBM Corp. 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { expect, test } = require('@playwright/test');
const { themes } = require('../../test-utils/env');
const { snapshotStory, visitStory } = require('../../test-utils/storybook');

test.describe('FluidTextArea', () => {
  themes.forEach((theme) => {
    test.describe(theme, () => {
      test('fluid textarea @vrt', async ({ page }) => {
        await snapshotStory(page, {
          component: 'FluidTextArea',
          id: 'experimental-unstable-fluidtextarea--default',
          theme,
        });
      });

      test('fluid textarea playground @vrt', async ({ page }) => {
        await snapshotStory(page, {
          component: 'FluidTextArea',
          id: 'experimental-unstable-fluidtextarea--playground',
          theme,
        });
      });
    });
  });

  test('accessibility-checker @avt', async ({ page }) => {
    await visitStory(page, {
      component: 'FluidTextArea',
      id: 'experimental-unstable-fluidtextarea--default',
      globals: {
        theme: 'white',
      },
    });
    await expect(page).toHaveNoACViolations('FluidTextArea');
  });
});
