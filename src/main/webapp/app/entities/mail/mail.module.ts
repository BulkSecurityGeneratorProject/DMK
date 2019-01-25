import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DmkSharedModule } from 'app/shared';
import {
    MailComponent,
    MailDetailComponent,
    MailUpdateComponent,
    MailDeletePopupComponent,
    MailDeleteDialogComponent,
    mailRoute,
    mailPopupRoute
} from './';

const ENTITY_STATES = [...mailRoute, ...mailPopupRoute];

@NgModule({
    imports: [DmkSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [MailComponent, MailDetailComponent, MailUpdateComponent, MailDeleteDialogComponent, MailDeletePopupComponent],
    entryComponents: [MailComponent, MailUpdateComponent, MailDeleteDialogComponent, MailDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DmkMailModule {}
