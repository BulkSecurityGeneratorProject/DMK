import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMailTask } from 'app/shared/model/mail-task.model';

@Component({
    selector: 'jhi-mail-task-detail',
    templateUrl: './mail-task-detail.component.html'
})
export class MailTaskDetailComponent implements OnInit {
    mailTask: IMailTask;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ mailTask }) => {
            this.mailTask = mailTask;
        });
    }

    previousState() {
        window.history.back();
    }
}
