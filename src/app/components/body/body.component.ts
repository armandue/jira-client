import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {saveAs} from 'file-saver/FileSaver';
import { NotificationsService } from 'angular2-notifications';
import * as moment from 'moment';
import * as $ from 'jquery';

import './body.component.less';
import {WorklogService} from '../shared/jira.service';
import {ConclusionService} from '../shared/conclusion.service';
import {ProjectResource, IssueResource} from '../shared/jira.class';

const numOfMonth: number = 12;
const SECONDS_IN_HOUR: number = (60 * 60);
const DATE_FORMAT_MONTHLY: string = 'YYYY - MMM';
const DATE_FORMAT_DALIY: string = 'YYYY-MM-DD';

@Component({
  selector: 'jira-body-component',
  template: require('./body.component.html')
})
export class JiraBodyComponent implements OnInit {
    startDate: string;
    endDate: string;
    selectedMonth: string;
    optionalMonthes: string[] = [];
    selectedModel: string;
    optionalModels: string[] = [];
    username: string = '';
    token: string = '';
    analyzeData: any;
    loading: boolean = false;
    doughnut: any;
    conclusion: string;
    version: string;

    constructor(private worklogService: WorklogService,
        private conclusionService: ConclusionService,
        private notificationsService: NotificationsService) {}

    ngOnInit(): any {
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });

        this.worklogService.getAppVersion().subscribe(response => {
            this.version = response;
        });

        this.analyzeData = {
            projects: [],
            worklogs: []
        };

        for (let i = 0; i < numOfMonth; i++) {
            this.optionalMonthes.push(moment().subtract(i, 'month').format(DATE_FORMAT_MONTHLY));
        };
        this.selectedMonth = this.optionalMonthes[0];

        this.optionalModels = ['Test', 'Default hour', 'Exact hour'];
        this.selectedModel = this.optionalModels[0];
        this.doughnut = {
            data: [],
            labels: [],
            type: 'doughnut',
            options: {
                title: {
                    display: true,
                    text: 'Projects summary',
                    fontStyle: 'bold',
                    fontSize: 18
                }
            }
        };
    }

    downloadFile() {
        this.setupTimeInterval(this.selectedMonth);
        let model = this.getWorklogFileModel(this.selectedModel);
        let fileName = 'Timesheet-' + this.selectedMonth + '.xlsx';
        this.loading = true;
        this.worklogService.getWorklogFile(this.startDate,
            this.endDate,
            this.username,
            this.token,
            model)
            .subscribe(response => {
                saveAs(response, fileName);
                this.loading = false;
            }, error => this.handleError(error));
    }

    analyze() {
        this.setupTimeInterval(this.selectedMonth);
        this.loading = true;
        Observable.combineLatest(this.worklogService.analyze(
            this.startDate,
            this.endDate,
            this.username,
            this.token),
            this.worklogService.getWorklogs(
                this.startDate,
                this.endDate,
                this.username,
                this.token
            ))
                .subscribe((response: any[]) => {
                    this.analyzeData.projects = response[0];
                    this.analyzeData.worklogs = response[1];
                    this.loading = false;
                    this.processProjects(this.analyzeData.projects);
                    this.doughnut.options.tooltips = {
                        callbacks: {
                            title: function(tooltipItem: any, data: any) {
                                var title = 'Project ';
                                var projects = response[0];
                                if (projects.length > 0) {
                                    title += projects[tooltipItem[0].index].name;
                                }
                                return title;
                            },
                            label: function(tooltipItem: any, data: any) {
                                var label = [];
                                var projects = response[0];
                                label.push('  Logged hours: ' + data.datasets[0].data[tooltipItem.index]);
                                label.push('  Num of worked tasks: ' + projects[tooltipItem.index].issues.length);
                                return label;
                            }
                        }
                    };
                    this.conclusion = this.conclusionService.generateConclusion(response[0], response[1]);
                }, error => this.handleError(error));
    }

    setupTimeInterval(month: any) {
        this.startDate = moment(month, DATE_FORMAT_MONTHLY)
            .startOf('month').format(DATE_FORMAT_DALIY);
        this.endDate = moment(month, DATE_FORMAT_MONTHLY)
            .endOf('month').format(DATE_FORMAT_DALIY);
    }

    getWorklogFileModel(model: string): string {
        let fileModel;
        switch (model) {
            case 'Exact hour': {
                fileModel = 'EXACT';
                break;
            }
            case 'Test': {
                fileModel = 'TEST';
                break;
            }
            case 'Default hour':
            default: {
                fileModel = 'DEFAULT';
                break;
            }
        }
        return fileModel;
    }

    processProjects(projects: ProjectResource[]) {
        this.doughnut.labels = [];
        this.doughnut.data = [];
        for (var project of projects) {
            var hours = this.sumHoursOfProject(project);
            this.doughnut.labels.push(project.key);
            this.doughnut.data.push(hours);
        };
    }

    sumHoursOfProject(project: ProjectResource): number {
        var hours = 0;
        for (var issue of project.issues) {
            hours += this.sumHoursOfIssue(issue);
        };
        return hours;
    }

    sumHoursOfIssue(issue: IssueResource): number {
        var hours = 0;
        for (var log of issue.worklogs) {
            hours += log.timeSpentSeconds / SECONDS_IN_HOUR;
        };
        return hours;
    }

    handleError(error: any) {
        $('.modal').modal('hide');
        console.log(error);
        this.notificationsService.error('Error', error.message, {
          timeOut: 3000,
          showProgressBar: true,
          pauseOnHover: true,
          clickToClose: true
        });
    }
}
