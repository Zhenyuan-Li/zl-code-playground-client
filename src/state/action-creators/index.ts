import { ActionType } from '../action-types/index';
import {
  UpdateCellACtion,
  DeleteCellAction,
  MoveCellAction,
  InsertCellBeforeAction,
  Direction,
} from '../actions';
import { CellTypes } from '../cell';

export const updateCell = (id: string, content: string): UpdateCellACtion => ({
  type: ActionType.UPDATE_CELL,
  payload: {
    id,
    content,
  },
});

export const deleteCell = (id: string): DeleteCellAction => ({
  type: ActionType.DELETE_CELL,
  payload: id,
});

export const moveCell = (id: string, direction: Direction): MoveCellAction => ({
  type: ActionType.MOVE_CELL,
  payload: {
    id,
    direction,
  },
});

export const insertCellBefore = (
  id: string | null,
  cellType: CellTypes
): InsertCellBeforeAction => ({
  type: ActionType.INSERT_CELL_BEFORE,
  payload: {
    id,
    type: cellType,
  },
});
