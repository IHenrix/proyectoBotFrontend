import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioComponent } from './usuario.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FuncionesAdministrativasComponent } from './admin/funciones-administrativas/funciones-administrativas.component';
import { CreacionUsuarioComponent } from './admin/funciones-administrativas/creacion-usuario/creacion-usuario.component';
import { CreacionGuiaComponent } from './admin/funciones-administrativas/creacion-guia/creacion-guia.component';
import { SupervisionConsultasComponent } from './admin/funciones-administrativas/supervision-consultas/supervision-consultas.component';
import { AccesoInformesComponent } from './admin/funciones-administrativas/acceso-informes/acceso-informes.component';


@NgModule({
  declarations: [UsuarioComponent, ChatbotComponent, FuncionesAdministrativasComponent, CreacionUsuarioComponent, CreacionGuiaComponent, SupervisionConsultasComponent, AccesoInformesComponent
  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    SharedModule
  ]
})
export class UsuarioModule { }
