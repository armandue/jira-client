import {Injectable} from '@angular/core';
import {UIRouter} from '@uirouter/angular';

import {JiraMainComponent} from './components/index';

export const STATES = [
  {
    name: 'App',
    url: '/',
    component: JiraMainComponent
  }
];

export function routerConfig (router: UIRouter) {
  router.urlService.rules.otherwise({state: 'App'});
}
