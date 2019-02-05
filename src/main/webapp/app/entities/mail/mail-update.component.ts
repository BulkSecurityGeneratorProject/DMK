import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IMail } from 'app/shared/model/mail.model';
import { MailService } from './mail.service';

@Component({
    selector: 'jhi-mail-update',
    templateUrl: './mail-update.component.html'
})
export class MailUpdateComponent implements OnInit {
    mail: IMail;
    isSaving: boolean;

    constructor(protected mailService: MailService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ mail }) => {
            this.mail = mail;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.mail.id !== undefined) {
            this.subscribeToSaveResponse(this.mailService.update(this.mail));
        } else {
            this.subscribeToSaveResponse(this.mailService.create(this.mail));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IMail>>) {
        result.subscribe((res: HttpResponse<IMail>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
