import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AhorcadoService } from '../../../services/ahorcado.service';
import { FirebaseDBService } from '../../../services/puntaje.service';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.scss'
})
export class AhorcadoComponent {
  //ahorcado
  palabra!: string;
  palabraOculta: string[] = [];
  letrasErroneas: string[] = [];
  letrasCorrectas: Set<string> = new Set();
  intentos: number = 6;
  teclado: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Modal
  showErrorModal: boolean = false;
  message: string = '';
  resultado: string = '';

  //Puntaje
  puntaje: number = 0;
  mensajePuntaje: string = ""

  //Usuario
  datosUsuario: any;

  //Posiciones
  mostrarTabla: boolean = false;
  topTres:any

  constructor(private ahorcadoService: AhorcadoService, private puntajeServices: FirebaseDBService, public auth: Auth, private authServices: AuthService) { }

  ngOnInit(): void {
    this.obtenerPalabra();

    //Verificar que este logueado
    onAuthStateChanged(this.auth, async (user: User | null) => {
      if (user) {
        this.datosUsuario = await this.authServices.ObtenerDatosUsuario(user.email!);

      }
    });
  }

  // Obtener una palabra Del servicio
  obtenerPalabra() {
    this.ahorcadoService.getPalabraAleatoria().subscribe(palabra => {
      this.palabra = palabra[0].toUpperCase(); 
      this.palabraOculta = Array(this.palabra.length).fill('_');
      console.log(palabra)
    });

  }

  // Maneja la letra presionada en el teclado virtual
  manejarLetra(letra: string) {
    console.log(this.palabra)
    if (this.letrasCorrectas.has(letra) || this.letrasErroneas.includes(letra)) {
      return;
    }

    if (this.palabra.includes(letra)) {
      this.letrasCorrectas.add(letra);
      this.revelarLetras(letra);
    } else {
      this.intentos--;
      this.letrasErroneas.push(letra);
    }

    if (this.intentos === 0) {
      this.mostrarErrorModal('La palabra era: ' + this.palabra, "Perdiste!");
      this.guardarPuntaje(this.puntaje);
      this.puntaje = 0;
      //this.reiniciarJuego();
    }

    if (!this.palabraOculta.includes('_')) {
      this.puntaje = this.intentos + this.puntaje + 3;
      this.mostrarErrorModal('Adivinaste la palabra: ' + this.palabra, "Ganaste!");

      //this.reiniciarJuego();
    }
  }

  mostrarErrorModal(mensaje: string, resultado:string) {
    this.resultado = resultado;
    this.message = mensaje;
    if(resultado == "Ganaste!"){
      
      this.mensajePuntaje = "Puntaje actual: " + this.puntaje
    }else{
      this.mensajePuntaje = "Puntaje final: " + this.puntaje
    }
    
    this.showErrorModal = true;
  }

  revelarLetras(letra: string) {
    for (let i = 0; i < this.palabra.length; i++) {
      if (this.palabra[i] === letra) {
        this.palabraOculta[i] = letra;
      }
    }
  }
  async reiniciarJuego() {
    this.intentos = 6;
    this.letrasCorrectas.clear();
    this.letrasErroneas = [];
    await this.obtenerPalabra();
  }

  async closeModal() {
    await this.reiniciarJuego();
    this.showErrorModal = false;
  }

  guardarPuntaje(puntaje:number){
    if (puntaje != 0){
      try{
        this.puntajeServices.subirPuntaje(puntaje, this.datosUsuario.Nombre, "ahorcado")
      }
      catch (error){
        console.error("no se pudo subir el mensaje: ",error)
      }
    }
  }

  async abrirPuntuaciones() {
    this.mostrarTabla = !this.mostrarTabla
    if(this.mostrarTabla){
      this.topTres = await this.puntajeServices.traerPuntajes("ahorcado")
    }
    
  }
}
