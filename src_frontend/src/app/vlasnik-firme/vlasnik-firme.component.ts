import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VlasnikService } from '../services/vlasnik.service';
import { Firma } from '../models/firma';
import { User } from '../models/user';

@Component({
  selector: 'app-vlasnik-firme',
  templateUrl: './vlasnik-firme.component.html',
  styleUrls: ['./vlasnik-firme.component.css']
})
export class VlasnikFirmeComponent implements OnInit {

  constructor(private servis: VlasnikService, private router: Router) { }

  firme: Firma[] = []
  sortiraneFirme: Firma[] = []
  pretragaNaziv: string = ''
  pretragaAdresa: string = ''
  sortBy: string = ''

  svaZakazivanja: any[] = []

  ngOnInit(): void {

    this.servis.dohvatiSveFirme().subscribe(
      data => {
        if (data != null) {
          this.firme = data
          // console.log(this.firme)
        }
      }
    )

    this.servis.dohvatiSvaZakazivanjaPrivatna().subscribe(
      data => {
        if (data) {
          data.forEach(zakazivanje => {
            this.svaZakazivanja.push(zakazivanje)
          });

          this.servis.dohvatiSvaZakazivanjaRestoran().subscribe(
            data => {
              if (data) {
                data.forEach(zakazivanje => {
                  this.svaZakazivanja.push(zakazivanje)
                });

                this.izracunajProsecneOcene()
                this.sortiraneFirme = this.firme
                this.applySearchAndSort()
              }
            }
          )

        }
      }
    )
  }

  izracunajProsecneOcene() {
    this.firme.forEach(firma => {
      const recenzijeZaFirmu = this.svaZakazivanja.filter(rec => rec.nazivFirme === firma.naziv && rec.ocena != "")
      console.log(recenzijeZaFirmu)
      const ukupnoOcena = recenzijeZaFirmu.reduce((sum, rec) => sum + parseFloat(rec.ocena), 0)
      const prosecnaOcena = recenzijeZaFirmu.length > 0 ? (ukupnoOcena / recenzijeZaFirmu.length).toFixed(1) : 'N/A'
      firma.prosecnaOcena = prosecnaOcena
    });
  }

  getDecoratorsNames(dekorateri: User[]): string {
    return dekorateri.map(dekorater => `${dekorater.ime} ${dekorater.prezime}`).join(', ')
  }

  onSortChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement
    this.sortBy = selectElement.value
    this.applySearchAndSort()

  }

  onSearchChange(field: 'naziv' | 'adresa', event: Event): void {
    const inputElement = event.target as HTMLInputElement
    const value = inputElement.value.toLowerCase()

    if (field === 'naziv') {
      this.pretragaNaziv = value
    } else if (field === 'adresa') {
      this.pretragaAdresa = value
    }

    this.applySearchAndSort()
  }

  applySearchAndSort(): void {
    let filteredFirme = this.firme.filter(firma =>
      (!this.pretragaNaziv || firma.naziv.toLowerCase().includes(this.pretragaNaziv)) &&
      (!this.pretragaAdresa || firma.adresa.toLowerCase().includes(this.pretragaAdresa))
    );

    this.sortiraneFirme = filteredFirme.sort((a, b) => {
      if (this.sortBy === 'nazivRastuce') {
        return a.naziv.localeCompare(b.naziv)
      } else if (this.sortBy === 'adresaRastuce') {
        return a.adresa.localeCompare(b.adresa)
      } else if (this.sortBy === 'nazivOpadajuce') {
        return b.naziv.localeCompare(a.naziv)
      } else if (this.sortBy === 'adresaOpadajuce') {
        return b.adresa.localeCompare(a.adresa)
      }
      return 0;
    });
  }

}
