import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { DmkFaqModule } from './faq/faq.module';
import { DmkMailModule } from './mail/mail.module';
import { DmkMailTaskModule } from './mail-task/mail-task.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        DmkFaqModule,
        DmkMailModule,
        DmkMailTaskModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DmkEntityModule {}
