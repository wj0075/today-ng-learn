import {Component, Input, OnInit} from '@angular/core';
import {LocalStorageService} from '../../../services/local-storage/local-storage.service';
import {USERNAME} from '../../../services/local-storage/local-storage.namespace';

@Component({
  selector: 'app-left-control',
  templateUrl: './left-control.component.html',
  styleUrls: ['./left-control.component.less']
})
export class LeftControlComponent implements OnInit {
  @Input() isCollapsed;
  userName = '';
  constructor(
    private store: LocalStorageService
  ) { }

  ngOnInit() {
    this.userName = this.store.get(USERNAME);
  }

}
