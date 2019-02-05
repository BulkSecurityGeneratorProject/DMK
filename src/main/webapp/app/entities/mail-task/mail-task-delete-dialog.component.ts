import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMailTask } from 'app/shared/model/mail-task.model';
import { MailTaskService } from './mail-task.service';

@Component({
    selector: 'jhi-mail-task-delete-dialog',
    templateUrl: './mail-task-delete-dialog.component.html'
})
export class MailTaskDeleteDialogComponent {
    mailTask: IMailTask;

    constructor(protected mailTaskService: MailTaskService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.mailTaskService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'mailTaskListModification',
                content: 'Deleted an mailTask'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-mail-task-delete-popup',
    template: ''
})
export class MailTaskDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ mailTask }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(MailTaskDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.mailTask = mailTask;
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
