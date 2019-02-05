import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Faq } from 'app/shared/model/faq.model';
import { FaqService } from './faq.service';
import { FaqComponent } from './faq.component';
import { FaqDetailComponent } from './faq-detail.component';
import { FaqUpdateComponent } from './faq-update.component';
import { FaqDeletePopupComponent } from './faq-delete-dialog.component';
import { IFaq } from 'app/shared/model/faq.model';

@Injectable({ providedIn: 'root' })
export class FaqResolve implements Resolve<IFaq> {
    constructor(private service: FaqService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Faq> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Faq>) => response.ok),
                map((faq: HttpResponse<Faq>) => faq.body)
            );
        }
        return of(new Faq());
    }
}

export const faqRoute: Routes = [
    {
        path: 'faq',
        component: FaqComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'dmkApp.faq.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'faq/:id/view',
        component: FaqDetailComponent,
        resolve: {
            faq: FaqResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'dmkApp.faq.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'faq/new',
        component: FaqUpdateComponent,
        resolve: {
            faq: FaqResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'dmkApp.faq.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'faq/:id/edit',
        component: FaqUpdateComponent,
        resolve: {
            faq: FaqResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'dmkApp.faq.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const faqPopupRoute: Routes = [
    {
        path: 'faq/:id/delete',
        component: FaqDeletePopupComponent,
        resolve: {
            faq: FaqResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'dmkApp.faq.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
