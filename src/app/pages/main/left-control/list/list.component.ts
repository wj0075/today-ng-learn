import {Component, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {List} from '../../../../../domain/entities';
import {ListService} from '../../../../services/list/list.service';
import {TodoService} from '../../../../services/todo/todo.service';
import {Subject} from 'rxjs';
import {NzDropdownContextComponent, NzDropdownService, NzModalService} from 'ng-zorro-antd';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {
  @Input() isCollapsed: boolean;
  @ViewChild('listInput') private listInput: ElementRef;
  @ViewChild('listRenameInput') private listRenameInput: ElementRef;

  lists: List[];
  currentListUuid: string;                  // 当前展示的菜单
  contextListUuid: string;                  // 当前要操作的菜单
  addListModalVisible = false;              // 控制新增列表的模态框
  renameListModalVisible = false;           // 重命名
  private dropdown: NzDropdownContextComponent;
  private destory$ = new Subject();

  constructor(
    private dropdownService: NzDropdownService,
    private listService: ListService,
    private todoService: TodoService,
    private modal: NzModalService
  ) {
  }

  ngOnInit() {
    // 接收lists的变化，重新渲染lists
    this.listService.lists$
      .pipe(takeUntil(this.destory$))
      .subscribe(lists => {
        this.lists = lists;
      });
    this.listService.currentUuid$
      .pipe(takeUntil(this.destory$))
      .subscribe(uuid => {
        this.currentListUuid = uuid;
      });
    this.listService.getAll();
  }

  ngOnDestroy() {
    this.destory$.next();
  }

  openAddListModal(): void {
    this.addListModalVisible = true;
    setTimeout(() => {
      this.listInput.nativeElement.focus();
    });
  }

  closeAddListModal(): void {
    this.addListModalVisible = false;
  }

  closeRenameListModal(): void {
    this.renameListModalVisible = false;
  }

  click(uuid: string): void {
    this.listService.setCurrentUuid(uuid);
  }

  add(title: string): void {
    this.listService.add(title);
    this.closeAddListModal();
  }

  contextMenu($event: MouseEvent, template: TemplateRef<void>, uuid: string): void {
    this.dropdown = this.dropdownService.create($event, template);
    this.contextListUuid = uuid;
  }

  openRenameListModal(): void {
    this.renameListModalVisible = true;
    setTimeout(() => {
      const title = this.lists.find(l => l._id === this.contextListUuid).title;
      this.listRenameInput.nativeElement.value = title;
      this.listRenameInput.nativeElement.focus();
    });
  }

  rename(title: string): void {
    this.listService.rename(this.contextListUuid, title);
    this.closeRenameListModal();
  }

  delete(): void {
    const uuid = this.contextListUuid;
    this.modal.confirm({
      nzTitle: '确认删除列表',
      nzContent: '该操作会导致该列表下的所有待办事项被删除',
      nzOnOk: () => new Promise((res, rej) => {
        this.listService.delete(uuid);
        this.todoService.deleteInList(uuid);
        res();
      }).catch(() => console.error('Delete list failed'))
    });
  }

  close(): void {
    this.dropdown.close();
  }
}
