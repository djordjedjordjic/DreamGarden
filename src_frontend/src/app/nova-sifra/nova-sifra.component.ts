import { Component } from '@angular/core';
import { PocetnaService } from '../services/pocetna.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nova-sifra',
  templateUrl: './nova-sifra.component.html',
  styleUrls: ['./nova-sifra.component.css']
})
export class NovaSifraComponent {

  constructor(private servis: PocetnaService, private router: Router) { }

  korIme: string = ""
  staraLozinka: string = ""
  novaLozinka: string = ""
  ponovoNovaLozinka: string = ""
  porukaNovaSifra: string = ""

  promeniSifru() {
    const regex = /^(?=[A-Za-z])(?=(?:[^a-z]*[a-z]){3})(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,9}$/;

    if (this.korIme == "" || this.staraLozinka == "" || this.novaLozinka == "" || this.ponovoNovaLozinka == "") {
      this.porukaNovaSifra = "Sva polja moraju biti popunjena!"
    }

    else if (this.novaLozinka != this.ponovoNovaLozinka) {
      this.porukaNovaSifra = "Polja nova lozinka i ponovljena nova lozinka moraju biti ista!"
    }

    else if (!regex.test(this.novaLozinka)) {
      this.porukaNovaSifra = "Lozinka mora pocinjati slovom, mora da ima od 6 do 10 karaktera (bar jedno veliko slovo "
        + "i 3 mala, kao i specijalan znak), kao i jedan broj !"
    }

    else {
      this.servis.postaviNovuSifru(this.korIme, this.staraLozinka, this.novaLozinka).subscribe(
        data => {
          if (data.message == "ok") {
            this.porukaNovaSifra = ""
            this.router.navigate(['login'])
          }
          else if (data.message == "Nije dobra lozinka") {
            this.porukaNovaSifra = "Stara lozinka nije dobra!"
          }

          else if (data.message == "Korisnik nije pronadjen.") {
            this.porukaNovaSifra = "Pogresno uneto korisnicko ime ili korisnik ne postoji(ceka na odobrenje)!"
          }
        }
      )
    }
  }
}
