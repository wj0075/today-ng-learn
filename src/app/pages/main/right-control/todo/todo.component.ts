import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {List, Todo} from '../../../../../domain/entities';
import {combineLatest, Subject} from 'rxjs';
import {ListService} from '../../../../services/list/list.service';
import {TodoService} from '../../../../services/todo/todo.service';
import {takeUntil} from 'rxjs/operators';
import {RankBy} from '../../../../../domain/type';
import {floorToDate, getTodayTime} from '../../../../../utils/time';
import {NzDropdownContextComponent, NzDropdownService} from 'ng-zorro-antd';
import {Router} from '@angular/router';

const rankerGenerator = (type: RankBy = 'title'): any => {
  if (type === 'completeFlag') {
    return (t1: Todo, t2: Todo) => t1.completedFlag && !t2.completedFlag;
  }
  return (t1: Todo, t2: Todo) => t1[type] > t2[type];
};


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.less']
})
export class TodoComponent implements OnInit, OnDestroy {
  private dropdown: NzDropdownContextComponent;
  private destory$ = new Subject();

  todos: Todo[] = [];
  lists: List[] = [];
  currentContextTodo: Todo;

  constructor(
    private listService: ListService,
    private todoService: TodoService,
    private dropdownService: NzDropdownService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.listService.lists$
      .pipe(takeUntil(this.destory$))
      .subscribe(lists => {
        this.lists = lists;
      });
    combineLatest(
      this.listService.currentUuid$,
      this.todoService.todo$,
      this.todoService.rank$,
      this.todoService.completedHide$
    )
      .pipe(takeUntil(this.destory$))
      .subscribe(sources => {
        this.processTodos(sources[0], sources[1], sources[2], sources[3]);
      });
    this.todoService.getAll();
    this.listService.getAll();
  }

  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }
  contextMenu($event: MouseEvent, template: TemplateRef<void>, uuid: string ) {
    this.dropdown = this.dropdownService.create($event, template);
    this.currentContextTodo = this.todos.find(t => t._id === uuid);
    console.log(this.currentContextTodo);
  }
  click(uuid: string) {
    // this.router.navigateByUrl(`/main/${uuid}`);
  }

  toggle(uuid: string): void {
    this.todoService.toggleTodoComplete(uuid);
  }

  add(title: string): void {
    this.todoService.add(title);
  }

  close(): void {
    this.dropdown.close();
  }

  setToday(): void {
    this.todoService.setTodoToday(this.currentContextTodo._id);
  }

  moveToList(listUUID: string): void {
    this.todoService.moveToList(this.currentContextTodo._id, listUUID);
  }

  listsExcept(listUUID: string): List[] {
    return this.lists.filter(l => l._id !== listUUID);
  }

  delete(): void {
    this.todoService.delete(this.currentContextTodo._id);
  }
  private processTodos(listUUID: string, todos: Todo[], rank: RankBy, completedHide: boolean): void {
    const filteredTodos = todos
      .filter(todo => {
        return ((listUUID === 'today' && todo.planAt && floorToDate(todo.planAt) <= getTodayTime())
          || (listUUID === 'todo' && (!todo.listUUID || todo.listUUID === 'todo'))
          || (listUUID === todo.listUUID));

      })
      .map(todo => Object.assign({}, todo) as Todo)
      .sort(rankerGenerator(rank))
      .filter(todo => completedHide ? !todo.completedFlag : todo);
    this.todos = [].concat(filteredTodos);
  }
}
