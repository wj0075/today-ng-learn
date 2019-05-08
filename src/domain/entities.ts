import {generateUUID} from '../utils/uuid';

export class Todo {
  _id: string;                // id
  title: string;              // 名称
  createAt: number;           // 创建时间
  listUUID: string;           // 列表uuid
  desc: string;               // 描述
  completedFlag: boolean;     // 是否完成
  completedAt: number;        // 完成时间
  dueAt: number;              //
  planAt: number;             // 计划完成时间
  notifyMe = false;           // 是否提醒我

  constructor(title: string, listUUID?: string) {
    this._id = generateUUID();
    this.title = title;
    this.listUUID = listUUID;
    this.completedFlag = false;
  }
}

export class List {
  _id: string;                 // id
  title: string;               // 名称
  createAt: number;            // 创建时间

  constructor(title: string) {
    this._id = generateUUID();
    this.title = title;
  }
}
