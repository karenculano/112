/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { expect, test } = require('@playwright/test');
const { visitStory } = require('../../test-utils/storybook');

test.describe('DataTable @avt', () => {
  test.describe('basic', () => {
    test('default has no accessibility-checker violations', async ({
      page,
    }) => {
      await visitStory(page, {
        component: 'DataTable',
        id: 'components-datatable-basic--default',
        globals: {
          theme: 'white',
        },
      });
      await expect(page).toHaveNoACViolations(
        'components-datatable-basic--default'
      );
    });
    test('xl with two lines has no accessibility-checker violations', async ({
      page,
    }) => {
      await visitStory(page, {
        component: 'DataTable',
        id: 'components-datatable-basic--xl-with-two-lines',
        globals: {
          theme: 'white',
        },
      });
      await expect(page).toHaveNoACViolations(
        'components-datatable-basic--xl-with-two-lines'
      );
    });
  });

  test.describe('batch actions', () => {
    test('default has no accessibility-checker violations', async ({
      page,
    }) => {
      await visitStory(page, {
        component: 'DataTable',
        id: 'components-datatable-batch-actions--default',
        globals: {
          theme: 'white',
        },
      });
      await expect(page).toHaveNoACViolations(
        'components-datatable-batch-actions--default'
      );
    });
  });

  test.describe('dynamic', () => {
    test('default has no accessibility-checker violations', async ({
      page,
    }) => {
      await visitStory(page, {
        component: 'DataTable',
        id: 'components-datatable-dynamic--default',
        globals: {
          theme: 'white',
        },
      });
      await expect(page).toHaveNoACViolations(
        'components-datatable-dynamic--default'
      );
    });
  });

  test.describe('expansion', () => {
    test('default has no accessibility-checker violations', async ({
      page,
    }) => {
      await visitStory(page, {
        component: 'DataTable',
        id: 'components-datatable-expansion--default',
        globals: {
          theme: 'white',
        },
      });
      await expect(page).toHaveNoACViolations(
        'components-datatable-expansion--default'
      );
    });
    test('batch expansion has no accessibility-checker violations', async ({
      page,
    }) => {
      await visitStory(page, {
        component: 'DataTable',
        id: 'components-datatable-expansion--batch-expansion',
        globals: {
          theme: 'white',
        },
      });
      await expect(page).toHaveNoACViolations(
        'components-datatable-expansion--batch-expansion'
      );
    });
  });

  test.describe('filtering', () => {
    test('default has no accessibility-checker violations', async ({
      page,
    }) => {
      await visitStory(page, {
        component: 'DataTable',
        id: 'components-datatable-filtering--default',
        globals: {
          theme: 'white',
        },
      });
      await expect(page).toHaveNoACViolations(
        'components-datatable-filtering--default'
      );
    });
  });

  test.describe('selection', () => {
    test('default has no accessibility-checker violations', async ({
      page,
    }) => {
      await visitStory(page, {
        component: 'DataTable',
        id: 'components-datatable-selection--default',
        globals: {
          theme: 'white',
        },
      });
      await expect(page).toHaveNoACViolations(
        'components-datatable-selection--default'
      );
    });
    test('with-radio-expansion has no accessibility-checker violations', async ({
      page,
    }) => {
      await visitStory(page, {
        component: 'DataTable',
        id: 'components-datatable-selection--with-radio-expansion',
        globals: {
          theme: 'white',
        },
      });
      await expect(page).toHaveNoACViolations(
        'components-datatable-selection--with-radio-expansion'
      );
    });
    test('with-selection-and-sorting has no accessibility-checker violations', async ({
      page,
    }) => {
      await visitStory(page, {
        component: 'DataTable',
        id: 'components-datatable-selection--with-selection-and-sorting',
        globals: {
          theme: 'white',
        },
      });
      await expect(page).toHaveNoACViolations(
        'components-datatable-selection--with-selection-and-sorting'
      );
    });
  });

  test.describe('skeleton', () => {
    test('skeleton has no accessibility-checker violations', async ({
      page,
    }) => {
      await visitStory(page, {
        component: 'DataTable',
        id: 'components-datatable-skeleton--skeleton',
        globals: {
          theme: 'white',
        },
      });
      await expect(page).toHaveNoACViolations(
        'components-datatable-skeleton--skeleton'
      );
    });
  });

  test.describe('sorting', () => {
    test('default has no accessibility-checker violations', async ({
      page,
    }) => {
      await visitStory(page, {
        component: 'DataTable',
        id: 'components-datatable-sorting--default',
        globals: {
          theme: 'white',
        },
      });
      await expect(page).toHaveNoACViolations(
        'components-datatable-sorting--default'
      );
    });
  });

  test.describe('toolbar', () => {
    test('default has no accessibility-checker violations', async ({
      page,
    }) => {
      await visitStory(page, {
        component: 'DataTable',
        id: 'components-datatable-toolbar--default',
        globals: {
          theme: 'white',
        },
      });
      await expect(page).toHaveNoACViolations(
        'components-datatable-toolbar--default'
      );
    });
    test('persistent-toolbar has no accessibility-checker violations', async ({
      page,
    }) => {
      await visitStory(page, {
        component: 'DataTable',
        id: 'components-datatable-toolbar--persistent-toolbar',
        globals: {
          theme: 'white',
        },
      });
      await expect(page).toHaveNoACViolations(
        'components-datatable-toolbar--persistent-toolbar'
      );
    });
    test('small-persistent-toolbar has no accessibility-checker violations', async ({
      page,
    }) => {
      await visitStory(page, {
        component: 'DataTable',
        id: 'components-datatable-toolbar--small-persistent-toolbar',
        globals: {
          theme: 'white',
        },
      });
      await expect(page).toHaveNoACViolations(
        'components-datatable-toolbar--small-persistent-toolbar'
      );
    });
    test('with-overflow-menu has no accessibility-checker violations', async ({
      page,
    }) => {
      await visitStory(page, {
        component: 'DataTable',
        id: 'components-datatable-toolbar--with-overflow-menu',
        globals: {
          theme: 'white',
        },
      });
      await expect(page).toHaveNoACViolations(
        'components-datatable-toolbar--with-overflow-menu'
      );
    });
  });
});
