import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ChatBotService {
    constructor(
        private http: HttpClient,
    ) {
    }
    private baseEndpoint = environment.urlApiMicroservices.domain + '/chatbot';
    enviarMensaje(data: any): Observable<any> {
      return this.http.post<any>(this.baseEndpoint + '/enviarMensaje', JSON.stringify(data))
   }
}
