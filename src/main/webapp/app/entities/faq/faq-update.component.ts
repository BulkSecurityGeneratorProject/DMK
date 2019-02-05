import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IFaq } from 'app/shared/model/faq.model';
import { FaqService } from './faq.service';

@Component({
    selector: 'jhi-faq-update',
    templateUrl: './faq-update.component.html'
})
export class FaqUpdateComponent implements OnInit {
    faq: IFaq;
    isSaving: boolean;

    constructor(protected faqService: FaqService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ faq }) => {
            this.faq = faq;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.faq.id !== undefined) {
            this.subscribeToSaveResponse(this.faqService.update(this.faq));
        } else {
            this.subscribeToSaveResponse(this.faqService.create(this.faq));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IFaq>>) {
        result.subscribe((res: HttpResponse<IFaq>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
