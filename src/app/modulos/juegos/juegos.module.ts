import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AhorcadoComponent } from '../../componentes/juegos/ahorcado/ahorcado.component';
import { MayorMenorComponent } from '../../componentes/juegos/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from '../../componentes/juegos/preguntados/preguntados.component';

import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';






const routes: Routes = [
  {
    path: "ahorcado",
    component: AhorcadoComponent
  },{
    path: "mayorMenor",
    component: MayorMenorComponent
  },{
    path: "preguntados",
    component: PreguntadosComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
 
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()) // Configura HttpClient aquí
  ],
  exports:[RouterModule]
})
export class JuegosModule { }
