import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { Zahtev } from '../models/zahtev';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.css']
})
export class AdminMainComponent implements OnInit{
  constructor(private servis: AdminService, private router: Router) { }

  zahtevi: Zahtev[] = []
  korisnici: User[] = []

  ngOnInit(): void {
    this.servis.dohvatiSveZahteve().subscribe(
      data => {
        if (data != null) {
          this.zahtevi = data
        }
      }
    )

    this.servis.dohvatiSveKorisnike().subscribe(
      data => {
        if (data != null) {
          this.korisnici = data
        }
      }
    )
  }

  prihvatiZahtev(zahtev: Zahtev) {
    this.servis.prihvatiKorisnika(zahtev).subscribe(
      data => {
        if (data.message == "ok") {
          this.servis.dohvatiSveZahteve().subscribe(
            data => {
              if (data != null) {
                this.zahtevi = data
              }
            }
          )

          this.servis.dohvatiSveKorisnike().subscribe(
            data => {
              if (data != null) {
                this.korisnici = data
              }
            }
          )
        }
      }
    )
  }

  odbijZahtev(zahtev: Zahtev) {
    this.servis.odbijZahtev(zahtev).subscribe(
      data => {
        if (data.message == "ok") {
          this.servis.dohvatiSveZahteve().subscribe(
            data => {
              if (data != null) {
                this.zahtevi = data
              }
            }
          )
        }
      }
    )
  }

  azurirajKorisnika(korisnik: User){
    localStorage.setItem("korisnik", JSON.stringify(korisnik))
    this.router.navigate(['admin-update'])
  }

  deaktivirajKorisnika(korisnik: User){
    this.servis.deaktivirajKorisnika(korisnik.korIme).subscribe(
      data=>{
        if(data != null){
          this.servis.dohvatiSveKorisnike().subscribe(
            data => {
              if (data != null) {
                this.korisnici = data
              }
            }
          )
        }
      }
    )
  }

  logout(event: Event){
    event.preventDefault();
    localStorage.removeItem("logged");
    this.router.navigate(['admin-login']); 
  }
}
