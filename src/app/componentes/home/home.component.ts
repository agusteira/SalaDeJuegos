import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { delay, Subscription } from 'rxjs';
import { fromTask } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  
  horaActual: string = '';
  userLoggedIn: boolean = false;
  userName:string="";
  datosUsuario: any;
  chatVisible: boolean = false;
  mensajePlaceHolder: string = "";
  mensajes: any[] = []
  subscription!: Subscription;

  intervaloHora: any;
  intervaloChat: any;

  constructor(private router: Router,  private firestore: Firestore, public auth: Auth, private chatServices: ChatService, private authServices: AuthService) {}

  async ngOnInit(): Promise<void> {
    //Poner la hora en el header
    this.intervaloHora = setInterval(() => {
      const ahora = new Date();
      this.horaActual = ahora.toLocaleTimeString();
    }, 1000);

     this.intervaloChat = setInterval( () => {
      if(this.chatVisible){ //Solamente traigo el chat si esta visible
        this.traerChat();
      }
    }, 10000);

    //Verificar que este logueado
    onAuthStateChanged(this.auth, async (user: User | null) => {
      if (user) {
        this.userLoggedIn = true;
        this.datosUsuario = await this.authServices.ObtenerDatosUsuario(user.email!);
        if (this.datosUsuario) {
          this.userName = this.datosUsuario.Nombre; // Si el usuario tiene un displayName, lo muestra
        }
      } else {
        this.userLoggedIn = false;
      }
    });
  }

  ngOnDestroy(): void {
    //Detener intervalos
    if (this.intervaloHora) {
      clearInterval(this.intervaloHora);
    }
    if(this.intervaloChat){
      clearInterval(this.intervaloChat);
    }
  }


  /*=======COSAS DEL USUARIO============= */

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

  async ObtenerDatosUsuario(correo: string){
    const col = collection(this.firestore, 'Registro');
    const q = query(col, where('Email', '==', correo));

    const querySnapshot = await getDocs(q);
    console.log("consulta datos usuario")

    if (querySnapshot.empty) {
      console.log('No se encontró el usuario con el email proporcionado.');
      return null;
    }

    let usuarioData: any;
    querySnapshot.forEach((doc) => {
      usuarioData = { id: doc.id, ...doc.data() };
    });

    return usuarioData; // Devuelve los datos del usuario encontrado
  }

  /*==============CHAT=================*/
  async traerChat(){
    await this.chatServices.obtenerMensajes().then((mensajes) => {
      this.mensajes = mensajes;
    });
  }

  async abrirChat():Promise<void> {
    this.chatVisible = !this.chatVisible;
    if(this.chatVisible){
      await this.traerChat(); 
      this.scrollToBottom();
    }
  }

  async enviarMensaje(mensaje:string){
    if(mensaje != null && mensaje.length > 0){
      try{
        this.chatServices.subirMensaje(mensaje, this.datosUsuario.Nombre)
        this.mensajePlaceHolder = ""
        await this.traerChat();
        this.scrollToBottom(); // Asegurarse de que el scroll siempre esté abajo
      }
      catch (error){
        console.error("no se pudo subir el mensaje: ",error)
      }
    }
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }, 1);  // Esperamos 100 ms para asegurarnos de que el DOM se ha actualizado completamente
    } catch (err) {
      console.error("Error en el scroll:", err);
    }
  }

  /*===============OTROS===============*/
  navigateTo(component: string) {
    this.router.navigate([`/${component}`]);
  }

  

}
