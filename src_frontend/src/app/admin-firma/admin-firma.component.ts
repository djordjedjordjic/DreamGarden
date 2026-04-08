import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { Usluga } from '../models/usluga';
import { Firma } from '../models/firma';
import { Lokacija } from '../models/lokacija';
import { User } from '../models/user';

@Component({
  selector: 'app-admin-firma',
  templateUrl: './admin-firma.component.html',
  styleUrls: ['./admin-firma.component.css']
})
export class AdminFirmaComponent implements OnInit {
  constructor(private servis: AdminService, private router: Router) { }

  usluge: Usluga[] = []
  firma: Firma = new Firma
  lokacija: Lokacija = new Lokacija
  dekorateri: User[] = []
  unajmljeniDekorateri: User[] = []

  currentStep: number = 1;
  totalSteps: number = 4;
  startDate: string = "";
  endDate: string = "";
  porukaNaziv: string = "";
  porukaAdresa: string = "";
  porukaUsluge: string = "";
  porukaKontaktOsoba: string = "";
  porukaMapa: string = "";
  porukaKraj: string = "";
  porukaOdmor: string = "";
  usluga1: Usluga = new Usluga;
  usluga2: Usluga = new Usluga;
  usluga3: Usluga = new Usluga;
  usluga4: Usluga = new Usluga;
  usluga5: Usluga = new Usluga;

  ngOnInit(): void {
    this.servis.dohvatiSveSlobodneDekoratere().subscribe(
      data => {
        if (data != null) {
          this.dekorateri = data
        }
      }
    )
  }

  logout(event: Event) {
    event.preventDefault();
    this.router.navigate(['admin-login']);
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  nextStepNiAiO() {
    if (this.firma.naziv == "") {
      this.porukaNaziv = "Ovo polje mora biti popunjeno!"
    }
    else {
      this.porukaNaziv = ""
    }
    if (this.firma.adresa == "") {
      this.porukaAdresa = "Ovo polje mora biti popunjeno!"
    }
    else {
      this.porukaAdresa = ""
    }
    if (this.firma.kontaktOsoba == "") {
      this.porukaKontaktOsoba = "Ovo polje mora biti popunjeno!"
    }
    else {
      this.porukaKontaktOsoba = ""
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const now = new Date();
    // console.log(this.startDate)

    if (!datePattern.test(this.startDate)) {
      this.porukaOdmor = "Pocetak odmora nije u ispravnom formatu. Unesite MM-DD"
    }

    else if (!datePattern.test(this.endDate)) {
      this.porukaOdmor = "Kraj odmora nije u ispravnom formatu. Unesite MM-DD"
    }

    else if (start <= now) {
      this.porukaOdmor = "Pocetak odmora mora biti u buducnosti.";
    }

    else if (end <= start) {
      this.porukaOdmor = "Datum zavrsetka mora biti posle datuma pocetka.";
    }

    else {
      this.porukaOdmor = ""
      if (this.firma.naziv != "" && this.firma.adresa != "" && this.firma.kontaktOsoba != "") {
        this.nextStep()
      }
    }


  }

  nextStepUiC() {

    this.porukaUsluge = ""
    let moze = 0

    const uslugeParovi = [
      this.usluga1,
      this.usluga2,
      this.usluga3,
      this.usluga4,
      this.usluga5
    ];

    uslugeParovi.forEach((par, index) => {
      if ((par.naziv && !par.cena) || (!par.naziv && par.cena)) {
        this.porukaUsluge = `Greska: Unesite i naziv i cenu za uslugu ${index + 1}.`;
        moze = 1
      }
      else if (par.naziv && par.cena) {
        moze = 1
      }
    });
    if (moze == 0) {
      this.porukaUsluge = "Morate uneti bar jednu uslugu!"
    }

    if (!this.porukaUsluge) {
      uslugeParovi.forEach((par) => {
        if (par.naziv && par.cena) {
          this.usluge.push(par);
        }
      });
      this.nextStep()
    }
  }

  nextStepM() {
    let lokacijaTxt = localStorage.getItem("lokacija")
    // console.log(lokacijaTxt)

    if (lokacijaTxt != null && lokacijaTxt != "") {
      this.porukaMapa = ""
      this.lokacija = JSON.parse(lokacijaTxt)
      // console.log(this.lokacija)
      localStorage.setItem("lokacija", "")
      this.nextStep()

    }
    else {
      this.porukaMapa = "Morate sacuvati neku lokaciju!"
      //console.log(this.porukaMapa)
    }
  }


  ukloniDekoratora(dekorator: User) {
    this.unajmljeniDekorateri = this.unajmljeniDekorateri.filter(d => d.korIme !== dekorator.korIme);
  }

  isDodato(dekorator: User): boolean {
    return this.unajmljeniDekorateri.some(d => d.korIme === dekorator.korIme);
  }

  dodajDekoratora(dekorator: User) {
    if (this.unajmljeniDekorateri.some(d => d.korIme === dekorator.korIme)) {
      this.ukloniDekoratora(dekorator);
    } else {
      this.unajmljeniDekorateri.push(dekorator);
    }

    // console.log(this.unajmljeniDekorateri)
  }

  potvrdi() {
    if (this.unajmljeniDekorateri.length < 2) {
      this.porukaKraj = "Morate izabrati bar 2 dekoratora!"
    }
    else {
      this.porukaKraj = ""
      this.firma.usluge = this.usluge
      this.firma.lokacija = this.lokacija
      this.firma.dekorateri = this.unajmljeniDekorateri
      this.firma.pocetakGodisnjegOdmora = this.startDate
      this.firma.krajGodisnjegOdmora = this.endDate

      this.servis.proveriJelFirmaVecPostoji(this.firma.naziv).subscribe(
        data => {
          if (data.message == "ok") {

            this.servis.dodajFirmu(this.firma).subscribe(
              data => {
                if (data.message == "ok") {
                  this.servis.dodajFirmuDekoraterima(this.unajmljeniDekorateri, this.firma.naziv).subscribe(
                    data => {
                      if (data.message == "ok") {
                        this.router.navigate(['adminMain'])
                      }
                      else if (data.message == "greska") {
                        this.porukaKraj = "Doslo je do greske prilikom pokusaja cuvanja firme!"
                      }
                    }
                  )

                }
              }
            )

          }
          else if (data.message == "vec postoji") {
            this.porukaKraj = "Firma sa ovakvim imenom vec postoji u sistemu!"
            setTimeout(() => {
              window.location.reload()
            }, 3000)
          }
        }
      )



    }
  }
}
