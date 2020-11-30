/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useEffect, useState } from 'react';
import { FolderShared16, Edit16, TrashCan16 } from '@carbon/icons-react';

import ContextMenu, {
  ContextMenuOption,
  ContextMenuDivider,
  SelectableContextMenuOption,
} from '../ContextMenu';
import ContextMenuRadioGroup from './ContextMenuRadioGroup';

export default {
  title: 'ContextMenu',
  parameters: {
    component: ContextMenu,
  },
};

export const _ContextMenu = () => {
  const [open, setOpen] = useState(true);
  const [position, setPosition] = useState([0, 0]);

  function openContextMenu(e) {
    e.preventDefault();

    const { x, y } = e;

    setPosition([x, y]);
    setOpen(true);
  }

  useEffect(() => {
    document.addEventListener('contextmenu', openContextMenu);

    return () => {
      document.removeEventListener('contextmenu', openContextMenu);
    };
  });

  return (
    <ContextMenu open={open} x={position[0]} y={position[1]}>
      <ContextMenuOption label="Share with" renderIcon={FolderShared16}>
        <ContextMenuRadioGroup
          label="Share with"
          items={['None', 'Product team', 'Organization', 'Company']}
          initialSelectedItem="Product team"
        />
      </ContextMenuOption>
      <ContextMenuDivider />
      <ContextMenuOption label="Cut" shortcut="⌘X" />
      <ContextMenuOption label="Copy" shortcut="⌘C" />
      <ContextMenuOption label="Copy path" shortcut="⌥⌘C" />
      <ContextMenuOption label="Paste" shortcut="⌘V" disabled />
      <ContextMenuOption label="Duplicate" />
      <ContextMenuDivider />
      <SelectableContextMenuOption label="Publish" initialChecked />
      <ContextMenuDivider />
      <ContextMenuOption label="Rename" shortcut="↩︎" renderIcon={Edit16} />
      <ContextMenuOption label="Delete" shortcut="⌘⌫" renderIcon={TrashCan16} />
    </ContextMenu>
  );
};

_ContextMenu.storyName = 'ContextMenu';
