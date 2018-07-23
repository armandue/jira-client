import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {UIRouterModule, UIView} from '@uirouter/angular';
import {ChartsModule} from 'ng2-charts';
import {STATES, routerConfig} from './routes';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { SimpleNotificationsModule } from 'angular2-notifications';
import 'bootstrap';

import {JiraMainComponent,
    JiraHeaderComponent,
    JiraBodyComponent,
    JiraFooterComponent} from './components/index';

import {WorklogService} from './components/shared/jira.service';
import {ConclusionService} from './components/shared/conclusion.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    LoadingBarHttpClientModule,
    SimpleNotificationsModule.forRoot(),
    UIRouterModule.forRoot({
        states: STATES,
        useHash: true,
        config: routerConfig
    }),
    ChartsModule
  ],
  declarations: [
    JiraMainComponent,
    JiraHeaderComponent,
    JiraBodyComponent,
    JiraFooterComponent
  ],
  providers: [WorklogService,
    ConclusionService],
  bootstrap: [UIView]
})
export class JiraAppModule {}
