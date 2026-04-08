import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class PocetnaService {

  constructor(private http: HttpClient) { }

  uri = 'http://localhost:4000'

  loginService(korIme: string, lozinka: string) {

    const data = {
      korIme: korIme,
      lozinka: lozinka
    }

    return this.http.post<User | {message: string }>("http://localhost:4000/korisnik/login", data)
  }

  postaviNovuSifru(korIme: string, staraLozinka: string, novaLozinka: string) {

    const data = {
      korIme: korIme,
      staraLozinka: staraLozinka,
      novaLozinka: novaLozinka
    }

    return this.http.post<Message>("http://localhost:4000/korisnik/postaviNovuSifru", data)
  }
}
