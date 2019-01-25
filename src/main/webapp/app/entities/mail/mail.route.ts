import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Mail } from 'app/shared/model/mail.model';
import { MailService } from './mail.service';
import { MailComponent } from './mail.component';
import { MailDetailComponent } from './mail-detail.component';
import { MailUpdateComponent } from './mail-update.component';
import { MailDeletePopupComponent } from './mail-delete-dialog.component';
import { IMail } from 'app/shared/model/mail.model';

@Injectable({ providedIn: 'root' })
export class MailResolve implements Resolve<IMail> {
    constructor(private service: MailService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Mail> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Mail>) => response.ok),
                map((mail: HttpResponse<Mail>) => mail.body)
            );
        }
        return of(new Mail());
    }
}

export const mailRoute: Routes = [
    {
        path: 'mail',
        component: MailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'dmkApp.mail.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'mail/:id/view',
        component: MailDetailComponent,
        resolve: {
            mail: MailResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'dmkApp.mail.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'mail/new',
        component: MailUpdateComponent,
        resolve: {
            mail: MailResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'dmkApp.mail.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'mail/:id/edit',
        component: MailUpdateComponent,
        resolve: {
            mail: MailResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'dmkApp.mail.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const mailPopupRoute: Routes = [
    {
        path: 'mail/:id/delete',
        component: MailDeletePopupComponent,
        resolve: {
            mail: MailResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'dmkApp.mail.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
