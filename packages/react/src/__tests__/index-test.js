/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Carbon from '../index';

describe('Carbon Components React', () => {
  it('can be imported using the correct path', () => {
    expect(typeof Carbon).toBe('object');
  });

  it('should export components', () => {
    expect(Object.keys(Carbon).sort()).toMatchInlineSnapshot(`
      Array [
        "Accordion",
        "AccordionItem",
        "AccordionSkeleton",
        "ActionableNotification",
        "AspectRatio",
        "Breadcrumb",
        "BreadcrumbItem",
        "BreadcrumbSkeleton",
        "Button",
        "ButtonSet",
        "ButtonSkeleton",
        "Checkbox",
        "CheckboxSkeleton",
        "ClickableTile",
        "CodeSnippet",
        "CodeSnippetSkeleton",
        "Column",
        "ComboBox",
        "ComposedModal",
        "Content",
        "ContentSwitcher",
        "ControlledPasswordInput",
        "Copy",
        "CopyButton",
        "DangerButton",
        "DataTable",
        "DataTableSkeleton",
        "DatePicker",
        "DatePickerInput",
        "DatePickerSkeleton",
        "Dropdown",
        "DropdownSkeleton",
        "ErrorBoundary",
        "ErrorBoundaryContext",
        "ExpandableSearch",
        "ExpandableTile",
        "FileUploader",
        "FileUploaderButton",
        "FileUploaderDropContainer",
        "FileUploaderItem",
        "FileUploaderSkeleton",
        "Filename",
        "FilterableMultiSelect",
        "FluidForm",
        "Form",
        "FormGroup",
        "FormItem",
        "FormLabel",
        "Grid",
        "Header",
        "HeaderContainer",
        "HeaderGlobalAction",
        "HeaderGlobalBar",
        "HeaderMenu",
        "HeaderMenuButton",
        "HeaderMenuItem",
        "HeaderName",
        "HeaderNavigation",
        "HeaderPanel",
        "HeaderSideNavItems",
        "Icon",
        "IconSkeleton",
        "InlineLoading",
        "InlineNotification",
        "Link",
        "ListItem",
        "Loading",
        "Modal",
        "ModalBody",
        "ModalFooter",
        "ModalHeader",
        "ModalWrapper",
        "MultiSelect",
        "NotificationActionButton",
        "NotificationButton",
        "NotificationTextDetails",
        "NumberInput",
        "NumberInputSkeleton",
        "OrderedList",
        "OverflowMenu",
        "OverflowMenuItem",
        "Pagination",
        "PaginationNav",
        "PaginationSkeleton",
        "PasswordInput",
        "PrimaryButton",
        "ProgressIndicator",
        "ProgressIndicatorSkeleton",
        "ProgressStep",
        "RadioButton",
        "RadioButtonGroup",
        "RadioButtonSkeleton",
        "RadioTile",
        "Row",
        "Search",
        "SearchFilterButton",
        "SearchLayoutButton",
        "SearchSkeleton",
        "SecondaryButton",
        "Select",
        "SelectItem",
        "SelectItemGroup",
        "SelectSkeleton",
        "SelectableTile",
        "SideNav",
        "SideNavDetails",
        "SideNavDivider",
        "SideNavFooter",
        "SideNavHeader",
        "SideNavIcon",
        "SideNavItem",
        "SideNavItems",
        "SideNavLink",
        "SideNavLinkText",
        "SideNavMenu",
        "SideNavMenuItem",
        "SideNavSwitcher",
        "SkeletonPlaceholder",
        "SkeletonText",
        "SkipToContent",
        "Slider",
        "SliderSkeleton",
        "StructuredListBody",
        "StructuredListCell",
        "StructuredListHead",
        "StructuredListInput",
        "StructuredListRow",
        "StructuredListSkeleton",
        "StructuredListWrapper",
        "Switch",
        "Switcher",
        "SwitcherDivider",
        "SwitcherItem",
        "Tab",
        "TabContent",
        "Table",
        "TableActionList",
        "TableBatchAction",
        "TableBatchActions",
        "TableBody",
        "TableCell",
        "TableContainer",
        "TableExpandHeader",
        "TableExpandRow",
        "TableExpandedRow",
        "TableHead",
        "TableHeader",
        "TableRow",
        "TableSelectAll",
        "TableSelectRow",
        "TableToolbar",
        "TableToolbarAction",
        "TableToolbarContent",
        "TableToolbarMenu",
        "TableToolbarSearch",
        "Tabs",
        "TabsSkeleton",
        "Tag",
        "TagSkeleton",
        "TextArea",
        "TextAreaSkeleton",
        "TextInput",
        "TextInputSkeleton",
        "Tile",
        "TileAboveTheFoldContent",
        "TileBelowTheFoldContent",
        "TileGroup",
        "TimePicker",
        "TimePickerSelect",
        "ToastNotification",
        "Toggle",
        "ToggleSkeleton",
        "ToggleSmall",
        "ToggleSmallSkeleton",
        "Toolbar",
        "ToolbarDivider",
        "ToolbarItem",
        "ToolbarOption",
        "ToolbarSearch",
        "ToolbarTitle",
        "Tooltip",
        "TooltipDefinition",
        "TooltipIcon",
        "UnorderedList",
        "unstable_FeatureFlags",
        "unstable_FlexGrid",
        "unstable_HStack",
        "unstable_Heading",
        "unstable_IconButton",
        "unstable_IconTab",
        "unstable_Layer",
        "unstable_Menu",
        "unstable_MenuDivider",
        "unstable_MenuGroup",
        "unstable_MenuItem",
        "unstable_MenuRadioGroup",
        "unstable_MenuSelectableItem",
        "unstable_PageSelector",
        "unstable_Pagination",
        "unstable_Popover",
        "unstable_PopoverContent",
        "unstable_ProgressBar",
        "unstable_Section",
        "unstable_Stack",
        "unstable_TabList",
        "unstable_TabPanel",
        "unstable_TabPanels",
        "unstable_Theme",
        "unstable_ThemeContext",
        "unstable_Tooltip",
        "unstable_TreeNode",
        "unstable_TreeView",
        "unstable_VStack",
        "unstable_useContextMenu",
        "unstable_useFeatureFlag",
        "unstable_useFeatureFlags",
        "unstable_usePrefix",
        "unstable_useTheme",
      ]
    `);
  });
});
