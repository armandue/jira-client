export {
    User, ProjectResource, IssueResource, WorklogResource
}

class User {
    username: string;
    password: string;
    constructor() {
        this.username = null;
        this.password = null;
    }
}

interface ProjectResource {
    id: number;
    key: string;
    description: string;
    name: string;
    issues: IssueResource[];
}

class IssueResource {
    key: string;
    type: string;
    worklogs: WorklogResource[];
}

class WorklogResource {
    timeSpentSeconds: number;
    startDate: Date;
}
