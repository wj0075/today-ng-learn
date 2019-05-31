import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {ListService} from '../../../../services/list/list.service';
import {Todo} from '../../../../../domain/entities';
import {TodoService} from '../../../../services/todo/todo.service';
import {takeUntil} from 'rxjs/operators';
import {RankBy} from '../../../../../domain/type';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  listTitle = '';
  completedHide = false;

  constructor(
    private listService: ListService,
    private todoService: TodoService
  ) {
  }

  ngOnInit(): void {
    this.listService.current$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(list => {
        this.listTitle = list ? list.title : '';
      });

    this.todoService.completedHide$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(hide => this.completedHide = hide);
  }

  toggleCompleteHide() {
    this.todoService.toggleCompleteHide(!this.completedHide);
  }

  switchRankType(e: RankBy): void {
    this.todoService.toggleRank(e);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
