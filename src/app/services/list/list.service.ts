import {Injectable} from '@angular/core';
import {List} from '../../../domain/entities';
import {Subject} from 'rxjs';
import {LocalStorageService} from '../local-storage/local-storage.service';
import {LISTS} from '../local-storage/local-storage.namespace';
/*
* 1、在点击列表的时候，右侧只会显示属于这个列表的待办事项
* 2、在删除列表的时候，该列表下的待办事项也会被删除
* 3、右侧的标题区域会显示当前列表的标题
*
* */
type SpecialListUUID = 'today' | 'todo';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private current: List;
  private lists: List[] = [];

  currentUuid: SpecialListUUID | string = 'today'; // 表示当前展示的today还是todo
  currentUuid$ = new Subject<string>();            // 当前展示的uuid
  current$ = new Subject<List>();                  // 当前展示的左侧的列表项
  lists$ = new Subject<List[]>();                  // 所有列表

  constructor(
    private store: LocalStorageService
  ) {
  }

  // 广播,通知相关方
  private broadCast(): void {
    this.lists$.next(this.lists);
    this.current$.next(this.current);
    this.currentUuid$.next(this.currentUuid);
  }

  // 继续, 发生变化后，重新更新下缓存的数据
  private persist(): void {
    this.store.set(LISTS, this.lists);
  }

  // 通过uuid获取列表详情
  private getByUuid(uuid: string): List {
    return this.lists.find(l => l._id === uuid);
  }

  // 更新列表详情，将传入进来的数据，更新到原有的数据，并更新缓存，通知相关联的组件
  private update(list: List): void {
    const index = this.lists.findIndex(l => l._id === list._id);
    if (index !== -1) {
      this.lists.splice(index, 1, list);
      this.persist();
      this.broadCast();
    }
  }

  // 获取当前列表uuid
  getCurrentListUuid(): SpecialListUUID | string {
    return this.currentUuid;
  }

  getAll(): void {
    this.lists = this.store.getList(LISTS);
    this.broadCast();
  }

  // 设置当前的uuid
  setCurrentUuid(uuid: string): void {
    this.currentUuid = uuid;
    this.current = this.lists.find(l => l._id === uuid);
    this.broadCast();
  }

  // 添加新的列表
  add(title: string): void {
    const newList = new List(title);        // 生成一个新的实例
    this.lists.push(newList);
    this.currentUuid = newList._id;         // 把当前的uuid设置成新添加的列表项
    this.current = newList;                 // 一样

    this.broadCast();                       // 广播出去
    this.persist();                         // 存储到缓存里
  }

  // 更改列表名称
  rename(listUuid: string, title: string) {
    const list = this.getByUuid(listUuid);
    if (list) {
      list.title = title;
      this.update(list);
    }
  }

  // 删除列表，通过uuid
  delete(uuid: string): void {
    const i = this.lists.findIndex(l => l._id === uuid);
    if (i !== -1) {
      this.lists.splice(i, 1);
      const listsLength = this.lists.length;
      this.currentUuid = listsLength
        ? this.lists[listsLength - 1]._id
        : this.currentUuid === 'today'
          ? 'today'
          : 'todo';

      this.broadCast();
      this.persist();
    }
  }
}
