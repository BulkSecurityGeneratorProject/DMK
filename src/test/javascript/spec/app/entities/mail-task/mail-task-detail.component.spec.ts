/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DmkTestModule } from '../../../test.module';
import { MailTaskDetailComponent } from 'app/entities/mail-task/mail-task-detail.component';
import { MailTask } from 'app/shared/model/mail-task.model';

describe('Component Tests', () => {
    describe('MailTask Management Detail Component', () => {
        let comp: MailTaskDetailComponent;
        let fixture: ComponentFixture<MailTaskDetailComponent>;
        const route = ({ data: of({ mailTask: new MailTask(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DmkTestModule],
                declarations: [MailTaskDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(MailTaskDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(MailTaskDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.mailTask).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
