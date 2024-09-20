import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { ErrorComponent } from './componentes/error/error.component';
import { HomeComponent } from './componentes/home/home.component';
import { SignUpComponent  } from './componentes/sign-up/sign-up.component';
import { QuienSoyComponent } from './componentes/quien-soy/quien-soy.component';


export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'quien-soy', component: QuienSoyComponent },
  { path: 'error', component: ErrorComponent },
  { path: "juegos", loadChildren: ()=> import ("./modulos/juegos/juegos.module").then(m => m.JuegosModule)},
  { path: '', redirectTo: '/home', pathMatch: 'full' },  // Ruta por defecto
  { path: '**', component: ErrorComponent }  // Ruta para errores 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
