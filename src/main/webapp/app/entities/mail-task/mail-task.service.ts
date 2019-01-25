import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IMailTask } from 'app/shared/model/mail-task.model';

type EntityResponseType = HttpResponse<IMailTask>;
type EntityArrayResponseType = HttpResponse<IMailTask[]>;

@Injectable({ providedIn: 'root' })
export class MailTaskService {
    public resourceUrl = SERVER_API_URL + 'api/mail-tasks';

    constructor(protected http: HttpClient) {}

    create(mailTask: IMailTask): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(mailTask);
        return this.http
            .post<IMailTask>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(mailTask: IMailTask): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(mailTask);
        return this.http
            .put<IMailTask>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IMailTask>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IMailTask[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(mailTask: IMailTask): IMailTask {
        const copy: IMailTask = Object.assign({}, mailTask, {
            lastUpdate: mailTask.lastUpdate != null && mailTask.lastUpdate.isValid() ? mailTask.lastUpdate.format(DATE_FORMAT) : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.lastUpdate = res.body.lastUpdate != null ? moment(res.body.lastUpdate) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((mailTask: IMailTask) => {
                mailTask.lastUpdate = mailTask.lastUpdate != null ? moment(mailTask.lastUpdate) : null;
            });
        }
        return res;
    }
}
