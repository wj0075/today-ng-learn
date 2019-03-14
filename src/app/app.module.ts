import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgZorroAntdModule, NZ_I18N, zh_CN} from 'ng-zorro-antd';
import {SetupModule} from './pages/setup/setup.module';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import {LocalStorageService} from './services/local-storage/local-storage.service';
import {MainModule} from './pages/main/main.module';
import {InitGuardService} from './services/init-guard/init-guard.service';
import {ListService} from './services/list/list.service';
import {TodoService} from './services/todo/todo.service';
registerLocaleData(zh);
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    AppRoutingModule,
    SetupModule,
    MainModule
  ],
  providers: [
    {provide: NZ_I18N, useValue: zh_CN},
    LocalStorageService,
    InitGuardService,
    ListService,
    TodoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
