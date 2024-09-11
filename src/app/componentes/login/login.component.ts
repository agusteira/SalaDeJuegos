import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // Importa FormsModule
import { CommonModule } from '@angular/common';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  correo!: string;
  clave!: string;

  constructor(private router: Router, public auth: Auth) { // Inyecta Router

  }

  IniciarSesion(correo:string, clave:string){
    signInWithEmailAndPassword(this.auth, this.correo, this.clave).then((res) =>{
      this.router.navigate(['/home']);
    }).catch((e)=>console.log(e));
  }
}
