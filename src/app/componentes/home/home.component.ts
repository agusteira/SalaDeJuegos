import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  horaActual: string = '';
  userLoggedIn: boolean = false;
  userName:string="";
  datosUsuario: any;
  chatVisible: boolean = false;
  mensajePlaceHolder: string = "";
  mensajes: any[] = []
  subscription!: Subscription;

  constructor(private router: Router,  private firestore: Firestore, public auth: Auth, private chatServices: ChatService) {}


  ngOnInit(): void {
    //Poner la hora en el header
    setInterval(() => {
      const ahora = new Date();
      this.horaActual = ahora.toLocaleTimeString();
      this.chatServices.obtenerMensajes().then((mensajes) => {
        this.mensajes = mensajes;
      });

    }, 1000);

    //Verificar que este logueado
    onAuthStateChanged(this.auth, async (user: User | null) => {
      if (user) {
        this.userLoggedIn = true;
        this.datosUsuario = await this.ObtenerDatosUsuario(user.email!);
        if (this.datosUsuario) {
          this.userName = this.datosUsuario.Nombre; // Si el usuario tiene un displayName, lo muestra
        }
      } else {
        this.userLoggedIn = false;
      }
    });
  }





  navigateTo(component: string) {
    this.router.navigate([`/${component}`]);
  }


  async ObtenerDatosUsuario(correo: string){
    const col = collection(this.firestore, 'Registro');
    const q = query(col, where('Email', '==', correo));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No se encontró el usuario con el email proporcionado.');
      return null;
    }

    let usuarioData: any;
    querySnapshot.forEach((doc) => {
      usuarioData = { id: doc.id, ...doc.data() };
    });

    console.log('Datos del usuario:', usuarioData);
    return usuarioData; // Devuelve los datos del usuario encontrado
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.userLoggedIn = false;
      this.userName = '';
      this.goToLogin()
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  toggleChat(): void {
    this.chatVisible = !this.chatVisible; // Alterna la visibilidad del chat
  }

  async enviarMensaje(mensaje:string){
    if(mensaje != null && mensaje.length > 0){
      try{
        this.chatServices.subirMensaje(mensaje, this.datosUsuario.Nombre)
        
      }
      catch{
        console.log("no se pudo subir el mensaje")
      }
    }
    
  }

}
