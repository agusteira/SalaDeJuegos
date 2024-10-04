import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { PreguntadosService } from '../../../services/preguntados.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { FirebaseDBService } from '../../../services/puntaje.service';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';

interface Pais {
  flags: {
    png: string;
  };
  translations: {
    spa: {
      common: string;
    };
  };
}

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.scss']
})
export class PreguntadosComponent implements OnInit {


  paises: Pais[] = [];
  banderaActual: string = '';
  opciones: string[] = [];
  respuestaCorrecta: string = '';
  mensaje: string = '';
  mostrarModalError: boolean = false;
  puntaje: number = 0;
  intentos: number = 3;
  puntajeFinal!:number;
  
  mostrarTabla: boolean = false;
  topTres: any
  //Usuario
  datosUsuario: any;

  constructor(private paisService: PreguntadosService, private puntajeServices: FirebaseDBService, public auth: Auth, private authServices: AuthService) {}

  async ngOnInit(): Promise<void> {
    await this.obtenerPaises();

    onAuthStateChanged(this.auth, async (user: User | null) => {
      if (user) {
        this.datosUsuario = await this.authServices.ObtenerDatosUsuario(user.email!);

      }
    });
  }

  async obtenerPaises(): Promise<void> {
    await this.paisService.obtenerPaises().subscribe({
      next: (data) => {
        this.paises = data;
        this.siguientePregunta();
      },
      error: (error) => {
        console.error('Error al obtener los países:', error);
        this.mensaje = 'No se pudo cargar la lista de países.';
        this.mostrarModalError = true;
      }
    });
  }

  siguientePregunta(): void {
    if (this.paises.length === 0) {
      console.error('No hay países disponibles.');
      return;
    }

    const paisAleatorio = this.paises[Math.floor(Math.random() * this.paises.length)];
    this.banderaActual = paisAleatorio.flags.png;
    this.respuestaCorrecta = paisAleatorio.translations.spa.common;

    this.generarOpciones(this.respuestaCorrecta);
  }

  generarOpciones(respuestaCorrecta: string): void {
    const opcionesIncorrectas = this.paises
      .filter(pais => pais.translations.spa.common !== respuestaCorrecta)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(pais => pais.translations.spa.common);

    this.opciones = [...opcionesIncorrectas, respuestaCorrecta].sort(() => 0.5 - Math.random());
  }

  verificarRespuesta(seleccionado: string): void {
    if (seleccionado === this.respuestaCorrecta) {
      this.mensaje = '¡Correcto!';
      this.puntaje++;
    } else {
      this.mensaje = `Incorrecto. La respuesta correcta era ${this.respuestaCorrecta}.`;
      this.intentos--;
    }

    if (this.intentos <= 0) {
      this.guardarPuntaje(this.puntaje);
      this.reiniciarJuego();
    }else{
      this.siguientePregunta();
    }
  }

  cerrarModal(): void {
    this.mostrarModalError = false;
    this.puntaje = 0;
    this.siguientePregunta();
  }

  reiniciarJuego(): void {

    this.intentos = 3;
    this.mensaje = 'Perdiste. ¡Suerte la proxima!';
    this.mostrarModalError = true;
    this.siguientePregunta();
  }

  guardarPuntaje(puntaje:number){
    if (puntaje != 0){
      try{
        this.puntajeServices.subirPuntaje(puntaje, this.datosUsuario.Nombre, "preguntados")
      }
      catch (error){
        console.error("no se pudo subir el mensaje: ",error)
      }
    }
  }

  async abrirPuntuaciones() {
    this.mostrarTabla = !this.mostrarTabla
    if(this.mostrarTabla){
      this.topTres = await this.puntajeServices.traerPuntajes("preguntados")
    }
    
  }
}
