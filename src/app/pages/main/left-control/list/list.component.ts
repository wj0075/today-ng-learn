import {Component, ElementRef, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {List} from '../../../../../domain/entities';
import {ListService} from '../../../../services/list/list.service';
import {TodoService} from '../../../../services/todo/todo.service';
import {Subject} from 'rxjs';
import {NzDropdownContextComponent, NzDropdownService} from 'ng-zorro-antd';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input() isCollapsed: boolean;
  @ViewChild('listInput') private listInput: ElementRef;

  list: List[];
  currentListUuid: string;
  contextListUuid: string;
  addListModalVisible = false;              // 控制新增列表的模态框

  private dropdown: NzDropdownContextComponent;
  private destory$ = new Subject();

  constructor(
    private dropdownService: NzDropdownService,
    private listService: ListService,
    private todoService: TodoService
  ) {
  }

  ngOnInit() {

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

  close() {

  }

  openRenameListModal() {

  }

  delete() {

  }
}
