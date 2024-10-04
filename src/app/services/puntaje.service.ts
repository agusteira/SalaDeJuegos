import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, getDocs, limit, orderBy, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDBService {

  constructor(private firestore: Firestore) { }

  async subirPuntaje(puntaje: number, usuario: any, juego: string){
    
    const ahora = new Date();
    const dia = ahora.getDate().toString().padStart(2, '0');
    const mes = (ahora.getMonth() + 1).toString().padStart(2, '0'); // Meses van de 0 a 11, por eso +1
    const hora = ahora.getHours().toString().padStart(2, '0');
    const minuto = ahora.getMinutes().toString().padStart(2, '0');

    const fechaHoraActual = `${dia}/${mes} ${hora}:${minuto}`;

    let col = collection(this.firestore, "Puntajes");
    addDoc (col, {
      "Puntaje": puntaje,
      "Usuario": usuario,
      "Juego": juego,
      "Fecha": fechaHoraActual,
      "datetime": Date.now()
    })
    console.log("Puntaje subido subido")
  }

  async traerPuntajes(juego:string){
    const col = collection(this.firestore, 'Puntajes');
    const q = query(col, where("Juego", "==", juego),orderBy('Puntaje', 'desc'), limit(3)); //LIMITADO PARA NO REALIZAR CONSULTAS QUE CONSUMAN

    const querySnapshot = await getDocs(q);
    console.log("Consulta obteniendo puntajes")
    const puntajes: any[] = [];

    querySnapshot.forEach((doc) => {
      puntajes.push({ id: doc.id, ...doc.data() });
    });

    console.log(puntajes)

    return puntajes;

  }

  async subirEncuesta(nombre:string, apellido:string, edad:number ,
    numeroTelefono:number, puntuacion:number, juegoFavorito:string, terminosCondiciones:boolean
  ){
    let col = collection(this.firestore, "Encuestas");
    addDoc (col, {
      "nombre": nombre,
      "apellido": apellido,
      "edad": edad,
      "numeroTelefono": numeroTelefono,
      "puntuacion": puntuacion,
      "juegoFavorito": juegoFavorito,
      "terminosCondiciones": terminosCondiciones,
    })
    console.log("Encuesta subida correctamente")
  }
}
