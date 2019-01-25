import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IMail } from 'app/shared/model/mail.model';
import { AccountService } from 'app/core';
import { MailService } from './mail.service';

@Component({
    selector: 'jhi-mail',
    templateUrl: './mail.component.html'
})
export class MailComponent implements OnInit, OnDestroy {
    mail: IMail[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected mailService: MailService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.mailService.query().subscribe(
            (res: HttpResponse<IMail[]>) => {
                this.mail = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInMail();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IMail) {
        return item.id;
    }

    registerChangeInMail() {
        this.eventSubscriber = this.eventManager.subscribe('mailListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
