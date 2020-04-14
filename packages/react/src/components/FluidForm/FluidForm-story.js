/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { withKnobs } from '@storybook/addon-knobs';
import FluidForm from '../FluidForm';
import FormGroup from '../FormGroup';
import Button from '../Button';

import TextInput from '../TextInput';

const additionalProps = {
  className: 'some-class',
  onSubmit: e => {
    e.preventDefault();
    action('FormSubmitted')(e);
  },
};

const TextInputProps = {
  className: 'some-class',
  id: 'test2',
  labelText: 'Text Input label',
  placeholder: 'Placeholder text',
};

const PasswordProps = {
  className: 'some-class',
  id: 'test3',
  labelText: 'Password',
};

const InvalidPasswordProps = {
  className: 'some-class',
  id: 'test4',
  labelText: 'Password',
  invalid: true,
  invalidText:
    'Your password must be at least 6 characters as well as contain at least one uppercase, one lowercase, and one number.',
};

const buttonEvents = {
  className: 'some-class',
};

storiesOf('FluidForm', module)
  .addDecorator(withKnobs)
  .add(
    'Default',
    () => (
      <FluidForm {...additionalProps}>
        <FormGroup>
          <TextInput {...TextInputProps} />

          <TextInput
            type="password"
            required
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
            {...PasswordProps}
          />
        </FormGroup>

        <TextInput
          type="password"
          required
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
          {...InvalidPasswordProps}
        />

        <Button type="submit" className="some-class" {...buttonEvents}>
          Submit
        </Button>
      </FluidForm>
    ),
    {
      info: {
        text: `
            Forms are widely used to collect user input.

            Form can have any number of react components enclosed within FormGroup component. FormGroup component
            is a wrapper for legend and fieldset component.

          `,
      },
    }
  );
