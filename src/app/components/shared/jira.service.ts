import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import {User, ProjectResource} from './jira.class';
const BASIC_URL_IP = 'http://5.88.55.220:8008';
@Injectable()
export class WorklogService {

    constructor(private httpClient: HttpClient) {}

    getAppVersion(): Observable<string> {
        return this.httpClient.get<string>(BASIC_URL_IP + '/backdoor/version');
    }

    getWorklogFile(from: string, to: string, username: string, token: string, worklogModel: string): Observable<Blob> {
        let params = new HttpParams()
            .set('from', from)
            .set('to', to)
            .set('username', username)
            .set('bearerToken', token)
            .set('worklogModel', worklogModel);
        return this.httpClient.post<Blob>(BASIC_URL_IP + '/worklogs/file', {},
            {
                params: params,
                responseType: 'Blob' as 'json'
            });
    }

    getWorklogs(from: string, to: string, username: string, token: string): Observable<any[]> {
        let params = new HttpParams()
            .set('from', from)
            .set('to', to)
            .set('username', username)
            .set('bearerToken', token);
        return this.httpClient.post<any[]>(BASIC_URL_IP + '/worklogs', {},
            {
                params: params
            });
    }

    analyze(from: string, to: string, username: string, token: string): Observable<ProjectResource[]> {
        let params = new HttpParams()
            .set('from', from)
            .set('to', to)
            .set('username', username)
            .set('bearerToken', token);
        return this.httpClient.post<ProjectResource[]>(BASIC_URL_IP + '/projects', {},
            {
                'params': params
            });
    }
}
