import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMail } from 'app/shared/model/mail.model';

@Component({
    selector: 'jhi-mail-detail',
    templateUrl: './mail-detail.component.html'
})
export class MailDetailComponent implements OnInit {
    mail: IMail;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ mail }) => {
            this.mail = mail;
        });
    }

    previousState() {
        window.history.back();
    }
}
