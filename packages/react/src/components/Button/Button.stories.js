/**
 * Copyright IBM Corp. 2016, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { action } from '@storybook/addon-actions';
import { Add } from '@carbon/icons-react';
import { default as Button, ButtonSkeleton } from '../Button';
import ButtonSet from '../ButtonSet';
import mdx from './Button.mdx';
import './button-story.scss';
import { WithDisplayBox } from '../../../.storybook/templates/WithDisplayBox';
import {
  fluidButtonLabels,
  fluidButtonMapping,
  fluidButtonOptions,
} from './__story__/fluid-button-set-args';

export default {
  title: 'Components/Button',
  component: Button,
  subcomponents: {
    ButtonSet,
    ButtonSkeleton,
  },
  argTypes: {
    kind: {
      options: [
        'primary',
        'secondary',
        'tertiary',
        'ghost',
        'danger',
        'danger--tertiary',
        'danger--ghost',
      ],
      control: { type: 'select' },
    },
    size: {
      options: ['sm', 'md', 'lg', 'xl', '2xl'],
      control: { type: 'select' },
    },
    children: {
      control: false,
    },
    renderIcon: {
      control: false,
    },
    as: {
      control: false,
    },
    small: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
};

export const Default = (args) => {
  return <Button {...args}>Button</Button>;
};

export const Secondary = (args) => {
  return (
    <Button kind="secondary" {...args}>
      Button
    </Button>
  );
};

export const Tertiary = (args) => {
  return (
    <Button kind="tertiary" {...args}>
      Button
    </Button>
  );
};

export const Danger = (args) => {
  return (
    <>
      <Button kind="danger" {...args}>
        Button
      </Button>
      &nbsp;
      <Button kind="danger--tertiary" {...args}>
        Tertiary Danger Button
      </Button>
      &nbsp;
      <Button kind="danger--ghost" {...args}>
        Ghost Danger Button
      </Button>
    </>
  );
};

export const Ghost = (args) => {
  return (
    <Button kind="ghost" {...args}>
      Button
    </Button>
  );
};

export const IconButton = (args) => (
  <Button
    renderIcon={Add}
    iconDescription="Icon Description"
    hasIconOnly
    onClick={action('onClick')}
    {...args}
  />
);

export const SetOfButtons = (args) => {
  return (
    <ButtonSet>
      <Button kind="secondary" {...args}>
        Secondary button
      </Button>
      <Button kind="primary" {...args}>
        Primary button
      </Button>
    </ButtonSet>
  );
};

export const Skeleton = () => (
  <div>
    <ButtonSkeleton />
    &nbsp;
    <ButtonSkeleton size="sm" />
  </div>
);

export const SetOfButtonsFluid = {
  parameters: {
    controls: {
      include: ['Fluid Buttons', 'Stacked'],
    },
  },
  argTypes: {
    'Fluid Buttons': {
      control: {
        type: 'select',
        labels: fluidButtonLabels,
      },
      options: fluidButtonOptions,
      mapping: fluidButtonMapping,
    },
  },
  render: ({ ...rest }) => {
    const buttons = rest['Fluid Buttons'];

    if (!buttons || buttons === 0) {
      return <div>Select one or more buttons.</div>;
    }

    return (
      <WithDisplayBox>
        <ButtonSet fluid>
          {buttons.map(({ label, kind, key }) => (
            <Button key={key} kind={kind}>
              {label}
            </Button>
          ))}
        </ButtonSet>
      </WithDisplayBox>
    );
  },
};

SetOfButtonsFluid.args = {
  'Fluid Buttons': 1,
};
