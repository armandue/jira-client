import {Component, OnInit} from '@angular/core';
import './main.component.less';
import {WorklogService} from './shared/jira.service';

@Component({
  selector: 'jira-main-component',
  template: require('./main.component.html')
})
export class JiraMainComponent implements OnInit {
    appVersion: string;

    constructor(private worklogService: WorklogService) {}

    ngOnInit(): any {
        this.worklogService.getAppVersion()
            .subscribe(response => {
                this.appVersion = response;
            });
    }
}
