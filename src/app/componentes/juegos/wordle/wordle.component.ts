import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { WordleService } from '../../../services/wordle.service'; // Ajusta la ruta según tu estructura de carpetas

@Component({
  selector: 'app-wordle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './wordle.component.html',
  styleUrls: ['./wordle.component.scss']
})
export class WordleComponent implements OnInit {
  palabraSecreta: string = '';
  palabraActual: string[] = [];
  intentos: Array<{ letra: string, estado: string }[]> = [];
  maxIntentos: number = 6;
  intentoActual: string = ''; //Palabra a intentar
  mensaje: string = '';
  juegoTerminado: boolean = false;
  mostrarModal: boolean = false;
  cantIntentos!: number;

  constructor(public wordleService: WordleService) {}

  ngOnInit(): void {
    this.inicializarJuego();
  }

  public inicializarJuego(): void {
    this.resetJuego();
    this.palabraSecreta = this.wordleService.getPalabraAleatoria().toUpperCase();
    this.intentos = Array.from({ length: this.maxIntentos }, () => Array(this.palabraSecreta.length).fill({ letra: '', estado: '' }));
    this.palabraActual = Array(this.palabraSecreta.length).fill('_');
    //console.log(this.palabraSecreta);
  }

  public resetJuego(): void {
    this.intentos = [];
    this.intentoActual = '';
    this.mostrarModal = false;
    this.juegoTerminado = false;
    this.maxIntentos = 6;
    this.cantIntentos = 0;
  }

  manejarLetra(letra: string): void {
    if (this.juegoTerminado || this.intentoActual.length >= this.palabraSecreta.length) return;

      this.intentoActual += letra;
      this.actualizarPalabraActual();

    if (this.intentoActual.length === this.palabraSecreta.length) {
      this.evaluarIntento();
    }
  }

  public actualizarPalabraActual(): void {
    this.palabraActual = this.intentoActual.split('').concat(Array(this.palabraSecreta.length - this.intentoActual.length).fill('_'));
  }

  public evaluarIntento(): void {
    const intentoEvaluado: { letra: string, estado: string }[] = this.intentoActual.split('').map((letra, index) => ({
      letra,
      estado: this.obtenerEstado(letra, index)
    }));

    this.intentos[this.cantIntentos] = intentoEvaluado;
    this.cantIntentos++;
    this.maxIntentos--;
    this.intentoActual = '';
    this.palabraActual.fill('_');

    this.verificarResultado();
  }

  public obtenerEstado(letra: string, index: number): string {
    if (letra === this.palabraSecreta[index]) return 'correcta';
    return this.palabraSecreta.includes(letra) ? 'descolocada' : 'incorrecta';
  }

  public verificarResultado(): void {
    if (this.intentos.some(intento => intento.every(l => l.estado === 'correcta'))) {
      this.mostrarMensaje('¡Ganaste! La palabra era: ${this.palabraSecreta}');
    } else if (this.maxIntentos === 0) {
      this.mostrarMensaje(`¡Perdiste! La palabra era: ${this.palabraSecreta}`);
    }
  }

  public mostrarMensaje(mensaje: string): void {
    this.mensaje = mensaje;
    this.juegoTerminado = true;
    this.mostrarModal = true;
  }

  obtenerClaseLetra(letra: { letra: string, estado: string }): string {
    return letra.estado;
  }

  @HostListener('window:keydown', ['$event'])
  manejarInputTeclado(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.intentoActual = this.intentoActual.slice(0, -1);
      this.actualizarPalabraActual();
    } else if (/^[a-zA-Z]$/.test(event.key)) {
      this.manejarLetra(event.key.toUpperCase());
    }
  }
}
