import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IFaq } from 'app/shared/model/faq.model';
import { AccountService } from 'app/core';
import { FaqService } from './faq.service';

@Component({
    selector: 'jhi-faq',
    templateUrl: './faq.component.html'
})
export class FaqComponent implements OnInit, OnDestroy {
    faqs: IFaq[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected faqService: FaqService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.faqService.query().subscribe(
            (res: HttpResponse<IFaq[]>) => {
                this.faqs = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInFaqs();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IFaq) {
        return item.id;
    }

    registerChangeInFaqs() {
        this.eventSubscriber = this.eventManager.subscribe('faqListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
