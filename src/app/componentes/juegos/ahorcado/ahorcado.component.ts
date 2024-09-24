import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AhorcadoService } from '../../../services/ahorcado.service';


@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.scss'
})
export class AhorcadoComponent {
  palabra!: string;
  palabraOculta: string[] = [];
  letrasErroneas: string[] = [];
  letrasCorrectas: Set<string> = new Set();
  intentos: number = 6;
  teclado: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  // Variables para las alertas
  showErrorModal: boolean = false;
  message: string = '';
  resultado: string = '';

  constructor(private ahorcadoService: AhorcadoService) { }

  ngOnInit(): void {
    this.obtenerPalabra();
  }

  // Obtener una palabra Del servicio
  obtenerPalabra() {
    this.ahorcadoService.getPalabraAleatoria().subscribe(palabra => {
      this.palabra = palabra[0].toUpperCase(); 
      this.palabraOculta = Array(this.palabra.length).fill('_');
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
      this.reiniciarJuego();
    }

    if (!this.palabraOculta.includes('_')) {
      this.mostrarErrorModal('Adivinaste la palabra: ' + this.palabra, "Ganaste!");
      this.reiniciarJuego();
    }
  }

  mostrarErrorModal(mensaje: string, resultado:string) {
    this.resultado = resultado;
    this.message = mensaje;
    this.showErrorModal = true;
  }

  closeModal() {
    this.showErrorModal = false;
  }

  revelarLetras(letra: string) {
    for (let i = 0; i < this.palabra.length; i++) {
      if (this.palabra[i] === letra) {
        this.palabraOculta[i] = letra;
      }
    }
  }
  reiniciarJuego() {
    this.intentos = 6;
    this.letrasCorrectas.clear();
    this.letrasErroneas = [];
    this.obtenerPalabra();
  }
}
