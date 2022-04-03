import { Component, createSignal, For } from 'solid-js';
import './App.css';
import { createCoreTable, createTable, paginateRowsFn } from './solid-table';

const table = createCoreTable();

const defaultData = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 29,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'derek',
    lastName: 'perkins',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'bergevin',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
];

for (let i = 0; i < 1000; i++) {
  defaultData.push(defaultData[i]);
}

const defaultColumns = table.createColumns([
  table.createGroup({
    header: 'Name',
    footer: props => props.column.id,
    columns: [
      table.createDataColumn('firstName', {
        cell: info => info.value,
        footer: props => props.column.id,
        header: () => <span>First Name</span>,
      }),
      table.createDataColumn(row => row.lastName, {
        id: 'lastName',
        cell: info => info.value,
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
      }),
    ],
  }),
  table.createGroup({
    header: 'Info',
    footer: props => props.column.id,
    columns: [
      table.createDataColumn('age', {
        header: () => 'Age',
        footer: props => props.column.id,
      }),
      table.createDataColumn('visits', {
        header: () => <span>Visits</span>,
        footer: props => props.column.id,
      }),
      table.createDataColumn('status', {
        header: 'Status',
        footer: props => props.column.id,
      }),
      table.createDataColumn('progress', {
        header: 'Profile Progress',
        footer: props => props.column.id,
      }),
    ],
  }),
]);

function Table(props: { columns: any[]; data: any[] }) {
  const instance = createTable(table, {
    data: props.data,
    columns: props.columns,
    initialState: { pagination: { pageSize: 10, pageIndex: 2, pageCount: -1 } },
    paginateRowsFn,
  });

  return (
    <>
      <pre>
        <code>{JSON.stringify(instance.getState().pagination, null, 2)}</code>
      </pre>
      <table {...instance.getTableProps()}>
        <thead>
          <For each={instance.getHeaderGroups()}>
            {headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                <For each={headerGroup.headers}>
                  {column => (
                    <th {...column.getHeaderProps()}>
                      {column.renderHeader()}
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody {...instance.getTableBodyProps()}>
          <For each={instance.getPaginationRowModel().rows}>
            {(row, i) => (
              <tr {...row.getRowProps()}>
                <For each={row.getAllCells()}>
                  {cell => (
                    <td {...cell.getCellProps()}>{cell.renderCell()}</td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <div className="pagination">
        <button
          onClick={() => instance.setPageIndex(0)}
          disabled={!instance.getCanPreviousPage()}
        >
          {'<<'}
        </button>{' '}
        <button
          onClick={() => instance.previousPage()}
          disabled={!instance.getCanPreviousPage()}
        >
          {'<'}
        </button>{' '}
        <button
          onClick={() => instance.nextPage()}
          disabled={!instance.getCanNextPage()}
        >
          {'>'}
        </button>{' '}
        <button
          onClick={() => instance.setPageIndex(instance.getPageCount() - 1)}
          disabled={!instance.getCanNextPage()}
        >
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {instance.getState().pagination.pageIndex + 1} of{' '}
            {instance.getPageCount()}
          </strong>{' '}
        </span>
        <select
          value={instance.getState().pagination.pageSize}
          onChange={e => {
            instance.setPageSize(Number(e.currentTarget.value));
          }}
        >
          <For each={[10, 20, 30, 40, 50]}>
            {pageSize => <option value={pageSize}>Show {pageSize}</option>}
          </For>
        </select>
      </div>
    </>
  );
}

const App: Component = () => {
  const [data] = createSignal(defaultData);
  const [columns] = createSignal(defaultColumns);

  return (
    <div class="table">
      <Table data={data()} columns={columns()} />
    </div>
  );
};

export default App;
