import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { IMailTask } from 'app/shared/model/mail-task.model';
import { MailTaskService } from './mail-task.service';

@Component({
    selector: 'jhi-mail-task-update',
    templateUrl: './mail-task-update.component.html'
})
export class MailTaskUpdateComponent implements OnInit {
    mailTask: IMailTask;
    isSaving: boolean;
    lastUpdateDp: any;

    constructor(protected mailTaskService: MailTaskService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ mailTask }) => {
            this.mailTask = mailTask;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.mailTask.id !== undefined) {
            this.subscribeToSaveResponse(this.mailTaskService.update(this.mailTask));
        } else {
            this.subscribeToSaveResponse(this.mailTaskService.create(this.mailTask));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IMailTask>>) {
        result.subscribe((res: HttpResponse<IMailTask>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
