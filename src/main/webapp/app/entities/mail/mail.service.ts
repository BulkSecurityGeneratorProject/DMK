import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IMail } from 'app/shared/model/mail.model';

type EntityResponseType = HttpResponse<IMail>;
type EntityArrayResponseType = HttpResponse<IMail[]>;

@Injectable({ providedIn: 'root' })
export class MailService {
    public resourceUrl = SERVER_API_URL + 'api/mail';

    constructor(protected http: HttpClient) {}

    create(mail: IMail): Observable<EntityResponseType> {
        return this.http.post<IMail>(this.resourceUrl, mail, { observe: 'response' });
    }

    update(mail: IMail): Observable<EntityResponseType> {
        return this.http.put<IMail>(this.resourceUrl, mail, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IMail>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IMail[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
