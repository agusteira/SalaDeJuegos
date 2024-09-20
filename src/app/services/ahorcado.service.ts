import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AhorcadoService {
  private apiUrl = 'https://random-word-api.herokuapp.com/word?lang=es';

  constructor(private http: HttpClient) {}

  getPalabraAleatoria(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }
}
