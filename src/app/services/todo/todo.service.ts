import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Todo} from '../../../domain/entities';
import {RankBy} from '../../../domain/type';
import {ListService} from '../list/list.service';
import {LocalStorageService} from '../local-storage/local-storage.service';
import {TODOS} from '../local-storage/local-storage.namespace';
import {floorToMinute, getCurrentTime, ONE_HOUR} from '../../../utils/time';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  todo$ = new Subject<Todo[]>();
  rank$ = new Subject<RankBy>();
  completedHide$ = new Subject<boolean>();

  private todos: Todo[] = [];             // 所有的todo项
  private rank: RankBy = 'title';         // todo项当前所示的级别
  private completeHide = false;           // 完成是否隐藏

  constructor(
    private listService: ListService,
    private store: LocalStorageService
  ) {
    this.todos = this.store.getList(TODOS);
  }
  // 广播
  private broadCast(): void {
    this.todo$.next(this.todos);
    this.rank$.next(this.rank);
    this.completedHide$.next(this.completeHide);
  }
  // 存储
  private persist(): void {
    this.store.set(TODOS, this.todos);
  }
  // 获取所有的todo项
  getAll(): void {
    this.todos = this.store.getList(TODOS);
    this.broadCast();
  }
  getRaw(): Todo[] {
    return this.todos;
  }
  // 通过uuid获取符合的todo项
  getByUUID(uuid: string): Todo | null {
    return this.todos.filter((todo: Todo) => todo._id === uuid)[0] || null;
  }
  // 设置今天的todo项
  setTodoToday(uuid: string): void {
    const todo = this.getByUUID(uuid);
    if (todo && !todo.completedFlag) {
      todo.planAt = floorToMinute(new Date()) + ONE_HOUR;
    }
  }

  toggleTodoComplete(uuid: string): void {
    const todo = this.getByUUID(uuid);
    if (todo) {
      todo.completedFlag = !todo.completedFlag;
      todo.completedAt = todo.completedFlag ? getCurrentTime() : undefined;
      this.persist();
      this.completedHide$.next(this.completeHide);
    }
  }
  moveToList(uuid: string, listUUID: string): void {
    const todo = this.getByUUID(uuid);
    if (todo) {
      todo.listUUID = listUUID;
      this.update(todo);
    }
  }
  update(todo: Todo): void {
    const index = this.todos.findIndex(t => t._id === todo._id);
    if (index !== -1) {
      todo.completedAt = todo.completedFlag ? getCurrentTime() : undefined;
      this.todos.splice(index, 1, todo);
      this.persist();
      this.broadCast();
    }
  }

  add(title: string): void {
    const listUUID = this.listService.getCurrentListUuid();
    const newTodo = new Todo(title, listUUID);

    if (listUUID === 'today') {
      newTodo.planAt = floorToMinute(new Date()) + ONE_HOUR;
      newTodo.listUUID = 'todo';
    }

    this.todos.push(newTodo);
    this.persist();
    this.broadCast();
  }
  delete(uuid: string): void {
    const index = this.todos.findIndex(t => t._id === uuid);
    if (index !== -1) {
      this.todos.splice(index, 1);
      this.persist();
      this.broadCast();
    }
  }
  deleteInList(uuid: string): void {
    const toDelete = this.todos.filter(t => t.listUUID === uuid);
    toDelete.forEach(t => this.delete(t._id));
  }

  toggleRank(r: RankBy): void {
    this.rank = r;
    this.rank$.next(r);
  }

  toggleCompleteHide(hide: boolean): void {
    this.completeHide = hide;
    this.completedHide$.next(hide);
  }
}
