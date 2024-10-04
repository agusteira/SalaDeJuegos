import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { WordleService } from '../../../services/wordle.service'; // Ajusta la ruta según tu estructura de carpetas
import { FirebaseDBService } from '../../../services/puntaje.service';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { AuthService } from '../../../services/auth.service';

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

  //Puntaje
  puntaje: number = 0;
  mensajePuntaje: string = ""

  //Usuario
  datosUsuario: any;

  mostrarTabla: boolean = false;
  topTres:any

  constructor(public wordleService: WordleService,  private puntajeServices: FirebaseDBService, public auth: Auth, private authServices: AuthService) {}

  ngOnInit(): void {
    this.inicializarJuego();

    onAuthStateChanged(this.auth, async (user: User | null) => {
      if (user) {
        this.datosUsuario = await this.authServices.ObtenerDatosUsuario(user.email!);

      }
    });
  }

  public inicializarJuego(): void {
    this.resetJuego();
    this.palabraSecreta = this.wordleService.getPalabraAleatoria().toUpperCase();
    this.intentos = Array.from({ length: this.maxIntentos }, () => Array(this.palabraSecreta.length).fill({ letra: '', estado: '' }));
    this.palabraActual = Array(this.palabraSecreta.length).fill('_');
    console.log(this.palabraSecreta);
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
      this.puntaje = this.puntaje+this.maxIntentos + 3;
      this.mostrarMensaje('¡Ganaste! La palabra era: ' + this.palabraSecreta);
      this.mensajePuntaje = "Puntaje actual: " + this.puntaje
      console.log(this.puntaje)
    } else if (this.maxIntentos === 0) {
      this.mostrarMensaje(`¡Perdiste! La palabra era: ${this.palabraSecreta}`);
      this.mensajePuntaje = "Puntaje final: " + this.puntaje
      this.guardarPuntaje(this.puntaje)
      this.puntaje = 0;
      console.log(this.puntaje)
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

  guardarPuntaje(puntaje:number){
    if (puntaje != 0){
      try{
        this.puntajeServices.subirPuntaje(puntaje, this.datosUsuario.Nombre, "wordle")
      }
      catch (error){
        console.error("no se pudo subir el mensaje: ",error)
      }
    }
  }

  async abrirPuntuaciones() {
    this.mostrarTabla = !this.mostrarTabla
    if(this.mostrarTabla){
      this.topTres = await this.puntajeServices.traerPuntajes("wordle")
    }
    
  }
}
