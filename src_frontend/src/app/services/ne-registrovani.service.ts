import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Firma } from '../models/firma';

@Injectable({
  providedIn: 'root'
})
export class NeRegistrovaniService {

  constructor(private http: HttpClient) { }

  dohvatiBrojVlasnika(){
    return this.http.get<string>("http://localhost:4000/korisnik/dohvatiBrojVlasnika");
  }

  dohvatiBrojDekoratera(){
    return this.http.get<string>("http://localhost:4000/korisnik/dohvatiBrojDekoratera");
  }

  dohvatiSveFirme(){
    return this.http.get<Firma[]>("http://localhost:4000/korisnik/dohvatiSveFirme");
  }

  dohvatiBrojDekorisanihBasta(){
    return this.http.get<string>("http://localhost:4000/korisnik/dohvatiBrojDekorisanihBasta");
  }

  dohvatiPosloveZaTrazenoVreme(){
    return this.http.get<string[]>("http://localhost:4000/korisnik/dohvatiPosloveZaTrazenoVreme");
  }
}
