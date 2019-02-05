import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DmkSharedModule } from 'app/shared';
import {
    MailTaskComponent,
    MailTaskDetailComponent,
    MailTaskUpdateComponent,
    MailTaskDeletePopupComponent,
    MailTaskDeleteDialogComponent,
    mailTaskRoute,
    mailTaskPopupRoute
} from './';

const ENTITY_STATES = [...mailTaskRoute, ...mailTaskPopupRoute];

@NgModule({
    imports: [DmkSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        MailTaskComponent,
        MailTaskDetailComponent,
        MailTaskUpdateComponent,
        MailTaskDeleteDialogComponent,
        MailTaskDeletePopupComponent
    ],
    entryComponents: [MailTaskComponent, MailTaskUpdateComponent, MailTaskDeleteDialogComponent, MailTaskDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DmkMailTaskModule {}
