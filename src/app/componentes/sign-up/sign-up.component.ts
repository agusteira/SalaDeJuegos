import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';


import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // Importa FormsModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  correo!: string;
  clave!: string;

  constructor(private router: Router, public auth: Auth) { // Inyecta Router

  }

  Registrarse(correo:string, clave:string){
    createUserWithEmailAndPassword(this.auth, this.correo, this.clave).then((res) =>{
      this.router.navigate(['/home']);
    }).catch((e)=>console.log(e));
  }
}
