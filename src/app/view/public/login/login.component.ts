import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';
import Swal, { SweetAlertIcon } from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  version:string;
  constructor(private router: Router, private spinner: NgxSpinnerService,private _authService:AuthService) {
    this.version = environment.version;
  }

  NAME_SYSTEM:string=environment.nameSystem.toUpperCase();
  hide = true;

  ngOnInit(): void {


  }
  subFormLogin = false;
  form_login = new FormGroup({
    usuario: new FormControl("", [Validators.required]),
    pass: new FormControl("", [Validators.required]),
  });

  get getflogin() {
    return this.form_login.controls;
  }

  login() {
    this.subFormLogin = true;
    if (this.form_login.invalid) {
      return;
    }
    let username = this.getflogin.usuario.value;
    let pass = this.getflogin.pass.value;

   this.spinner.show();
    this._authService.login(username, pass).subscribe(
      (response) => {
        this._authService.saveToken(response.access_token);
        this._authService.saveUser(response.access_token);
        this.router.navigate(["/usuario"]);
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
              icon_error_des = environment.nameSystem;
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
}
