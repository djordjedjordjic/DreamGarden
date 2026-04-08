import { Component, OnInit } from '@angular/core';
import { DekoraterService } from '../services/dekorater.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { RestoranBastaRaspored } from '../models/basta-restoran';
import { PrivatnaBastaRaspored } from '../models/basta-privatna';

@Component({
  selector: 'app-dekorater-zakazivanja',
  templateUrl: './dekorater-zakazivanja.component.html',
  styleUrls: ['./dekorater-zakazivanja.component.css']
})
export class DekoraterZakazivanjaComponent implements OnInit {

  constructor(private servis: DekoraterService, private router: Router) { }

  dekorater: User = new User
  zakazivanjaRestoran: RestoranBastaRaspored[] = []
  zakazivanjaPrivatna: PrivatnaBastaRaspored[] = []

  prikaziModal: boolean = false
  razlogOdbijanja: string = ""
  trenutnoZakazivanje: any
  trenutniTip: string = ""

  porukaOdbijanje: string = ""

  izbaciZakasnele(){
    const danasnjiDatum = new Date()
    this.zakazivanjaPrivatna.forEach(zakazivanje => {
      const datumDolaskaMajstora = new Date(zakazivanje.datumDolaskaMajstora)

      if ((datumDolaskaMajstora < danasnjiDatum) && zakazivanje.status == "Cekanje") {
        this.servis.odbijZakazivanje(zakazivanje, "dekorater nije prihvatio zakazivanje na vreme").subscribe(
          data=>{
            if(data.message == "ok"){
              this.dohvatiSvaZakazivanja()
            }
          }
        )
      }
    });

    this.zakazivanjaRestoran.forEach(zakazivanje => {
      const datumDolaskaMajstora = new Date(zakazivanje.datumDolaskaMajstora)

      if (datumDolaskaMajstora < danasnjiDatum && zakazivanje.status == "Cekanje") {
        this.servis.odbijZakazivanje(zakazivanje, "dekorater nije prihvatio zakazivanje na vreme").subscribe(
          data=>{
            if(data.message == "ok"){
              this.dohvatiSvaZakazivanja()
            }
          }
        )
      }
    });
  }

  dohvatiSvaZakazivanja() {

    this.servis.dohvatiSvaZakazivanjaZaPrivatnuBastuTrenutna(this.dekorater.firma, this.dekorater.korIme).subscribe(
      data => {
        if (data) {
          this.zakazivanjaPrivatna = data

          this.zakazivanjaPrivatna.sort((a, b) => {
            return new Date(a.datumDolaskaMajstora).getTime() - new Date(b.datumDolaskaMajstora).getTime();
          })

          this.izbaciZakasnele()
        }
      }
    )

    this.servis.dohvatiSvaZakazivanjaZaRestoranTrenutna(this.dekorater.firma, this.dekorater.korIme).subscribe(
      data => {
        if (data) {
          this.zakazivanjaRestoran = data

          this.zakazivanjaRestoran.sort((a, b) => {
            return new Date(a.datumDolaskaMajstora).getTime() - new Date(b.datumDolaskaMajstora).getTime();
          })

          this.izbaciZakasnele()
        }
      }
    )


  }

  ngOnInit(): void {
    
    let korisnikTxt = localStorage.getItem("logged")

    if (korisnikTxt) {
      this.dekorater = JSON.parse(korisnikTxt)
    }

    this.dohvatiSvaZakazivanja()

  }

  otvoriProzorcic(zakazivanje: any) {
    this.prikaziModal = true
    this.trenutnoZakazivanje = zakazivanje
  }

  potvrdiOdbijanje() {

    if (this.razlogOdbijanja != "") {
      this.servis.odbijZakazivanje(this.trenutnoZakazivanje, this.razlogOdbijanja).subscribe(
        data => {
          if (data.message == "ok") {
            this.dohvatiSvaZakazivanja()
            this.zatvoriProzorcic()
          }
        }
      )
    }
    else {
      this.porukaOdbijanje = "Morate uneti razlog odbijanja!"
    }
  }

  odustani() {
    this.porukaOdbijanje = ""
    this.zatvoriProzorcic()
  }

  zatvoriProzorcic() {
    this.prikaziModal = false
    this.razlogOdbijanja = ''
    this.trenutnoZakazivanje = null
  }

  prihvatiZahtev(zakazivanje: any) {
    zakazivanje.status = "Prihvaceno"
    zakazivanje.dekorater = this.dekorater.korIme
    this.servis.azurirajZakazivanjeStatus(zakazivanje).subscribe(
      data=>{
        if(data.message == "ok"){
          this.dohvatiSvaZakazivanja()
        }
      }
    )
  }

  mozeZavrsiti(datumDolaskaMajstora: string): boolean {
    const danasnjiDatum = new Date();
    const datumDolaska = new Date(datumDolaskaMajstora);
  
    const razlikaUDanima = (danasnjiDatum.getTime() - datumDolaska.getTime()) / (24 * 60 * 60 * 1000);

    console.log(datumDolaskaMajstora)

    return razlikaUDanima >= 1;
  }

  zavrsiPosao(zakazivanje: any) {

    zakazivanje.status = "Zavrseno"
    const danasnjiDatum = (new Date()).toISOString()
    zakazivanje.datumZavrsetka = danasnjiDatum
    this.servis.azurirajZakazivanjeStatus(zakazivanje).subscribe(
      data=>{
        if(data.message == "ok"){
          this.dohvatiSvaZakazivanja()
        }
      }
    )
  }

}
