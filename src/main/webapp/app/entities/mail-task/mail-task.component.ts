import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IMailTask } from 'app/shared/model/mail-task.model';
import { AccountService } from 'app/core';
import { MailTaskService } from './mail-task.service';

@Component({
    selector: 'jhi-mail-task',
    templateUrl: './mail-task.component.html'
})
export class MailTaskComponent implements OnInit, OnDestroy {
    mailTasks: IMailTask[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected mailTaskService: MailTaskService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.mailTaskService.query().subscribe(
            (res: HttpResponse<IMailTask[]>) => {
                this.mailTasks = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInMailTasks();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IMailTask) {
        return item.id;
    }

    registerChangeInMailTasks() {
        this.eventSubscriber = this.eventManager.subscribe('mailTaskListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
