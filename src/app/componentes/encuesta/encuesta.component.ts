import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FirebaseDBService } from '../../services/puntaje.service';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive, ReactiveFormsModule],  
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.scss'
})
export class EncuestaComponent {
  form!: FormGroup;
  mostrarModal: boolean = true;

  constructor(private fb: FormBuilder, private firebaseService: FirebaseDBService) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      numeroTelefono: ['', [Validators.required, Validators.pattern('^[0-9]{1,10}$')]],
      puntuacion: ['', Validators.required],
      juegoFavorito: ['', Validators.required],
      terminosCondiciones: [false, Validators.requiredTrue]
    });
  }

  async submit() {
    if (this.form.valid) {
      console.log(this.form.value);

      await this.firebaseService.subirEncuesta(
        this.form.value.nombre,
        this.form.value.apellido,
        this.form.value.edad,
        this.form.value.numeroTelefono,
        this.form.value.puntuacion,
        this.form.value.juegoFavorito,
        this.form.value.terminosCondiciones
      )
      this.abrirModal()
    } else {
    }
  }

  abrirModal(){

  }
}
