import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AhorcadoService } from '../../../services/ahorcado.service';

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.scss'
})
export class MayorMenorComponent {
  baraja: string[] = [];
  cartaActual: string = '';
  cartaSiguiente: string = '';
  mensaje: string = '';
  intentos: number = 3;
  mostrarModal: boolean = false;
  puntuacion:any = 0;

  constructor() { }

  ngOnInit(): void {
    this.inicializarBaraja();
    this.sacarCartaInicial();
  }

  inicializarBaraja() {
    const valores = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const palos = ['♠', '♣', '♥', '♦'];
    this.baraja = [];

    for (let valor of valores) {
      for (let palo of palos) {
        this.baraja.push(`${valor}${palo}`);
      }
    }

    this.baraja = this.baraja.sort(() => Math.random() - 0.5);
  }

  sacarCartaInicial() {
    this.cartaActual = this.baraja.pop()!;
  }

  sacarCartaSiguiente() {
    this.cartaSiguiente = this.baraja.pop()!;
  }

  compararCartas(opcion: string) {
    this.sacarCartaSiguiente();
    const valorCartaActual = this.obtenerValor(this.cartaActual);
    const valorCartaSiguiente = this.obtenerValor(this.cartaSiguiente);

    if (
      (opcion === 'mayor' && valorCartaSiguiente > valorCartaActual) ||
      (opcion === 'menor' && valorCartaSiguiente < valorCartaActual)
    ) {
      this.puntuacion++;
      this.mensaje = '¡Acertaste!';
    } else {
      this.intentos--;
      this.mensaje = `¡Fallaste! Te quedan ${this.intentos} intentos.`;
      if (this.intentos === 0) {
        this.mostrarModal = true;
        
        this.mensaje = `Puntuacion final: ${this.puntuacion}`;
        this.puntuacion = 0;
      }
    }

    this.cartaActual = this.cartaSiguiente;
  }

  obtenerValor(carta: string): number {
    const valor = carta.slice(0, -1);
    if (valor === 'A') return 14;
    if (valor === 'K') return 13;
    if (valor === 'Q') return 12;
    if (valor === 'J') return 11;
    return parseInt(valor, 10);
  }

  reiniciarJuego() {
    this.intentos = 3;
    this.inicializarBaraja();
    this.sacarCartaInicial();
    this.mostrarModal = false;
  }
}
