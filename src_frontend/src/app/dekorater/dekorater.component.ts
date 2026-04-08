import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-dekorater',
  templateUrl: './dekorater.component.html',
  styleUrls: ['./dekorater.component.css']
})
export class DekoraterComponent implements OnInit{
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
