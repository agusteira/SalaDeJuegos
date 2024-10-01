import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WordleService {
  private palabrasDe5Letras: string[] = [
    "mujer", "silla", "casa", "roble", "piano",
    "fruta", "mesa", "coche", "luzco", "salto",
    "carta", "tigre", "brisa", "plato", "suerte",
    "papel", "radio", "globo", "puerta", "gusto",
    "fuego", "perro", "flota", "rueda", "senda",
    "lomos", "donde", "cielo", "cinta", "pasta",
    "río", "dieta", "tinta", "salir", "zorro",
    "rocio", "sabor", "rango", "suelo", "tarde",
    "matar", "carro", "hombre", "mujer", "corto",
    "baile", "fuego", "calor", "poder", "lucha",
    "zorro", "banda", "cacao", "huevo", "broma",
    "lomos", "salir", "tabla", "media", "bicho",
    "soles", "peque", "plena", "cerca", "pesca",
    "tiempo", "novio", "cacho", "salta", "piedra",
    "fiesta", "ruego", "canto", "viento", "plomo",
    "nubes", "prisa", "pasar", "donde", "sella",
    "leche", "trozo", "miedo", "bruto", "lente",
    "llave", "cubre", "bello", "sabor", "tenis",
    "tigre", "crudo", "deber", "canto", "hoja"
  ];

  constructor() {}

  getPalabraAleatoria(): string {
    const randomIndex = Math.floor(Math.random() * this.palabrasDe5Letras.length);
    return this.palabrasDe5Letras[randomIndex];
  }
}
