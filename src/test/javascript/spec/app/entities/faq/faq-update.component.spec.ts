/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { DmkTestModule } from '../../../test.module';
import { FaqUpdateComponent } from 'app/entities/faq/faq-update.component';
import { FaqService } from 'app/entities/faq/faq.service';
import { Faq } from 'app/shared/model/faq.model';

describe('Component Tests', () => {
    describe('Faq Management Update Component', () => {
        let comp: FaqUpdateComponent;
        let fixture: ComponentFixture<FaqUpdateComponent>;
        let service: FaqService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DmkTestModule],
                declarations: [FaqUpdateComponent]
            })
                .overrideTemplate(FaqUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(FaqUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FaqService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new Faq(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.faq = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new Faq();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.faq = entity;
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
