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

   buscarGuias(data: any): Observable<any> {
    return this.http.post<any>(this.baseEndpoint + '/buscarGuias', JSON.stringify(data))
   }

   enviarMensajeConArchivo(mensaje: string,prompt:string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('mensaje', mensaje);
    formData.append('prompt', prompt);
    formData.append('archivo', file);
    return this.http.post<any>(`${this.baseEndpoint}/enviarMensajeConArchivo`, formData);
}
}
