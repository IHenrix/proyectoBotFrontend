import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/service/auth.service';
import { alertNotificacion } from 'src/app/util/helpers';
import { environment } from 'src/environments/environment';
import Swal, { SweetAlertIcon } from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  version:string;
  constructor(private router: Router, private spinner: NgxSpinnerService,private _authService:AuthService,private msalService: MsalService) {
    this.version = environment.version;
  }
  NAME_SYSTEM:string=environment.nameSystem.toUpperCase();
  hide = true;
  passwordDefault:string=environment.passwordDefault;

  async ngOnInit() {
    try {
      await this.msalService.instance.initialize();  // Asegura la inicialización
      this.spinner.show();
      this.msalService.instance.handleRedirectPromise().then((response) => {
        if (response !== null && response.account) {
          //console.log('Token de acceso capturado:', response.accessToken);
          console.log('Usuario autenticado:', response.account.username);
          this.iniciarSesion(response.account.username,this.passwordDefault);
        } else {
          console.log('usuario no está autenticado');
        }
        this.spinner.hide();
      }).catch(error => {
        alertNotificacion('Error al manejar el redireccionamiento:<br>'+error);
        console.error('Error al manejar el redireccionamiento:', error);
        this.spinner.hide();
      });

    } catch (error) {
      console.error('Error al inicializar MSAL:', error);
      this.spinner.hide();
    }
  }
  subFormLogin = false;
  form_login = new FormGroup({
    usuario: new FormControl("", [Validators.required]),
    pass: new FormControl("", [Validators.required]),
  });

  get getflogin() {
    return this.form_login.controls;
  }

  accesoSistema() {
    this.subFormLogin = true;
    if (this.form_login.invalid) {
      return;
    }
    let username = this.getflogin.usuario.value;
    let pass = this.getflogin.pass.value;
    this.iniciarSesion(username,pass);
  }
  iniciarSesion(username:string,pass:string){
    this.spinner.show();
    this._authService.login(username, pass).subscribe(
      (response) => {
        this._authService.saveToken(response.access_token);
        this._authService.saveUser(response.access_token);
        //this.router.navigate([this._authService.obtenerRol() === "ROLE_USER" ? "/usuario" : "/usuario/admin/funciones"])
        this.router.navigate([this._authService.obtenerRol() === "ROLE_USER" ? "/usuario" : "/usuario/admin/funciones"])
        .then(() => {
          window.location.reload();
        });
        this.spinner.hide();
      },
      (err) => {
        if (err.status != 500) {
          let icon_error = "error" ;
          let icon_error_des_title = "Error no especifico al momento de ingresar al módulo";
          let icon_error_des = "Por favor comunicarse con soporte del "+environment.nameSystem;
          switch (err.status) {
            case 400:
              icon_error_des_title = err.error.error_description==="Bad credentials"?"Dni o contraseña incorrecta":err.error.error_description;
              if (err.error.error == "invalid_grant") {
                icon_error_des = "Por favor verificar si sus credenciales son correctas";
              }
              break;
            case 401:
              icon_error = "info";
              icon_error_des_title = err.error.error_description;
              icon_error_des = "Por favor validar que los campos sean correctos";
              break;
            case 403:
              icon_error = "warning";
              icon_error_des_title = environment.nameSystem;
              break;
            case 0:
              icon_error_des_title = "El servidor del sistema se encuentra en actualización o apagado";
              break;
          }
          Swal.fire({ icon: icon_error as SweetAlertIcon, title: icon_error_des_title, text: icon_error_des });
        }
        else {
          Swal.fire({ icon: "error", title: "Se ha producido un error al intentar ingresar al módulo(Esto puede ser debido por una desconexion a la base de datos o algun error en el programa)", text: "Intente nuevamente,si persiste por favor comunicarse con Mesa de Ayuda o personal de soporte del Módulo de Mantenimiento de Secciones Registrales" });
        }
        this.spinner.hide();

      }
    );
  }
  ngOnDestroy() {
    this.msalService.instance.setActiveAccount(null);
    sessionStorage.clear();
    console.log('Sesión de MSAL local eliminada');
  }

  loginMicrosoft() {
    const loginRequest = {
      scopes: ['user.read']
    };
    this.msalService.loginRedirect(loginRequest);
  }
}
