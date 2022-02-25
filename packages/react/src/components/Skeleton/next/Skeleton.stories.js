/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import SkeletonText from '../../SkeletonText';
import SkeletonPlaceholder from '../../SkeletonPlaceholder';
import { withKnobs, select, boolean, number } from '@storybook/addon-knobs';

const classNames = {
  'my--skeleton__placeholder--small': 'my--skeleton__placeholder--small',
  'my--skeleton__placeholder--medium': 'my--skeleton__placeholder--medium',
  'my--skeleton__placeholder--large': 'my--skeleton__placeholder--large',
};

const placeholderProps = () => ({
  className: select('Classes with different sizes', classNames),
});

const widths = {
  '100%': '100%',
  '250px': '250px',
};

const textProps = () => ({
  heading: boolean('Skeleton text at a larger size (heading)'),
  paragraph: boolean('Use multiple lines of text (paragraph)'),
  lineCount: number('The number of lines in a paragraph (lineCount)', 3),
  width: select(
    'Width (in px or %) of single line of text or max-width of paragraph lines (width)',
    widths,
    '100%'
  ),
});

export default {
  title: 'Components/Skeleton',
  component: SkeletonText,
  decorators: [withKnobs],
  subcomponents: {
    SkeletonPlaceholder,
  },
};

export const _SkeletonPlaceholder = () => {
  return (
    <div style={{ height: '250px', width: '250px' }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
      .my--skeleton__placeholder--small {
        height: 100px;
        width: 100px;
      }

      .my--skeleton__placeholder--medium {
        height: 150px;
        width: 150px;
      }

      .my--skeleton__placeholder--large {
        height: 250px;
        width: 250px;
      }
    `,
        }}
      />
      <SkeletonPlaceholder {...placeholderProps()} />
    </div>
  );
};

export const _SkeletonText = () => {
  return (
    <div style={{ width: '300px' }}>
      <SkeletonText {...textProps()} />
    </div>
  );
};
