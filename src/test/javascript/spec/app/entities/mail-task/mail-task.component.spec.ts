/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { DmkTestModule } from '../../../test.module';
import { MailTaskComponent } from 'app/entities/mail-task/mail-task.component';
import { MailTaskService } from 'app/entities/mail-task/mail-task.service';
import { MailTask } from 'app/shared/model/mail-task.model';

describe('Component Tests', () => {
    describe('MailTask Management Component', () => {
        let comp: MailTaskComponent;
        let fixture: ComponentFixture<MailTaskComponent>;
        let service: MailTaskService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DmkTestModule],
                declarations: [MailTaskComponent],
                providers: []
            })
                .overrideTemplate(MailTaskComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(MailTaskComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MailTaskService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new MailTask(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.mailTasks[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
