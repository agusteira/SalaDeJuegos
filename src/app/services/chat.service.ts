import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { addDoc, collection, Firestore, query, getDocs, where, orderBy } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(public auth: Auth, private firestore: Firestore) { }

  subirMensaje(mensaje:string, usuario:String){

    const ahora = new Date();
    const dia = ahora.getDate().toString().padStart(2, '0');
    const mes = (ahora.getMonth() + 1).toString().padStart(2, '0'); // Meses van de 0 a 11, por eso +1
    const hora = ahora.getHours().toString().padStart(2, '0');
    const minuto = ahora.getMinutes().toString().padStart(2, '0');

    const fechaHoraActual = `${dia}/${mes} ${hora}:${minuto}`;

    let col = collection(this.firestore, "Chat");
    addDoc (col, {
      "Mensaje": mensaje,
      "Nombre": usuario,
      "Fecha": fechaHoraActual,
      "datetime": Date.now()
    })
    console.log("mensaje subido")
  }

  async obtenerMensajes(){
    const col = collection(this.firestore, 'Chat');
    const q = query(col, orderBy('Fecha', 'desc'));

    const querySnapshot = await getDocs(q);

    const mensajes: any[] = [];

    querySnapshot.forEach((doc) => {
      mensajes.push({ id: doc.id, ...doc.data() });
    });
    return mensajes;
  }
}
