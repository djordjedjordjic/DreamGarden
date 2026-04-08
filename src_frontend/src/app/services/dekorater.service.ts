import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { User } from '../models/user';
import { PrivatnaBastaRaspored } from '../models/basta-privatna';
import { RestoranBastaRaspored } from '../models/basta-restoran';
import { Odrzavanje } from '../models/odrzavanje';

@Injectable({
  providedIn: 'root'
})
export class DekoraterService {

  constructor(private http: HttpClient) { }

  dodajSliku(data: FormData){
    return this.http.post<Message>("http://localhost:4000/korisnik/dodajSliku", data) 
  }

  azurirajProfilnuKorisniku(korIme: string, profilna: string){

    const data = {
      korIme: korIme,
      profilna: profilna
    }

    console.log(data)

    return this.http.post<Message>("http://localhost:4000/korisnik/azurirajProfilnuKorisniku", data)
  }

  azurirajPodatkeDekoratera(korisnik: User){
    return this.http.post<Message>("http://localhost:4000/korisnik/azurirajPodatkeKorisniku", korisnik) 
  }

  dohvatiSvaZakazivanjaZaPrivatnuBastuTrenutna(nazivFirme: string, dekorater: string){
    const data = {
      nazivFirme: nazivFirme,
      dekorater: dekorater
    }
    return this.http.post<PrivatnaBastaRaspored[]>("http://localhost:4000/korisnik/dohvatiSvaZakazivanjaZaPrivatnuBastuTrenutna", data) 
  }

  dohvatiSvaZakazivanjaZaRestoranTrenutna(nazivFirme: string, dekorater: string){
    const data = {
      nazivFirme: nazivFirme,
      dekorater: dekorater
    }
    return this.http.post<RestoranBastaRaspored[]>("http://localhost:4000/korisnik/dohvatiSvaZakazivanjaZaRestoranTrenutna", data) 
  }

  odbijZakazivanje(zakazivanje: any, razlog: string){
    const data = {
      zakazivanje: zakazivanje,
      razlog: razlog
    }
    return this.http.post<Message>("http://localhost:4000/korisnik/odbijZakazivanje", data) 
  }

  azurirajZakazivanjeStatus(zakazivanje: any){
    return this.http.post<Message>("http://localhost:4000/korisnik/azurirajZakazivanje", zakazivanje) 
  }

  zakasneloPrihvatanjePosla(zakazivanje: any){
    return this.http.post<Message>("http://localhost:4000/korisnik/zakasneloPrihvatanjePosla", zakazivanje) 
  }

  dohvatiSvaOdrzavanjaNaCekanjuZaFirmu(nazivFirme: string){
    return this.http.get<Odrzavanje[]>(`http://localhost:4000/korisnik/dohvatiSvaOdrzavanjaNaCekanjuZaFirmu/${nazivFirme}`)
  }

  odbijOdrzavanje(odrzavanje: Odrzavanje){
    return this.http.post<Message>("http://localhost:4000/korisnik/odbijOdrzavanje", odrzavanje) 
  }

  prihvatiOdrzavanje(odrzavanje: Odrzavanje | null){
    return this.http.post<Message>("http://localhost:4000/korisnik/prihvatiOdrzavanje", odrzavanje)
  }

  dohvatiSvaZavrsenaZakazivanjaSaKorImeDeko(korIme: string){
    return this.http.get<any[]>(`http://localhost:4000/korisnik/dohvatiSvaZavrsenaZakazivanjaSaKorImeDeko/${korIme}`)
  }

  dohvatiSvaZavrsenaZakazivanjaSaNazivomFirmeDeko(nazivFirme: string){
    return this.http.get<any[]>(`http://localhost:4000/korisnik/dohvatiSvaZavrsenaZakazivanjaSaNazivomFirmeDeko/${nazivFirme}`)
  }

  dohvatiSvaZavrsenaZakazivanja(){
    return this.http.get<any[]>("http://localhost:4000/korisnik/dohvatiSvaZavrsenaZakazivanja")
  }

}
