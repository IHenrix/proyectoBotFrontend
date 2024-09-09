import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatbotComponent } from './chatbot/chatbot.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/usuario/chatbot',
    pathMatch: 'full',
  },
  { path: 'chatbot', component: ChatbotComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
