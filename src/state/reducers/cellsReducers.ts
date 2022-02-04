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

const reducer = (
  action: Action,
  state: CellsState = initialState
): CellsState => {
  switch (action.type) {
    case ActionType.MOVE_CELL:
      return state;
    case ActionType.DELETE_CELL:
      return state;
    case ActionType.UPDATE_CELL: {
      const { id, content } = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          [id]: {
            ...state.data[id],
            content,
          },
        },
      };
    }
    case ActionType.INSERT_CELL_BEFORE:
    default:
      return state;
  }
};

export default reducer;

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
