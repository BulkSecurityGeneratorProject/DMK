/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { DmkTestModule } from '../../../test.module';
import { MailComponent } from 'app/entities/mail/mail.component';
import { MailService } from 'app/entities/mail/mail.service';
import { Mail } from 'app/shared/model/mail.model';

describe('Component Tests', () => {
    describe('Mail Management Component', () => {
        let comp: MailComponent;
        let fixture: ComponentFixture<MailComponent>;
        let service: MailService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DmkTestModule],
                declarations: [MailComponent],
                providers: []
            })
                .overrideTemplate(MailComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(MailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MailService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Mail(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.mail[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
