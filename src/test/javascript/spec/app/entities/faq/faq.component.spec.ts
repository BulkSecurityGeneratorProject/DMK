/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { DmkTestModule } from '../../../test.module';
import { FaqComponent } from 'app/entities/faq/faq.component';
import { FaqService } from 'app/entities/faq/faq.service';
import { Faq } from 'app/shared/model/faq.model';

describe('Component Tests', () => {
    describe('Faq Management Component', () => {
        let comp: FaqComponent;
        let fixture: ComponentFixture<FaqComponent>;
        let service: FaqService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DmkTestModule],
                declarations: [FaqComponent],
                providers: []
            })
                .overrideTemplate(FaqComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(FaqComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FaqService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Faq(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.faqs[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
