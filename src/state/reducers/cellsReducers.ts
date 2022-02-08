/* eslint-disable no-param-reassign */
import produce from 'immer';

import { Cell } from '../cell';
import { ActionType } from '../action-types';
import { Action } from '../actions';

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const randomId = () => Math.random().toString(36).substring(2, 5);

const reducer = produce(
  // eslint-disable-next-line default-param-last
  (state: CellsState = initialState, action: Action): CellsState => {
    // return state is unnecessary immer will do that for us, but we need to let ts know state will never be undefined
    switch (action.type) {
      case ActionType.MOVE_CELL: {
        const { direction } = action.payload;
        const index = state.order.findIndex((id) => id === action.payload.id);
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex > state.order.length - 1) {
          return state;
        }
        state.order[index] = state.order[targetIndex];
        state.order[targetIndex] = action.payload.id;
        return state;
      }
      case ActionType.DELETE_CELL: {
        delete state.data[action.payload];
        state.order = state.order.filter((id) => id !== action.payload);
        return state;
      }
      case ActionType.UPDATE_CELL: {
        const { id, content } = action.payload;
        state.data[id].content = content;
        return state;
      }
      case ActionType.INSERT_CELL_AFTER: {
        const cell: Cell = {
          content: '',
          type: action.payload.type,
          id: randomId(),
        };
        state.data[cell.id] = cell;

        const index = state.order.findIndex((id) => id === action.payload.id);
        if (index < 0) {
          state.order.unshift(cell.id);
        } else {
          state.order.splice(index + 1, 0, cell.id);
        }
        return state;
      }
      default:
        return state;
    }
  },
  initialState
);

export default reducer;

// Sample state
// {
//   loading: false,
//   error: null,
//   data: {
//     'dadada': {
//       id: 'dadada',
//       type: 'code';
//       content: 'const a = 1'
//     }
//   }
// }
