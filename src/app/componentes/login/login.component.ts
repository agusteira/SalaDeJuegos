import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // Importa FormsModule
import { CommonModule } from '@angular/common';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';

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
  showErrorModal: boolean = false;
  errorMessage: string = "";

  constructor(private router: Router, private firestore: Firestore, public auth: Auth) { // Inyecta Router

  }

  IniciarSesion(correo:string, clave:string){
    if (!correo || !clave || clave.length < 6) {
      this.errorMessage = "Error: No se pudo iniciar sesión. Verifica tus credenciales.";
      this.showErrorModal = true; 
    }else{
      signInWithEmailAndPassword(this.auth, this.correo, this.clave).then((res) =>{
        this.LogIniciarSesion();
        this.router.navigate(['/home']);
      }).catch((e)=>{
        this.showErrorModal = true; 
        switch(e.code){
          case "auth/invalid-email":
            this.errorMessage = "Error: email invalido.";
            break;
          case "auth/invalid-credential":
            this.errorMessage = "Error: credenciales invalidas";
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

  LogIniciarSesion(){
    let col = collection(this.firestore, "logIniciarSesion");
    addDoc (col, {
      "user": this.correo,
      "fecha": Date.now()
    })
  }

  closeModal() {
    this.showErrorModal = false; // Ocultar el modal
  }

  AccesoRapido(correo:string, clave:string) {
    this.correo =correo;
    this.clave = clave;
  }
}
