/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { DmkTestModule } from '../../../test.module';
import { MailUpdateComponent } from 'app/entities/mail/mail-update.component';
import { MailService } from 'app/entities/mail/mail.service';
import { Mail } from 'app/shared/model/mail.model';

describe('Component Tests', () => {
    describe('Mail Management Update Component', () => {
        let comp: MailUpdateComponent;
        let fixture: ComponentFixture<MailUpdateComponent>;
        let service: MailService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DmkTestModule],
                declarations: [MailUpdateComponent]
            })
                .overrideTemplate(MailUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(MailUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MailService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new Mail(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.mail = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new Mail();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.mail = entity;
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
