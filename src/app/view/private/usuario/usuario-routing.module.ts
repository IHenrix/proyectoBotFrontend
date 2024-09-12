import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { FuncionesAdministrativasComponent } from './admin/funciones-administrativas/funciones-administrativas.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/usuario/chatbot',
    pathMatch: 'full',
  },
  { path: 'chatbot', component: ChatbotComponent},
  { path: 'admin/funciones', component: FuncionesAdministrativasComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
