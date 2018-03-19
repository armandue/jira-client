import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {UIRouterModule, UIView} from '@uirouter/angular';
import {ChartsModule} from 'ng2-charts';
import {STATES, routerConfig} from './routes';
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
    FormsModule,
    HttpClientModule,
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
