import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { User } from '../models/user';
import { Firma } from '../models/firma';
import { PrivatnaBastaRaspored } from '../models/basta-privatna';
import { RestoranBastaRaspored } from '../models/basta-restoran';
import { Odrzavanje } from '../models/odrzavanje';

@Injectable({
  providedIn: 'root'
})
export class VlasnikService {

  constructor(private http: HttpClient) { }

  // proveriJelMejlPostoji(gmail: string, korIme: string){
  //   const data={
  //     gmail: gmail,
  //     korIme: korIme
  //   }
  //   return this.http.post<Message>("http://localhost:4000/korisnik/proveriJelMejlPostoji", data) 
  // }

  azurirajPodatkeVlasnika(korisnik: User){
    return this.http.post<Message>("http://localhost:4000/korisnik/azurirajPodatkeKorisniku", korisnik) 
  }

  dodajSliku(data: FormData){
    return this.http.post<Message>("http://localhost:4000/korisnik/dodajSliku", data) 
  }

  azurirajProfilnuKorisniku(korIme: string, profilna: string){

    const data = {
      korIme: korIme,
      profilna: profilna
    }

    return this.http.post<Message>("http://localhost:4000/korisnik/azurirajProfilnuKorisniku", data)
  }

  dohvatiSveFirme(){
    return this.http.get<Firma[]>("http://localhost:4000/korisnik/dohvatiSveFirme");
  }

  dohvatiFirmuSaDatimNazivom(naziv: string){
    return this.http.get<Firma>(`http://localhost:4000/korisnik/dohvatiFirmuSaDatimNazivom/${naziv}`)
  }

  dohvatiSvaZakazivanjaPrivatnaSaDatimKorIme(korIme: string){
    return this.http.get<PrivatnaBastaRaspored[]>(`http://localhost:4000/korisnik/dohvatiSvaZakazivanjaPrivatnaSaDatimKorIme/${korIme}`)
  }

  dohvatiSvaZakazivanjaRestoranSaDatimKorIme(korIme: string){
    return this.http.get<RestoranBastaRaspored[]>(`http://localhost:4000/korisnik/dohvatiSvaZakazivanjaRestoranSaDatimKorIme/${korIme}`)
  }

  dohvatiSvaOdbijenaZakazivanja(korIme: string){
    return this.http.get<any[]>(`http://localhost:4000/korisnik/dohvatiSvaOdbijenaZakazivanja/${korIme}`)
  }

  azurirajZakazivanjeRecenziju(zakazivanje: any){
    return this.http.post<Message>("http://localhost:4000/korisnik/azurirajZakazivanje", zakazivanje) 
  }

  dohvatiSvaZakazivanjaPrivatna(){
    return this.http.get<PrivatnaBastaRaspored[]>("http://localhost:4000/korisnik/dohvatiSvaZakazivanjaPrivatna")
  }

  dohvatiSvaZakazivanjaRestoran(){
    return this.http.get<RestoranBastaRaspored[]>("http://localhost:4000/korisnik/dohvatiSvaZakazivanjaRestoran")
  }

  dohvatiSvaZakazivanjaPrivatnaSaDatimNazivomFirme(nazivFirme: string){
    return this.http.get<PrivatnaBastaRaspored[]>(`http://localhost:4000/korisnik/dohvatiSvaZakazivanjaPrivatnaSaDatimNazivomFirme/${nazivFirme}`)
  }

  dohvatiSvaZakazivanjaRestoranSaDatimNazivomFirme(nazivFirme: string){
    return this.http.get<RestoranBastaRaspored[]>(`http://localhost:4000/korisnik/dohvatiSvaZakazivanjaRestoranSaDatimNazivomFirme/${nazivFirme}`)
  }

  otkaziPosao(zakazivanje: any){
    return this.http.post<Message>("http://localhost:4000/korisnik/otkaziPosao", zakazivanje) 
  }

  odbijZakazivanje(zakazivanje: any, razlog: string){
    const data = {
      zakazivanje: zakazivanje,
      razlog: razlog
    }
    return this.http.post<Message>("http://localhost:4000/korisnik/odbijZakazivanje", data) 
  }

  dohvatiSvaZavrsenaZakazivanjaSaKorIme(korIme: string){
    return this.http.get<any[]>(`http://localhost:4000/korisnik/dohvatiSvaZavrsenaZakazivanjaSaKorIme/${korIme}`)
  }

  dohvatiOdrKojaMoguDaSeServisiraju(zakazivanja: any[]){
    return this.http.post<string[]>("http://localhost:4000/korisnik/dohvatiOdrKojaMoguDaSeServisiraju", zakazivanja) 
  }

  zakaziOdrzavanje(zakazivanje: any[]){
    return this.http.post<Message>("http://localhost:4000/korisnik/zakaziOdrzavanje", zakazivanje) 
  }  

  dohvatiTrenutnaOdrzavanja(korIme: string){
    return this.http.get<Odrzavanje[]>(`http://localhost:4000/korisnik/dohvatiTrenutnaOdrzavanja/${korIme}`)
  }
}
