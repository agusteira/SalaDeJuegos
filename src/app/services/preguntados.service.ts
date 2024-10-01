import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class PreguntadosService {
  constructor(private http: HttpClient) {}

  obtenerPaises(): Observable<Pais[]> {
    return this.http.get<Pais[]>('https://restcountries.com/v3.1/all');
  }
}