import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AhorcadoService } from '../../../services/ahorcado.service';
import { MayorMenorApiService } from '../../../services/mayor-menor-api.service';
import { FirebaseDBService } from '../../../services/puntaje.service';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.scss'
})
export class MayorMenorComponent {

  deckId: string = '';
  cartaActual: string = '';
  cartaSiguiente: string = '';
  imagenCartaActual: string = '';
  imagenCartaSiguiente: string = '';
  mensaje: string = '';
  intentos: number = 3;
  mostrarModal: boolean = false;
  puntuacion: number = 0;
  cargandoCarta!: boolean;
  
  //Usuario
  datosUsuario: any;

  mostrarTabla: boolean = false;
  topTres: any
  
  constructor(private mayorMenorService: MayorMenorApiService,private puntajeServices: FirebaseDBService, public auth: Auth, private authServices: AuthService) { }

  ngOnInit(): void {
    this.inicializarBaraja();

    onAuthStateChanged(this.auth, async (user: User | null) => {
      if (user) {
        this.datosUsuario = await this.authServices.ObtenerDatosUsuario(user.email!);

      }
    });
  }

  inicializarBaraja() {
    this.mayorMenorService.crearBaraja().subscribe((data: any) => {
      this.deckId = data.deck_id;
      this.sacarCartaInicial();
    });
  }

  sacarCartaInicial() {
    this.mayorMenorService.sacarCarta(this.deckId).subscribe((data: any) => {
      const carta = data.cards[0];
      this.cartaActual = carta.code;
      this.imagenCartaActual = carta.image; // Guardamos la URL de la imagen
    });
  }

  sacarCartaSiguiente() {
    this.mayorMenorService.sacarCarta(this.deckId).subscribe((data: any) => {
      const carta = data.cards[0];
      this.cartaSiguiente = carta.code;
      this.imagenCartaSiguiente = carta.image; //URL de la imagen
    });
  }

  async compararCartas(opcion: string) {
    this.cargandoCarta = true;  // Mostrar el mensaje de carga
    this.mayorMenorService.sacarCarta(this.deckId).subscribe(async (data: any) => {
      const carta = data.cards[0];
      this.cartaSiguiente = carta.code;
      this.imagenCartaSiguiente = carta.image;
      
      const valorCartaActual = await this.obtenerValor(this.cartaActual);
      const valorCartaSiguiente = await this.obtenerValor(this.cartaSiguiente);
      
      if (
        (opcion === 'mayor' && valorCartaSiguiente >= valorCartaActual) ||
        (opcion === 'menor' && valorCartaSiguiente <= valorCartaActual)
      ) {
        this.puntuacion++;
        this.mensaje = 'Acertaste!';
      } else {
        this.intentos--;
        this.mensaje = `Fallaste! Te quedan ${this.intentos} intentos`;
        if (this.intentos === 0) {
          this.mostrarModal = true;
          this.mensaje = `Puntuación final: ${this.puntuacion}`;
          this.guardarPuntaje(this.puntuacion);
          this.puntuacion = 0;
        }
      }
  
      this.cartaActual = this.cartaSiguiente;
      this.imagenCartaActual = this.imagenCartaSiguiente;

      this.cargandoCarta = false;
    });
  }

  async obtenerValor(carta: string): Promise<number> {
    const valor = carta[0];

    if (valor === 'A') return 14;
    if (valor === 'K') return 13;
    if (valor === 'Q') return 12;
    if (valor === 'J') return 11;
    if (valor === "0") return 10;
    return parseInt(valor, 10);
  }

  reiniciarJuego() {
    this.intentos = 3;
    this.inicializarBaraja();
    this.mostrarModal = false;
  }

  guardarPuntaje(puntaje:number){
    if (puntaje != 0){
      try{
        this.puntajeServices.subirPuntaje(puntaje, this.datosUsuario.Nombre, "mayor-menor")
      }
      catch (error){
        console.error("no se pudo subir el mensaje: ",error)
      }
    }
  }
  async abrirPuntuaciones() {
    this.mostrarTabla = !this.mostrarTabla
    if(this.mostrarTabla){
      this.topTres = await this.puntajeServices.traerPuntajes("mayor-menor")
    }
    
  }
}
