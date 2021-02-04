import {
  ShowKey,
  Database,
  CanvasType,
  Language,
  NameCase,
  ColumnType,
} from '@@types/engine/store/canvas.state';
import { IStore } from '@/internal-types/store';
import { createCommand } from './command.helper';

export const moveCanvas = (scrollTop: number, scrollLeft: number) =>
  createCommand('canvas.move', {
    scrollTop,
    scrollLeft,
  });

export const resizeCanvas = (width: number, height: number) =>
  createCommand('canvas.resize', {
    width,
    height,
  });

export const changeCanvasShow = (
  { canvasState: { show } }: IStore,
  showKey: ShowKey
) =>
  createCommand('canvas.changeShow', {
    showKey,
    value: !show[showKey],
  });

export const changeDatabase = (database: Database) =>
  createCommand('canvas.changeDatabase', {
    database,
  });

export const changeDatabaseName = (value: string) =>
  createCommand('canvas.changeDatabaseName', {
    value,
  });

export const changeCanvasType = (canvasType: CanvasType) =>
  createCommand('canvas.changeCanvasType', {
    canvasType,
  });

export const changeLanguage = (language: Language) =>
  createCommand('canvas.changeLanguage', {
    language,
  });

export const changeTableCase = (nameCase: NameCase) =>
  createCommand('canvas.changeTableCase', {
    nameCase,
  });

export const changeColumnCase = (nameCase: NameCase) =>
  createCommand('canvas.changeColumnCase', {
    nameCase,
  });

export const changeRelationshipDataTypeSync = (value: boolean) =>
  createCommand('canvas.changeRelationshipDataTypeSync', {
    value,
  });

export const moveColumnOrder = (
  columnType: ColumnType,
  targetColumnType: ColumnType
) =>
  createCommand('canvas.moveColumnOrder', {
    columnType,
    targetColumnType,
  });