import { CommandEffect } from "../Command";
import { SIZE_MIN_WIDTH } from "../Layout";
import { Store } from "../Store";
import { Helper, getData, uuid } from "../Helper";
import { Logger } from "../Logger";
import { TableUI } from "../store/Table";
import { TableModel } from "../model/TableModel";
import { nextPoint, nextZIndex } from "../helper/TableHelper";
import { selectEndMemoExecute } from "./memo";
import { focusTableExecute, focusEndTableExecute } from "./editor";

export interface AddTable {
  id: string;
  ui: TableUI;
}
export function addTable(store: Store): CommandEffect<AddTable> {
  const { tableState, memoState } = store;
  const point = nextPoint(store, tableState.tables, memoState.memos);
  return {
    name: "table.add",
    data: {
      id: uuid(),
      ui: {
        active: true,
        left: point.left,
        top: point.top,
        zIndex: nextZIndex(tableState.tables, memoState.memos),
        widthName: SIZE_MIN_WIDTH,
        widthComment: SIZE_MIN_WIDTH,
      },
    },
  };
}
export function addTableExecute(store: Store, data: AddTable) {
  Logger.debug("addTableExecute");
  const { tables } = store.tableState;
  selectEndTableExecute(store);
  selectEndMemoExecute(store);
  tables.push(new TableModel({ addTable: data }, store.canvasState.show));
  focusTableExecute(store, { tableId: data.id });
}

export interface MoveTable {
  movementX: number;
  movementY: number;
  tableIds: string[];
  memoIds: string[];
}
export function moveTable(
  store: Store,
  ctrlKey: boolean,
  movementX: number,
  movementY: number,
  tableId: string
): CommandEffect<MoveTable> {
  const { tableState, memoState } = store;
  return {
    name: "table.move",
    data: {
      movementX,
      movementY,
      tableIds: ctrlKey
        ? tableState.tables
            .filter(table => table.ui.active)
            .map(table => table.id)
        : [tableId],
      memoIds: ctrlKey
        ? memoState.memos.filter(memo => memo.ui.active).map(memo => memo.id)
        : [],
    },
  };
}
export function moveTableExecute(store: Store, data: MoveTable) {
  Logger.debug("moveTableExecute");
  const { tableState, memoState } = store;
  data.tableIds.forEach(tableId => {
    const table = getData(tableState.tables, tableId);
    if (table) {
      table.ui.left += data.movementX;
      table.ui.top += data.movementY;
    }
  });
  data.memoIds.forEach(memoId => {
    const memo = getData(memoState.memos, memoId);
    if (memo) {
      memo.ui.left += data.movementX;
      memo.ui.top += data.movementY;
    }
  });
  // TODO: relationship sort
}

export interface RemoveTable {
  tableIds: string[];
  memoIds: string[];
}
export function removeTable(
  store: Store,
  tableId?: string
): CommandEffect<RemoveTable> {
  const { tableState, memoState } = store;
  return {
    name: "table.remove",
    data: {
      tableIds: tableId
        ? [tableId]
        : tableState.tables
            .filter(table => table.ui.active)
            .map(table => table.id),
      memoIds: tableId
        ? []
        : memoState.memos.filter(memo => memo.ui.active).map(memo => memo.id),
    },
  };
}
export function removeTableExecute(store: Store, data: RemoveTable) {
  Logger.debug("removeTableExecute");
  const { tableState, memoState } = store;
  for (let i = 0; i < tableState.tables.length; i++) {
    const id = tableState.tables[i].id;
    if (data.tableIds.some(tableId => tableId === id)) {
      tableState.tables.splice(i, 1);
      i--;
    }
  }
  for (let i = 0; i < memoState.memos.length; i++) {
    const id = memoState.memos[i].id;
    if (data.memoIds.some(memoId => memoId === id)) {
      memoState.memos.splice(i, 1);
      i--;
    }
  }
  // TODO: relationship valid
}

export interface SelectTable {
  ctrlKey: boolean;
  tableId: string;
  zIndex: number;
}
export function selectTable(
  store: Store,
  ctrlKey: boolean,
  tableId: string
): CommandEffect<SelectTable> {
  const { tableState, memoState } = store;
  return {
    name: "table.select",
    data: {
      ctrlKey,
      tableId,
      zIndex: nextZIndex(tableState.tables, memoState.memos),
    },
  };
}
export function selectTableExecute(store: Store, data: SelectTable) {
  Logger.debug("selectTableExecute");
  const { tables } = store.tableState;
  const targetTable = getData(tables, data.tableId);
  if (targetTable) {
    targetTable.ui.zIndex = data.zIndex;
    if (data.ctrlKey) {
      targetTable.ui.active = true;
    } else {
      tables.forEach(table => {
        table.ui.active = table.id === data.tableId;
      });
      selectEndMemoExecute(store);
    }
    focusTableExecute(store, { tableId: data.tableId });
  }
}

export function selectEndTable(): CommandEffect<null> {
  return {
    name: "table.selectEnd",
    data: null,
  };
}
export function selectEndTableExecute(store: Store) {
  Logger.debug("selectEndTableExecute");
  const { tables } = store.tableState;
  tables.forEach(table => (table.ui.active = false));
  focusEndTableExecute(store);
}

export function selectAllTable(): CommandEffect<null> {
  return {
    name: "table.selectAll",
    data: null,
  };
}
export function selectAllTableExecute(store: Store) {
  Logger.debug("selectAllTableExecute");
  const { tables } = store.tableState;
  tables.forEach(table => (table.ui.active = true));
}

export interface ChangeTableValue {
  tableId: string;
  value: string;
  width: number;
}

export function changeTableName(
  helper: Helper,
  tableId: string,
  value: string
): CommandEffect<ChangeTableValue> {
  let width = helper.getTextWidth(value);
  if (width < SIZE_MIN_WIDTH) {
    width = SIZE_MIN_WIDTH;
  }
  return {
    name: "table.changeName",
    data: {
      tableId,
      value,
      width,
    },
  };
}
export function changeTableNameExecute(store: Store, data: ChangeTableValue) {
  Logger.debug("changeTableNameExecute");
  const { tables } = store.tableState;
  const table = getData(tables, data.tableId);
  if (table) {
    table.name = data.value;
    table.ui.widthName = data.width;
    // TODO: relationship sort
  }
}

export function changeTableComment(
  helper: Helper,
  tableId: string,
  value: string
): CommandEffect<ChangeTableValue> {
  let width = helper.getTextWidth(value);
  if (width < SIZE_MIN_WIDTH) {
    width = SIZE_MIN_WIDTH;
  }
  return {
    name: "table.changeComment",
    data: {
      tableId,
      value,
      width,
    },
  };
}
export function changeTableCommentExecute(
  store: Store,
  data: ChangeTableValue
) {
  Logger.debug("changeTableCommentExecute");
  const { tables } = store.tableState;
  const table = getData(tables, data.tableId);
  if (table) {
    table.comment = data.value;
    table.ui.widthComment = data.width;
    // TODO: relationship sort
  }
}
