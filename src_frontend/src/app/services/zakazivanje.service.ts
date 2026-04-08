import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firma } from '../models/firma';
import { Message } from '../models/message';
import { PrivatnaBastaRaspored } from '../models/basta-privatna';
import { RestoranBastaRaspored } from '../models/basta-restoran';

@Injectable({
  providedIn: 'root'
})
export class ZakazivanjeService {

  constructor(private http: HttpClient) { }

  dohvatiFirmuSaDatimNazivom(naziv: string){
    return this.http.get<Firma>(`http://localhost:4000/korisnik/dohvatiFirmuSaDatimNazivom/${naziv}`)
  }

  dodajPrivatnuBastu(rasporedBasta: PrivatnaBastaRaspored){
    return this.http.post<Message>("http://localhost:4000/korisnik/dodajPrivatnuBastu", rasporedBasta) 
  }

  dodajBastuRestorana(rasporedBasta: RestoranBastaRaspored){
    return this.http.post<Message>("http://localhost:4000/korisnik/dodajBastuRestorana", rasporedBasta) 
  }

  dodajJSONFajl(data: FormData){
    return this.http.post<Message>("http://localhost:4000/korisnik/dodajJSONFajl", data) 
  }
}
