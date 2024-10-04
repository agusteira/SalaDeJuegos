import { Injectable } from '@angular/core';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firestore: Firestore) { }

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
}
