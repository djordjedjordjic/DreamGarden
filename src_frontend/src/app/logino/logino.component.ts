import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PocetnaService } from '../services/pocetna.service';
import { User } from '../models/user';

@Component({
  selector: 'app-logino',
  templateUrl: './logino.component.html',
  styleUrls: ['./logino.component.css']
})
export class LoginoComponent {

  constructor(private servis: PocetnaService, private router: Router) { }

  korIme: string = ""
  lozinka: string = ""
  porukaPrvaForma: string = ""
  porukaZaboravljenaSifra: boolean = false;

  login() {

    if (this.korIme != "" && this.lozinka != "") {
      this.servis.loginService(this.korIme, this.lozinka).subscribe(
        data => {
          if (data == null) this.porukaPrvaForma = "Neispravno uneti podaci!"
          else if ('message' in data && data.message == "cekanje") {
            this.porukaPrvaForma = "Ceka se odobrenje naloga.";
          }
          else if (this.isUser(data)) {
            if (data.aktiviran == "Ne") {
              this.porukaPrvaForma = "Ovaj nalog je deaktiviran!"
            }
            else {
              this.porukaPrvaForma = ""
              localStorage.setItem("logged", JSON.stringify(data))
              if (data.tip == "V") {
                //console.log("USAO")
                this.router.navigate(['vlasnik-main'])
              }
              else {
                this.router.navigate(['dekorater-main'])
              }
            }
          }
        }
      )
    }
    else {
      this.porukaPrvaForma = "Svi podaci moraju biti uneti!"
    }
  }

  private isUser(data: any): data is User {
    return (
      'korIme' in data &&
      'lozinka' in data &&
      'aktiviran' in data &&
      'tip' in data
    );
  }
}
