import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class RegistrovanjeService {

  constructor(private http: HttpClient) { }

  registrujKorisnika(korisnik: User, recaptchaResponse: string){
    return this.http.post<Message>("http://localhost:4000/korisnik/register", { korisnik, recaptchaResponse }) 
  }

  dodajSliku(data: FormData){
    // const file = data.get('korIme');
    // console.log('Sadržaj polja file:', file);
    return this.http.post<Message>("http://localhost:4000/korisnik/dodajSliku", data) 
  }

  registrujDekoratera(korisnik: User, recaptchaResponse: string){
    return this.http.post<Message>("http://localhost:4000/admin/registerDeco", { korisnik, recaptchaResponse }) 
  }

  dohvatiSveNaziveFirmi(){
    return this.http.get<string[]>("http://localhost:4000/admin/dohvatiSveNaziveFirmi");
  }

  azurirajProfilnu(korIme: string, profilna: string){

    const data = {
      korIme: korIme,
      profilna: profilna
    }

    return this.http.post<Message>("http://localhost:4000/korisnik/azurirajProfilnu", data)
  }

  azurirajProfilnuKorisniku(korIme: string, profilna: string){

    const data = {
      korIme: korIme,
      profilna: profilna
    }

    return this.http.post<Message>("http://localhost:4000/korisnik/azurirajProfilnuKorisniku", data)
  }
}
