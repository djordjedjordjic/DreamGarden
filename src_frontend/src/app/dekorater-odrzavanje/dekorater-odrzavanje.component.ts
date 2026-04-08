import { Component, OnInit } from '@angular/core';
import { DekoraterService } from '../services/dekorater.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Odrzavanje } from '../models/odrzavanje';

@Component({
  selector: 'app-dekorater-odrzavanje',
  templateUrl: './dekorater-odrzavanje.component.html',
  styleUrls: ['./dekorater-odrzavanje.component.css']
})
export class DekoraterOdrzavanjeComponent implements OnInit {

  constructor(private servis: DekoraterService, private router: Router) { }

  dekorater: User = new User

  datumZavrsetka: string = ""
  prikaziModal: boolean = false
  trOdrzavanje: Odrzavanje | null = new Odrzavanje
  trenutnaOdrzavanja: Odrzavanje[] = []

  porukaGreske: string = ""

  dohvatiOdrzavanja(){
    this.servis.dohvatiSvaOdrzavanjaNaCekanjuZaFirmu(this.dekorater.firma).subscribe(
      data=>{
        if(data){
          this.trenutnaOdrzavanja = data
        }
      }
    )
  }

  ngOnInit(): void {

    let korisnikTxt = localStorage.getItem("logged")

    if (korisnikTxt) {
      this.dekorater = JSON.parse(korisnikTxt)
    }

    this.dohvatiOdrzavanja()

  }

  otvoriProzorcic(odrzavanje: any) {
    this.prikaziModal = true
    this.trOdrzavanje = odrzavanje
  }

  odustani() {
    this.porukaGreske = ""
    this.zatvoriProzorcic()
  }

  zatvoriProzorcic() {
    this.prikaziModal = false
    this.datumZavrsetka = ""
    this.trOdrzavanje = null
  }

  prihvatiOdrzavanje(){
    const end = new Date(this.datumZavrsetka)
    const now = new Date()
    if(this.datumZavrsetka == ""){
      this.porukaGreske = "Morate uneti datum!"
    }

    else if(end < now){
      this.porukaGreske = "Datum mora biti u buducnosti!"
    }
    else{

      if(this.trOdrzavanje){
        this.trOdrzavanje.datumPoslednjegOdrzavanja = this.datumZavrsetka
      }
      
      this.servis.prihvatiOdrzavanje(this.trOdrzavanje).subscribe(
        data=>{
          if(data.message == "ok"){
            this.dohvatiOdrzavanja()
            this.zatvoriProzorcic()
          }
        }
      )
    }
  }

  odbijOdrzavanje(odrzavanje: Odrzavanje){
    this.servis.odbijOdrzavanje(odrzavanje).subscribe(
      data=>{
        if(data.message == "ok"){
          this.dohvatiOdrzavanja()
        }
      }
    )
  }

}
