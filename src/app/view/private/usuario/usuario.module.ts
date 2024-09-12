import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioComponent } from './usuario.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FuncionesAdministrativasComponent } from './admin/funciones-administrativas/funciones-administrativas.component';
import { CreacionUsuarioComponent } from './admin/funciones-administrativas/creacion-usuario/creacion-usuario.component';
import { CreacionGuiaComponent } from './admin/funciones-administrativas/creacion-guia/creacion-guia.component';


@NgModule({
  declarations: [UsuarioComponent, ChatbotComponent, FuncionesAdministrativasComponent, CreacionUsuarioComponent, CreacionGuiaComponent
  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    SharedModule
  ]
})
export class UsuarioModule { }
