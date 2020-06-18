/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import DataTable, {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
  TableHead,
  TableHeader,
  TableRow,
} from '../../DataTable';
import { initialRows, headers } from './shared';
import './with-expansion-story.scss';

export default (props) => (
  <DataTable
    rows={initialRows}
    headers={headers}
    {...props}
    render={({
      rows,
      headers,
      getHeaderProps,
      getExpandHeaderProps,
      getRowProps,
      getTableProps,
      getTableContainerProps,
    }) => (
      <TableContainer
        title="DataTable"
        description="With expansion"
        {...getTableContainerProps()}>
        <Table {...getTableProps()}>
          <TableHead>
            <TableRow>
              <TableExpandHeader
                enableExpando={true}
                {...getExpandHeaderProps()}
              />
              {headers.map((header) => (
                <TableHeader {...getHeaderProps({ header })}>
                  {header.header}
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableExpandRow {...getRowProps({ row })}>
                  {row.cells.map((cell) => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableExpandRow>
                <TableExpandedRow
                  colSpan={headers.length + 1}
                  className="demo-expanded-td">
                  <h6>Expandable row content</h6>
                  <div>Description here</div>
                </TableExpandedRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  />
);
