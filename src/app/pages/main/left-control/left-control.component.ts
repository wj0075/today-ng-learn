import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LocalStorageService} from '../../../services/local-storage/local-storage.service';
import {USERNAME} from '../../../services/local-storage/local-storage.namespace';
import {ListComponent} from './list/list.component';

@Component({
  selector: 'app-left-control',
  templateUrl: './left-control.component.html',
  styleUrls: ['./left-control.component.less']
})
export class LeftControlComponent implements OnInit {
  @Input() isCollapsed: boolean;
  @ViewChild(ListComponent) listComponent: ListComponent;
  userName: string;

  constructor(
    private store: LocalStorageService
  ) {
  }

  ngOnInit() {
    this.userName = this.store.get(USERNAME);
  }

  openAddListModal(): void {
    this.listComponent.openAddListModal();
  }

  goSetting() {

  }

  goSummary() {

  }
}
