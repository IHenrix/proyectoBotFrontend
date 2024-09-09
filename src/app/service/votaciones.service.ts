import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VotacionesService {
    constructor(
        private http: HttpClient,
    ) {
    }

    private baseEndpoint = environment.urlApiMicroservices.domain + '/votaciones';

    listVotaciones(): Observable<any> {
        return this.http.get<any>(this.baseEndpoint + '/listVotaciones')
    }
    listpostulanVota(votacion: number): Observable<any> {
        let params = new HttpParams();
        params = params.append('votacion', votacion);
        return this.http.get<any>(this.baseEndpoint + '/listpostulanVota', { params: params })
    }

    validUsuVota(data: any): Observable<any> {
        return this.http.post<any>(this.baseEndpoint + '/validUsuVota', JSON.stringify(data))
    }

    votaUsu(data: any): Observable<any> {
        return this.http.post<any>(this.baseEndpoint + '/votaUsu', JSON.stringify(data))
    }
}
