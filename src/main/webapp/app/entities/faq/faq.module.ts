import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DmkSharedModule } from 'app/shared';
import {
    FaqComponent,
    FaqDetailComponent,
    FaqUpdateComponent,
    FaqDeletePopupComponent,
    FaqDeleteDialogComponent,
    faqRoute,
    faqPopupRoute
} from './';

const ENTITY_STATES = [...faqRoute, ...faqPopupRoute];

@NgModule({
    imports: [DmkSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [FaqComponent, FaqDetailComponent, FaqUpdateComponent, FaqDeleteDialogComponent, FaqDeletePopupComponent],
    entryComponents: [FaqComponent, FaqUpdateComponent, FaqDeleteDialogComponent, FaqDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DmkFaqModule {}
