import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IFaq } from 'app/shared/model/faq.model';
import { FaqService } from './faq.service';

@Component({
    selector: 'jhi-faq-delete-dialog',
    templateUrl: './faq-delete-dialog.component.html'
})
export class FaqDeleteDialogComponent {
    faq: IFaq;

    constructor(protected faqService: FaqService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.faqService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'faqListModification',
                content: 'Deleted an faq'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-faq-delete-popup',
    template: ''
})
export class FaqDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ faq }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(FaqDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.faq = faq;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
