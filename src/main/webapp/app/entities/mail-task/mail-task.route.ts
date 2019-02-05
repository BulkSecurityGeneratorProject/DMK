import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { MailTask } from 'app/shared/model/mail-task.model';
import { MailTaskService } from './mail-task.service';
import { MailTaskComponent } from './mail-task.component';
import { MailTaskDetailComponent } from './mail-task-detail.component';
import { MailTaskUpdateComponent } from './mail-task-update.component';
import { MailTaskDeletePopupComponent } from './mail-task-delete-dialog.component';
import { IMailTask } from 'app/shared/model/mail-task.model';

@Injectable({ providedIn: 'root' })
export class MailTaskResolve implements Resolve<IMailTask> {
    constructor(private service: MailTaskService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<MailTask> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<MailTask>) => response.ok),
                map((mailTask: HttpResponse<MailTask>) => mailTask.body)
            );
        }
        return of(new MailTask());
    }
}

export const mailTaskRoute: Routes = [
    {
        path: 'mail-task',
        component: MailTaskComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'dmkApp.mailTask.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'mail-task/:id/view',
        component: MailTaskDetailComponent,
        resolve: {
            mailTask: MailTaskResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'dmkApp.mailTask.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'mail-task/new',
        component: MailTaskUpdateComponent,
        resolve: {
            mailTask: MailTaskResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'dmkApp.mailTask.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'mail-task/:id/edit',
        component: MailTaskUpdateComponent,
        resolve: {
            mailTask: MailTaskResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'dmkApp.mailTask.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const mailTaskPopupRoute: Routes = [
    {
        path: 'mail-task/:id/delete',
        component: MailTaskDeletePopupComponent,
        resolve: {
            mailTask: MailTaskResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'dmkApp.mailTask.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
