/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount, shallow } from 'enzyme';
import {
  assertMenuOpen,
  assertMenuClosed,
  findMenuItemNode,
  openMenu,
  generateItems,
  generateGenericItem,
} from '../ListBox/test-helpers';
import Dropdown from '../Dropdown';
import DropdownSkeleton from '../Dropdown/Dropdown.Skeleton';
import { settings } from 'carbon-components';

const { prefix } = settings;

describe('Dropdown', () => {
  let mockProps;
  beforeEach(() => {
    mockProps = {
      id: 'test-dropdown',
      items: generateItems(5, generateGenericItem),
      onChange: jest.fn(),
      label: 'input',
      placeholder: 'Filter...',
      type: 'default',
    };
  });

  it('should render', () => {
    const wrapper = mount(<Dropdown {...mockProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should initially render with the menu not open', () => {
    const wrapper = mount(<Dropdown {...mockProps} />);
    assertMenuClosed(wrapper);
  });

  it('should let the user open the menu by clicking on the control', () => {
    const wrapper = mount(<Dropdown {...mockProps} />);
    openMenu(wrapper);
    assertMenuOpen(wrapper, mockProps);
  });

  it('should render with strings as items', () => {
    const wrapper = mount(<Dropdown {...mockProps} items={['zar', 'doz']} />);
    openMenu(wrapper);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render custom item components', () => {
    const wrapper = mount(<Dropdown {...mockProps} />);
    wrapper.setProps({
      itemToElement: item => <div className="mock-item">{item.label}</div>,
    });
    openMenu(wrapper);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with categories', () => {
    const wrapper = mount(
      <Dropdown {...mockProps} itemToCategory={() => 'myOnlyCategory'} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('title', () => {
    let wrapper;
    let renderedLabel;

    beforeEach(() => {
      wrapper = mount(<Dropdown titleText="Email Input" {...mockProps} />);
      renderedLabel = wrapper.find('label');
    });

    it('renders a title', () => {
      expect(renderedLabel.length).toBe(1);
    });

    it('has the expected classes', () => {
      expect(renderedLabel.hasClass(`${prefix}--label`)).toEqual(true);
    });

    it('should set title as expected', () => {
      expect(renderedLabel.text()).toEqual('Email Input');
    });
  });

  describe('helper', () => {
    it('renders a helper', () => {
      const wrapper = mount(
        <Dropdown helperText="Email Input" {...mockProps} />
      );
      const renderedHelper = wrapper.find(`.${prefix}--form__helper-text`);
      expect(renderedHelper.length).toEqual(1);
    });

    it('renders children as expected', () => {
      const wrapper = mount(
        <Dropdown
          helperText={
            <span>
              This helper text has <a href="/">a link</a>.
            </span>
          }
          {...mockProps}
        />
      );
      const renderedHelper = wrapper.find(`.${prefix}--form__helper-text`);
      expect(renderedHelper.props().children).toEqual(
        <span>
          This helper text has <a href="/">a link</a>.
        </span>
      );
    });

    it('should set helper text as expected', () => {
      const wrapper = mount(<Dropdown {...mockProps} />);
      wrapper.setProps({ helperText: 'Helper text' });
      const renderedHelper = wrapper.find(`.${prefix}--form__helper-text`);
      expect(renderedHelper.text()).toEqual('Helper text');
    });
  });

  it('should specify light version as expected', () => {
    const wrapper = mount(<Dropdown {...mockProps} />);
    expect(wrapper.props().light).toEqual(false);
    wrapper.setProps({ light: true });
    expect(wrapper.props().light).toEqual(true);
  });

  it('should let the user select an option by clicking on the option node', () => {
    const wrapper = mount(<Dropdown {...mockProps} />);
    openMenu(wrapper);
    findMenuItemNode(wrapper, 0).simulate('click');
    expect(mockProps.onChange).toHaveBeenCalledTimes(1);
    expect(mockProps.onChange).toHaveBeenCalledWith({
      selectedItem: mockProps.items[0],
    });
    assertMenuClosed(wrapper);

    mockProps.onChange.mockClear();

    openMenu(wrapper);
    findMenuItemNode(wrapper, 1).simulate('click');
    expect(mockProps.onChange).toHaveBeenCalledTimes(1);
    expect(mockProps.onChange).toHaveBeenCalledWith({
      selectedItem: mockProps.items[1],
    });
  });

  describe('should display initially selected item found in `initialSelectedItem`', () => {
    it('using an object type for the `initialSelectedItem` prop', () => {
      const wrapper = mount(
        <Dropdown {...mockProps} initialSelectedItem={mockProps.items[0]} />
      );

      expect(wrapper.find(`span.${prefix}--list-box__label`).text()).toEqual(
        mockProps.items[0].label
      );
    });

    it('using a string type for the `initialSelectedItem` prop', () => {
      // Replace the 'items' property in mockProps with a list of strings
      mockProps = {
        ...mockProps,
        items: ['1', '2', '3'],
      };

      const wrapper = mount(
        <Dropdown {...mockProps} initialSelectedItem={mockProps.items[1]} />
      );

      expect(wrapper.find(`span.${prefix}--list-box__label`).text()).toEqual(
        mockProps.items[1]
      );
    });
  });

  describe('getA11yStatusMessage', () => {
    let getA11yStatusMessage;
    const itemToString = i => String(i);

    const tests = [
      {
        input: {
          isOpen: false,
          selectedItem: null,
        },
        output: '',
        outputWithCategories: '',
      },
      {
        input: {
          itemToString,
          isOpen: false,
          selectedItem: 'Grapes',
        },
        output: 'Grapes',
        outputWithCategories: 'Grapes',
      },
      {
        input: {
          isOpen: true,
          resultCount: 0,
        },
        output: 'No results.',
        outputWithCategories: 'No results.',
      },
      {
        input: {
          isOpen: true,
          resultCount: 10,
        },
        output:
          '10 results are available, use up and down arrow keys to navigate.',
        outputWithCategories:
          '10 results are available, use up and down arrow keys to navigate.',
      },
      {
        input: {
          isOpen: true,
          resultCount: 9,
          previousResultCount: 12,
        },
        output:
          '9 results are available, use up and down arrow keys to navigate.',
        outputWithCategories:
          '9 results are available, use up and down arrow keys to navigate.',
      },
      {
        input: {
          isOpen: true,
          resultCount: 8,
          previousResultCount: 20,
          highlightedItem: 'Oranges',
        },
        output:
          '8 results are available, use up and down arrow keys to navigate.',
        outputWithCategories:
          '8 results are available, use up and down arrow keys to navigate.',
      },
      {
        input: {
          isOpen: true,
          resultCount: 1,
        },
        output:
          '1 result is available, use up and down arrow keys to navigate.',
        outputWithCategories:
          '1 result is available, use up and down arrow keys to navigate.',
      },
      {
        input: {
          itemToString,
          isOpen: true,
          resultCount: 7,
          previousResultCount: 7,
          selectedItem: 'Raspberries',
          highlightedItem: 'Raspberries',
        },
        output: 'Raspberries',
        outputWithCategories:
          'Fruit category entered with 5 items. Raspberries',
      },
    ];

    describe('without categories', () => {
      beforeEach(() => {
        const wrapper = shallow(<Dropdown {...mockProps} />);
        getA11yStatusMessage = wrapper
          .instance()
          .getA11yStatusMessageFunction();
      });

      tests.forEach(({ input, output }) => {
        test(`${JSON.stringify(input)} results in ${JSON.stringify(
          output
        )}`, () => {
          expect(getA11yStatusMessage(input)).toBe(output);
        });
      });
    });

    describe('with categories', () => {
      beforeEach(() => {
        const wrapper = shallow(
          <Dropdown {...mockProps} itemToCategory={() => 'Fruit'} />
        );
        getA11yStatusMessage = wrapper
          .instance()
          .getA11yStatusMessageFunction();
      });

      tests.forEach(({ input, outputWithCategories }) => {
        test(`${JSON.stringify(input)} results in ${JSON.stringify(
          outputWithCategories
        )}`, () => {
          expect(getA11yStatusMessage(input)).toBe(outputWithCategories);
        });
      });
    });
  });
});

describe('DropdownSkeleton', () => {
  describe('Renders as expected', () => {
    const wrapper = shallow(<DropdownSkeleton inline />);

    it('Has the expected classes', () => {
      expect(wrapper.hasClass(`${prefix}--skeleton`)).toEqual(true);
      expect(wrapper.hasClass(`${prefix}--dropdown-v2`)).toEqual(true);
      expect(wrapper.hasClass(`${prefix}--list-box--inline`)).toEqual(true);
    });
  });
});
