import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import {User, ProjectResource} from './jira.class';
const BASIC_URL = 'http://com-cin-jira.appspot.com/';
@Injectable()
export class WorklogService {

    constructor(private httpClient: HttpClient) {}

    getAppVersion(): Observable<string> {
        return this.httpClient.get<string>(BASIC_URL + 'version');
    }

    getWorklogFile(from: string, to: string, user: User, worklogModel: string): Observable<Blob> {
        let params = new HttpParams()
            .set('from', from)
            .set('to', to)
            .set('worklogModel', worklogModel);
        return this.httpClient.post<Blob>(BASIC_URL + 'worklogfile', user,
            {
                params: params,
                responseType: 'Blob' as 'json'
            });
    }

    getWorklogs(from: string, to: string, user: User): Observable<any[]> {
        let params = new HttpParams()
            .set('from', from)
            .set('to', to);
        return this.httpClient.post<any[]>(BASIC_URL + 'worklog', user,
            {
                params: params
            });
    }

    analyze(from: string, to: string, user: User): Observable<ProjectResource[]> {
        let params = new HttpParams()
            .set('from', from)
            .set('to', to);
        return this.httpClient.post<ProjectResource[]>(BASIC_URL + 'analyze', user,
            {
                params: params
            });
    }
}
