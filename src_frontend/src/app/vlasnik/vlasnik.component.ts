import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vlasnik',
  templateUrl: './vlasnik.component.html',
  styleUrls: ['./vlasnik.component.css']
})
export class VlasnikComponent implements OnInit {

  constructor(private router: Router) { }

  korisnik: User = new User
  ikonaProfilna: string = ""

  ngOnInit(): void {
    let korisnikTxt = localStorage.getItem("logged")

    if (korisnikTxt != null) {
      this.korisnik = JSON.parse(korisnikTxt)

      this.ikonaProfilna = this.korisnik.profilnaSlika
    }
  }

  logout(event: Event) {
    event.preventDefault();
    localStorage.removeItem("logged");
    this.router.navigate(['login']);
  }

}
