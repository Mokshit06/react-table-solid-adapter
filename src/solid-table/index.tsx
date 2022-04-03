export * from '@tanstack/table-core';

import {
  AnyGenerics,
  CreateTableFactoryOptions,
  createTableInstance,
  init,
  Options,
  PartialKeys,
  Table,
} from '@tanstack/table-core';
import { createComputed } from 'solid-js';
import { createStore } from 'solid-js/store';

function render<TProps extends {}>(Comp: any, props: TProps) {
  if (!Comp) return null;

  if (typeof Comp === 'function') {
    return <Comp {...props} />;
  }

  return Comp;
}

const { createTable: createCoreTable, createTableFactory } = init({ render });
export { createCoreTable, createTableFactory };

export function createTable<TGenerics extends AnyGenerics>(
  table: Table<TGenerics>,
  options: PartialKeys<
    Omit<
      Options<TGenerics>,
      keyof CreateTableFactoryOptions<any, any, any, any>
    >,
    'state' | 'onStateChange'
  >
) {
  const resolvedOptions: Options<TGenerics> = {
    ...(table.__options ?? {}),
    state: {}, // Dummy state
    onStateChange: () => {}, // noop
    render,
    ...options,
  };

  const instance = createTableInstance<TGenerics>(resolvedOptions);
  const [state, setState] = createStore({
    ...instance.initialState,
    ...options.state,
  });

  createComputed(() => {
    instance.setOptions(prev => {
      console.log('UPDATE');
      return {
        ...prev,
        ...options,
        state,
        // Similarly, we'll maintain both our internal state and any user-provided
        // state.
        onStateChange: updater => {
          // console.log(updater(state.initialState));
          if (typeof updater === 'function') {
            setState(state => ({ ...updater(state), ...options.state }));
          } else {
            setState({ ...updater, ...options.state });
          }
          options.onStateChange?.(updater);
        },
      };
    });
  });

  return instance;
}
