/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { DmkTestModule } from '../../../test.module';
import { MailTaskDeleteDialogComponent } from 'app/entities/mail-task/mail-task-delete-dialog.component';
import { MailTaskService } from 'app/entities/mail-task/mail-task.service';

describe('Component Tests', () => {
    describe('MailTask Management Delete Component', () => {
        let comp: MailTaskDeleteDialogComponent;
        let fixture: ComponentFixture<MailTaskDeleteDialogComponent>;
        let service: MailTaskService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DmkTestModule],
                declarations: [MailTaskDeleteDialogComponent]
            })
                .overrideTemplate(MailTaskDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(MailTaskDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MailTaskService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
