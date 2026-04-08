import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { VlasnikService } from '../services/vlasnik.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Odrzavanje } from '../models/odrzavanje';

@Component({
  selector: 'app-vlasnik-odrzavanje',
  templateUrl: './vlasnik-odrzavanje.component.html',
  styleUrls: ['./vlasnik-odrzavanje.component.css']
})
export class VlasnikOdrzavanjeComponent implements OnInit{
  constructor(private servis: VlasnikService, private router: Router) { }

  vlasnik: User = new User

  zavrsenaZakazivanja: any[] = []
  mogucaOdrzavanjaId: string[] = []
  odrzavanjaTrenutna: Odrzavanje[] = [] 

  dohvatiSvaZakazivanja() {
    this.servis.dohvatiSvaZavrsenaZakazivanjaSaKorIme(this.vlasnik.korIme).subscribe(
      data=>{
        if(data){
          this.zavrsenaZakazivanja = data

          this.servis.dohvatiOdrKojaMoguDaSeServisiraju(this.zavrsenaZakazivanja).subscribe(
            data2=>{
              if(data2){
                this.mogucaOdrzavanjaId = data2

                this.servis.dohvatiTrenutnaOdrzavanja(this.vlasnik.korIme).subscribe(
                  data=>{
                    if(data){
                      this.odrzavanjaTrenutna = data
                    }
                  }
                )
              }
            }
          )
        }
      }
    )
  }

  ngOnInit(): void {

    let korisnikTxt = localStorage.getItem("logged")

    if (korisnikTxt) {
      this.vlasnik = JSON.parse(korisnikTxt)
    }

    this.dohvatiSvaZakazivanja()
  }

  zakaziOdrzavanje(zakazivanje: any) {
    
    this.servis.zakaziOdrzavanje(zakazivanje).subscribe(
      data=>{
        if(data.message == "ok"){
          this.dohvatiSvaZakazivanja()
        }
      }
    )
  }

}
