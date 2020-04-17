import { CommandEffect } from "../Command";
import { Store } from "../Store";
import { Logger } from "../Logger";
import { getData } from "../Helper";
import { FocusTableModel, FocusType } from "../model/FocusTableModel";

export interface FocusTable {
  tableId: string;
}
export function focusTable(tableId: string): CommandEffect<FocusTable> {
  return {
    name: "editor.focusTable",
    data: {
      tableId,
    },
  };
}
export function focusTableExecute(store: Store, data: FocusTable) {
  Logger.debug("focusTableExecute");
  const { tableState, editorState } = store;
  const table = getData(tableState.tables, data.tableId);
  if (
    table &&
    (editorState.focusTable === null ||
      editorState.focusTable.id !== data.tableId)
  ) {
    if (editorState.focusTable?.id !== table.id) {
      focusEndTableExecute(store);
      editorState.focusTable = new FocusTableModel(table, store);
    }
  }
}

export function focusEndTable(): CommandEffect<null> {
  return {
    name: "editor.focusEndTable",
    data: null,
  };
}
export function focusEndTableExecute(store: Store) {
  Logger.debug("focusEndTableExecute");
  const { editorState } = store;
  editorState.focusTable?.destroy();
  editorState.focusTable = null;
  editEndTableExecute(store);
}

export const moveKeys: MoveKey[] = [
  "ArrowUp",
  "ArrowRight",
  "ArrowDown",
  "ArrowLeft",
];
export type MoveKey = "ArrowUp" | "ArrowRight" | "ArrowDown" | "ArrowLeft";
export interface FocusMoveTable {
  moveKey: MoveKey;
  shiftKey: boolean;
}
export function focusMoveTable(
  moveKey: MoveKey,
  shiftKey: boolean
): CommandEffect<FocusMoveTable> {
  return {
    name: "editor.focusMoveTable",
    data: {
      moveKey,
      shiftKey,
    },
  };
}
export function focusMoveTableExecute(store: Store, data: FocusMoveTable) {
  Logger.debug("focusMoveTableExecute");
  const { focusTable } = store.editorState;
  focusTable?.move(data);
}

export interface FocusTargetTable {
  focusType: FocusType;
}
export function focusTargetTable(
  focusType: FocusType
): CommandEffect<FocusTargetTable> {
  return {
    name: "editor.focusTargetTable",
    data: {
      focusType,
    },
  };
}
export function focusTargetTableExecute(store: Store, data: FocusTargetTable) {
  Logger.debug("focusTargetTableExecute");
  const { focusTable } = store.editorState;
  focusTable?.focus({
    focusTargetTable: data,
  });
  editEndTableExecute(store);
}

export interface FocusTargetColumn {
  columnId: string;
  focusType: FocusType;
  ctrlKey: boolean;
  shiftKey: boolean;
}
export function focusTargetColumn(
  columnId: string,
  focusType: FocusType,
  ctrlKey: boolean,
  shiftKey: boolean
): CommandEffect<FocusTargetColumn> {
  return {
    name: "editor.focusTargetColumn",
    data: {
      columnId,
      focusType,
      ctrlKey,
      shiftKey,
    },
  };
}
export function focusTargetColumnExecute(
  store: Store,
  data: FocusTargetColumn
) {
  Logger.debug("focusTargetColumnExecute");
  const { focusTable } = store.editorState;
  focusTable?.focus({
    focusTargetColumn: data,
  });
  editEndTableExecute(store);
}

export function selectAllColumn(): CommandEffect<null> {
  return {
    name: "editor.selectAllColumn",
    data: null,
  };
}
export function selectAllColumnExecute(store: Store) {
  Logger.debug("selectAllColumnExecute");
  const { focusTable } = store.editorState;
  focusTable?.selectAll();
}

export function selectEndColumn(): CommandEffect<null> {
  return {
    name: "editor.selectEndColumn",
    data: null,
  };
}
export function selectEndColumnExecute(store: Store) {
  Logger.debug("selectEndColumnExecute");
  const { focusTable } = store.editorState;
  focusTable?.selectEnd();
}

export interface EditTable {
  id: string;
  focusType: FocusType;
}
export function editTable(
  id: string,
  focusType: FocusType
): CommandEffect<EditTable> {
  return {
    name: "editor.editTable",
    data: {
      id,
      focusType,
    },
  };
}
export function editTableExecute(store: Store, data: EditTable) {
  Logger.debug("editTableExecute");
  const { editorState } = store;
  editorState.editTable = data;
}

export function editEndTable(): CommandEffect<null> {
  return {
    name: "editor.editEndTable",
    data: null,
  };
}
export function editEndTableExecute(store: Store) {
  Logger.debug("editEndTableExecute");
  const { editorState } = store;
  editorState.editTable = null;
}

export interface DraggableColumn {
  tableId: string;
  columnId: string;
}
export function draggableColumn(
  tableId: string,
  columnId: string
): CommandEffect<DraggableColumn> {
  return {
    name: "editor.draggableColumn",
    data: {
      tableId,
      columnId,
    },
  };
}
export function draggableColumnExecute(store: Store, data: DraggableColumn) {
  Logger.debug("draggableColumnExecute");
  const { editorState } = store;
  editorState.draggableColumn = data;
}

export function draggableEndColumn(): CommandEffect<null> {
  return {
    name: "editor.draggableEndColumn",
    data: null,
  };
}
export function draggableEndColumnExecute(store: Store) {
  Logger.debug("draggableEndColumnExecute");
  const { editorState } = store;
  editorState.draggableColumn = null;
}
