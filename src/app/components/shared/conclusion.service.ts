import {Injectable} from '@angular/core';
import {ProjectResource, IssueResource} from './jira.class';

const subjectMap = ['you', 'maybe you', 'you definitely', 'without any doubt, you'];
const connectMap = ['Also', 'Meantime', 'And', 'By the way', 'However', 'To some extent'];
const verbMap = {
    // num of projects && average of hours
    are: {
        project: {
            normal: 'a person with some interesting ideas.',
            low: 'a man with two hands and a nose.',
            high: 'an efficient and well-organized programmer.',
            min: 1,
            max: 3,
            name: 'numOfProject'
        },
        worklog: {
            normal: 'well-disciplined.',
            low: 'paied with a good price.',
            high: 'a machine, without any rest.',
            min: 7.5,
            max: 8.5,
            name: 'averageOfHours'
        }
    },
    // num of issues && each day hours
    worked: {
        project: {
            normal: 'in a smart way, like a Smart on the road.',
            low: 'a little bit slow, but careful to your tasks.',
            high: 'on a lot of different things, so many threads running through your head.',
            min: 2,
            max: 4,
            name: 'numOfIssue'
        },
        worklog: {
            normal: 'so average, incredible average, everyday...',
            name: 'isEven'
        }
    },
    // max difference of hours for projects && hours
    like: {
        project: {
            normal: 'to distribute your time evenly for every project.',
            low: 'looking around, maybe your colleague by your side.',
            high: 'to foucs on some big problems, and do a lot effort.',
            min: 10,
            max: 30,
            name: 'maxHourDifference'
        },
        worklog: {
            normal: 'to go home in time.',
            low: 'to cook dinner.',
            high: 'your work, from the deepest heart, believe it or not.',
            min: 0.5,
            max: 1,
            name: 'maxHourDifference'
        }
    }
};

const STANDARD_WORK_SECONDS = 8 * 60 * 60;

class ProjectSummary {
    numOfProject: number;
    numOfIssue: number;
    maxHourDifference: number;
    numOfLog: number;
    constructor() {
        this.numOfProject = 0;
        this.numOfIssue = 0;
        this.numOfLog = 0;
        this.maxHourDifference = 0;
    }
}

class WorklogSummary {
    averageOfHours: number;
    isEven: boolean;
    maxHourDifference: number;
    constructor() {
        this.averageOfHours = 0;
        this.isEven = true;
        this.maxHourDifference = 0;
    }
}

@Injectable()
export class ConclusionService {

    projectSummary: ProjectSummary;
    worklogSummary: WorklogSummary;
    numOfDays: number;
    subMap: string[];
    conMap: string[];

    generateConclusion(projects: ProjectResource[], worklogs: any): string {
        let result = '';
        let conclusions = [];

        this.subMap = Object.assign([], subjectMap);
        this.conMap = Object.assign([], connectMap);

        this.numOfDays = worklogs.length;
        this.projectSummary = this.analyzeProject(projects);
        this.worklogSummary = this.analyzeWorklog(worklogs);
        conclusions = this.generateSentences();
        for (let phrase of conclusions) {
            if (phrase !== undefined) {
                if (result.length === 0) {
                    result = phrase;
                } else {
                    let i = Math.floor(Math.random() * this.conMap.length);
                    result = ' ' + result + ' ' +
                        this.conMap[i] + ', ' +
                        phrase;
                    this.conMap.splice(i, 1);
                }
            }
        }

        result = result.charAt(2).toUpperCase() + result.slice(3);
        return result;
    }

    generateSentences(): string[] {
        let conclusions = [];
        for (let verb of Object.keys(verbMap)) {
            let phrase;
            let key = this.selectBetweenProjectAndWorklog(verb);
            phrase = this.generateFromMap(verb, key);
            if (phrase.length > 0) {
                let index;
                do {
                    index = Math.floor(Math.random() * 10);
                } while (conclusions[index] !== undefined);
                conclusions[index] = phrase;
            }
        }
        return conclusions;
    }

    generateFromMap(verb: string, key: string): string {
        let phrase;
        let value;
        let selection = verbMap[verb][key];
        if (key === 'project') {
            value = this.projectSummary[selection.name];
        } else {
            value = this.worklogSummary[selection.name];
        }
        phrase = selection.normal;
        if (key !== 'worklog' || verb !== 'worked') {
            let min = selection.min;
            let max = selection.max;
            if (value <= min) {
                phrase = selection.low;
            } else if (value >= max) {
                phrase = selection.high;
            }
            phrase = this.formPhrase(verb, phrase);
        } else {
            if (value) {
                phrase = this.formPhrase(verb, phrase);
            } else {
                phrase = '';
            }
        }
        return phrase;
    }

    formPhrase(verb: string, object: string): string {
        let i = Math.floor(Math.random() * this.subMap.length);
        let phrase = this.subMap[i] + ' ' + verb + ' ' + object;
        this.subMap.splice(i, 1);
        return phrase;
    }

    selectBetweenProjectAndWorklog(key: string): string {
        let map = verbMap[key];
        let projectSize = Object.keys(map.project).length;
        let worklogSize = Object.keys(map.worklog).length;
        let rand = Math.random() * (projectSize + worklogSize);
        if (rand <= projectSize) {
            return 'project';
        } else {
            return 'worklog';
        }
    }

    analyzeProject(projects: ProjectResource[]): ProjectSummary {
        let projectSummary = new ProjectSummary();
        projectSummary.numOfProject = projects.length;
        projectSummary.numOfIssue = this.getNumOfIssue(projects);
        projectSummary.numOfLog = this.getNumOfLog(projects);
        projectSummary.maxHourDifference = this.getMaxHourDifference(projects);
        return projectSummary;
    }

    getNumOfIssue(projects: ProjectResource[]): number {
        let numOfIssue = 0;
        for (let project of projects) {
            numOfIssue += project.issues.length;
        }
        return numOfIssue / this.numOfDays;
    }

    getNumOfLog(projects: ProjectResource[]): number {
        let numOfLog = 0;
        for (let project of projects) {
            for (let issue of project.issues) {
                numOfLog += issue.worklogs.length;
            }
        }
        return numOfLog;
    }

    getMaxHourDifference(projects: ProjectResource[]): number {
        let seconds = [];
        for (let project of projects) {
            let second = this.getSecondsFromProject(project);
            seconds.push(second);
        }
        let max = Math.max.apply(null, seconds);
        let min = Math.min.apply(null, seconds);
        let diff = max - min;
        return this.convertToHour(diff);
    }

    getSecondsFromProject(project: ProjectResource): number {
        let seconds = 0;
        for (let issue of project.issues) {
            seconds += this.getSecondsFromIssue(issue);
        }
        return seconds;
    }

    getSecondsFromIssue(issue: IssueResource): number {
        let seconds = 0;
        for (let log of issue.worklogs) {
            seconds += log.timeSpentSeconds;
        }
        return seconds;
    }

    analyzeWorklog(worklogs: any): WorklogSummary {
        let worklogSummary = new WorklogSummary();
        let sumOfSeconds = 0;
        let seconds = [];
        for (let date of Object.keys(worklogs)) {
            seconds.push(worklogs[date]);
            sumOfSeconds += worklogs[date];
            if (worklogs[date] !== STANDARD_WORK_SECONDS) {
                worklogSummary.isEven = false;
            }
        }
        let max = Math.max.apply(null, seconds);
        let min = Math.min.apply(null, seconds);
        let diff = max - min;
        worklogSummary.maxHourDifference = this.convertToHour(diff);
        worklogSummary.averageOfHours = this.convertToHour(sumOfSeconds) / this.numOfDays;
        return worklogSummary;
    }

    convertToHour(seconds: number): number {
        return seconds / (60 * 60);
    }
}
