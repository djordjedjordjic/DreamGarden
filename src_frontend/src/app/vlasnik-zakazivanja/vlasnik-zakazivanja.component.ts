import { Component, OnInit } from '@angular/core';
import { VlasnikService } from '../services/vlasnik.service';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-vlasnik-zakazivanja',
  templateUrl: './vlasnik-zakazivanja.component.html',
  styleUrls: ['./vlasnik-zakazivanja.component.css']
})
export class VlasnikZakazivanjaComponent implements OnInit {

  constructor(private servis: VlasnikService, private router: Router) { }

  vlasnik: User = new User

  trenutnaZakazivanja: any[] = []
  arhivaZakazivanja: any[] = []
  odbijenaZakazivanja: any[] = []
  trenutnoZakazivanje: any

  prikaziModal: boolean = false
  komentarUnos: string = ""
  ocenaUnos: string = ""

  porukaGreske: string = ""

  processZakazivanja(zakazivanja: any[]): void {
    zakazivanja.forEach(zakazivanje => {
      const datumDolaskaMajstora = new Date(zakazivanje.datumDolaskaMajstora)
      const danasnjiDatum = new Date()
      
      if (zakazivanje.status == "Cekanje" && datumDolaskaMajstora < danasnjiDatum) {
        this.servis.odbijZakazivanje(zakazivanje, "dekorater nije prihvatio zakazivanje na vreme").subscribe(
          data=>{
            if(data.message == "ok"){
              return
            }
          }
        )
      }

      if (zakazivanje.hasOwnProperty('kvadraturaPodBazenom')) {
        zakazivanje.tip = "privatna";
      } else {
        zakazivanje.tip = "restoran";
      }

      if (zakazivanje.status !== "Zavrseno") {
          this.trenutnaZakazivanja.push(zakazivanje);
      } else {
        this.arhivaZakazivanja.push(zakazivanje);
      }
    });

    this.arhivaZakazivanja.sort((a: any, b: any) => {
      return new Date(b.datumDolaskaMajstora).getTime() - new Date(a.datumDolaskaMajstora).getTime();
    });
  }

  dohvatiSvaZakazivanja() {
    this.servis.dohvatiSvaZakazivanjaPrivatnaSaDatimKorIme(this.vlasnik.korIme).subscribe(
      data => {
        if (data) {
          this.processZakazivanja(data);
        }
      }
    )

    this.servis.dohvatiSvaZakazivanjaRestoranSaDatimKorIme(this.vlasnik.korIme).subscribe(
      data => {
        if (data) {
          this.processZakazivanja(data);
        }
      }
    )

    this.servis.dohvatiSvaOdbijenaZakazivanja(this.vlasnik.korIme).subscribe(
      data => {
        if (data) {
          this.odbijenaZakazivanja = data
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

  otvoriProzorcic(zakazivanje: any) {
    this.prikaziModal = true
    this.trenutnoZakazivanje = zakazivanje
  }

  odustani() {
    this.porukaGreske = ""
    this.zatvoriProzorcic()
  }

  zatvoriProzorcic() {
    this.komentarUnos = ""
    this.ocenaUnos = ""
    this.prikaziModal = false
    this.trenutnoZakazivanje = null
  }

  potvrdiRecenziju() {
    const ocenaBroj = Number(this.ocenaUnos);

    if (this.ocenaUnos != "" && (ocenaBroj < 1 || ocenaBroj > 5)) {
      this.porukaGreske = "Ocena mora biti izmedju 1 i 5!"

    }
    else if (this.ocenaUnos == "" && this.komentarUnos == "") {
      this.porukaGreske = "Mora barem jedan podatak biti unet!"
    }

    else {
      this.trenutnoZakazivanje.komentar = this.komentarUnos
      this.trenutnoZakazivanje.ocena = this.ocenaUnos

      this.servis.azurirajZakazivanjeRecenziju(this.trenutnoZakazivanje).subscribe(
        data => {
          if (data.message == "ok") {
            this.trenutnaZakazivanja = []
            this.arhivaZakazivanja = []
            this.odbijenaZakazivanja = []
            this.dohvatiSvaZakazivanja()
            this.zatvoriProzorcic()
          }
        }
      )
    }
  }

  mozeOtkazati(datumDolaskaMajstora: string): boolean {
    const danasnjiDatum = new Date()
    const datumDolaska = new Date(datumDolaskaMajstora)

    const razlikaUDanima = (datumDolaska.getTime() - danasnjiDatum.getTime()) / (24 * 60 * 60 * 1000)

    return razlikaUDanima >= 1;
  }

  otkaziPosao(zakazivanje: any) {
    this.servis.otkaziPosao(zakazivanje).subscribe(
      data => {
        if (data.message == "ok") {
          this.trenutnaZakazivanja = []
          this.arhivaZakazivanja = []
          this.odbijenaZakazivanja = []
          this.dohvatiSvaZakazivanja()
        }
      }
    )
  }
}
