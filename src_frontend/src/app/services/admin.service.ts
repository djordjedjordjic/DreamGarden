import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Admin } from '../models/admin';
import { Zahtev } from '../models/zahtev';
import { User } from '../models/user';
import { Message } from '../models/message';
import { Firma } from '../models/firma';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  uri = 'http://localhost:4000'
  loginService(korIme: string, lozinka: string) {

    const data = {
      korIme: korIme,
      lozinka: lozinka
    }

    return this.http.post<Admin>("http://localhost:4000/admin/login", data)
  }

  dohvatiSveZahteve(){
    return this.http.get<Zahtev[]>("http://localhost:4000/admin/dohvatiSveZahteve");
  }

  prihvatiKorisnika(zahtev: Zahtev){
    return this.http.post<Message>("http://localhost:4000/admin/prihvatiKorisnika", zahtev) 
  }

  odbijZahtev(zahtev: Zahtev){
    return this.http.post<Message>("http://localhost:4000/admin/odbijZahtev", zahtev) 
  }

  dohvatiSveKorisnike(){
    return this.http.get<User[]>("http://localhost:4000/admin/dohvatiSveKorisnike");
  }

  deaktivirajKorisnika(korIme: string){
    return this.http.get<Message>(`http://localhost:4000/admin/deaktivirajKorisnika/${korIme}`)
  }

  azurirajKorisnika(korisnik: User, recaptchaResponse: string){
    return this.http.post<Message>("http://localhost:4000/admin/azurirajKorisnika", { korisnik, recaptchaResponse }) 
  }

  dohvatiSveSlobodneDekoratere(){
    return this.http.get<User[]>("http://localhost:4000/admin/dohvatiSveSlobodneDekoratere");
  }

  dodajFirmuDekoraterima(dekorateri: User[], firma: string){
    const data = {
      dekorateri: dekorateri,
      firma: firma
    }
    // console.log(data)
    return this.http.post<Message>("http://localhost:4000/admin/dodajFirmuDekoraterima", data) 
  }

  dodajFirmu(firma: Firma){
    return this.http.post<Message>("http://localhost:4000/admin/dodajFirmu", firma) 
  }

  proveriJelFirmaVecPostoji(naziv: string){
    return this.http.get<Message>(`http://localhost:4000/admin/proveriJelFirmaVecPostoji/${naziv}`)
  }
}
