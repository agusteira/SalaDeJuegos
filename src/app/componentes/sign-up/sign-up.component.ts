import { Component, OnInit } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Form, FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';  // Importa FormsModule
import { CommonModule } from '@angular/common';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { confirmarClaveValidator } from '../../validadores/repiteClave';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent  implements OnInit {
  showErrorModal: boolean = false;
  errorMessage: string = "";
  form!: FormGroup;

  //#region getters
  get nombre() {
    return this.form.get('nombre');
  }
  get correo() {
    return this.form.get('correo');
  }
  get clave() {
    return this.form.get('clave');
  }
  get confirmarClave() {
    return this.form.get('confirmarClave');
  }
  //#endregion
  
  constructor(private router: Router, public auth: Auth, private firestore: Firestore) { 
  }


  ngOnInit(): void {
    this.form = new FormGroup({
      nombre: new FormControl("", [Validators.pattern('^[a-zA-Z]+$')]),
      correo: new FormControl("", Validators.email),
      clave: new FormControl("", Validators.minLength(7)),
      confirmarClave: new FormControl("", Validators.required)
    }, confirmarClaveValidator())
  };

  Registrarse(){
    const correo = this.form.get('correo')?.value;
    const clave = this.form.get('clave')?.value;
    const confirmarClave = this.form.get('confirmarClave')?.value;
    const nombre = this.form.get('nombre')?.value;

    if (!correo || !clave || !nombre ||clave.length < 6) {
      this.errorMessage = "Error: credenciales invalidas";
      this.showErrorModal = true; 
    }else if(clave != confirmarClave){
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
          this.errorMessage = "Error: email YA en uso.";
          break;
        case "auth/network-request-failed":
          this.errorMessage = "Error: Hubo un error con el internet";
          break;
        default:
          this.errorMessage = e.code;
      }
    });
  }}

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
