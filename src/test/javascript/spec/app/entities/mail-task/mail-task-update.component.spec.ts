/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { DmkTestModule } from '../../../test.module';
import { MailTaskUpdateComponent } from 'app/entities/mail-task/mail-task-update.component';
import { MailTaskService } from 'app/entities/mail-task/mail-task.service';
import { MailTask } from 'app/shared/model/mail-task.model';

describe('Component Tests', () => {
    describe('MailTask Management Update Component', () => {
        let comp: MailTaskUpdateComponent;
        let fixture: ComponentFixture<MailTaskUpdateComponent>;
        let service: MailTaskService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DmkTestModule],
                declarations: [MailTaskUpdateComponent]
            })
                .overrideTemplate(MailTaskUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(MailTaskUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MailTaskService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new MailTask(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.mailTask = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new MailTask();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.mailTask = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.create).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));
        });
    });
});
