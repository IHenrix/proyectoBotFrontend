import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from '../interfaces/auth/usuario';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtservice: JwtHelperService = new JwtHelperService();
  private _usuario: Usuario;
  constructor(

    private http: HttpClient,
  ) {
  }

  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (
      this._usuario == null &&
      localStorage.getItem("us_Bot") != null
    ) {
      this._usuario = JSON.parse(
        localStorage.getItem("us_Bot")
      ) as Usuario;
      return this._usuario;
    }
    console.log("sADASDASDASD")
    return new Usuario();
  }

  login(usuario: string, password: string): Observable<any> {
    const urlEndpoint = environment.urlApiMicroservices.domain + "/oauth/token";
    const credenciales = btoa(environment.authAngular.username + ":" + environment.authAngular.password);
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + credenciales,
    });
    let params = new URLSearchParams();
    params.set("username", usuario.toUpperCase());
    params.set("password", password);
    params.set("grant_type", "password");
    return this.http.post<any>(urlEndpoint, params.toString(), {
      headers: httpHeaders,
    });
  }

  saveToken(accesstoken: string): void {
    localStorage.setItem("tokenBots", accesstoken);
  }
  saveUser(accesstoken: string): void {
    let payload = this.decodeAccessToken(accesstoken);
    this._usuario = new Usuario();
    this._usuario.nombre_completo = payload.nombre_completo;
    this._usuario.nombre = payload.nombre;
    this._usuario.paterno = payload.apellido_paterno;
    this._usuario.materno = payload.apellido_materno;
    this._usuario.sexo = payload.sexo;
    this._usuario.codigo = payload.codigo;
    this._usuario.carrera = payload.carrera;
    this._usuario.email = payload.email;
    this._usuario.telefono = payload.telefono;
    this._usuario.roles = payload.authorities;
    localStorage.setItem("us_Bot", JSON.stringify(this._usuario));
  }

  decodeAccessToken(accesstoken: string): any {
    if (accesstoken != null) {
      return this.jwtservice.decodeToken(accesstoken);
    }
    return null;
  }
  token(): string {
    return localStorage.getItem("tokenBots");
  }

  logout() {
    localStorage.removeItem("tokenBots");
    localStorage.removeItem("us_Bot");
  }


  authenticated(): boolean {
    let valid: string = this.token();
    if (valid != '') {
      return true;
    }
    return false;
  }

  obtenerRol(): string {
    if (this._usuario && Array.isArray(this._usuario.roles) && this._usuario.roles.length > 0) {
      return this._usuario.roles[0]; 
    }
    return 'No hay roles disponibles';
  }
  convertirRol(rol: string): string {
    switch (rol) {
      case 'ROLE_USER':
        return 'ALUMNO';
      case 'ROLE_DOCENTE':
        return 'DOCENTE';
      case 'ROLE_ADMIN':
        return 'ADMINISTRADOR';
      default:
        return '-';
    }
  }
  mostrarRolActual():string{
    return this.convertirRol(this.obtenerRol());
  }


}
