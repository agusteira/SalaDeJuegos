import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';


import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // Importa FormsModule
import { CommonModule } from '@angular/common';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';

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
  confirmarClave!: string;
  nombre!: string;
  showErrorModal: boolean = false;
  errorMessage: string = "";

  constructor(private router: Router, public auth: Auth, private firestore: Firestore) { // Inyecta Router

  }

  Registrarse(correo:string, clave:string, confirmacionClave:string, nombre:string){
    if (!correo || !clave || !nombre ||clave.length < 6 || nombre.length < 5) {
      this.errorMessage = "Error: credenciales invalidas";
      this.showErrorModal = true; 
    }else if(clave != confirmacionClave){
      this.errorMessage = "Error: las contraseñas NO coinciden";
      this.showErrorModal = true; 
    }
    else{
      createUserWithEmailAndPassword(this.auth, correo, clave).then((res) =>{
        this.GuardarDatosUsuarios(nombre,correo)
        this.router.navigate(['/home'])
      }).catch((e)=>{
        this.showErrorModal = true; 
        switch(e.code){
          case "auth/invalid-email":
            this.errorMessage = "Error: email invalido.";
            break;
          case "auth/email-already-in-use":
            this.errorMessage = "Error: email invalido.";
            break;
          case "auth/network-request-failed":
            this.errorMessage = "Error: Hubo un error con el internet";
            break;
          default:
            this.errorMessage = e.code;
        }
      });
    }
  }

  GuardarDatosUsuarios(nombre:string, correo:string){
    let col = collection(this.firestore, "Registro");
    addDoc (col, {
      "Email": correo,
      "Nombre": nombre,
      "Fecha": Date.now()
    })
  }

  closeModal() {
    this.showErrorModal = false; // Ocultar el modal
  }

}
