import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NeRegistrovaniService } from '../services/ne-registrovani.service';
import { Firma } from '../models/firma';
import { User } from '../models/user';

@Component({
  selector: 'app-ne-registrovani',
  templateUrl: './ne-registrovani.component.html',
  styleUrls: ['./ne-registrovani.component.css']
})
export class NeRegistrovaniComponent implements OnInit {

  constructor(private servis: NeRegistrovaniService, private router: Router) { }

  brojVlasnika: string = "0"
  brojDekoratera: string = "0"
  firme: Firma[] = []
  sortiraneFirme: Firma[] = []
  pretragaNaziv: string = ""
  pretragaAdresa: string = ""
  sortBy: string = ""
  brojDekorisanihBasta: string = "0"
  brojDekorisanihPoslednjih24h: string = "0"
  brojDekorisanihPoslednjih7Dana: string = "0"
  brojDekorisanihPoslednjih30Dana: string = "0"

  ngOnInit(): void {

    this.servis.dohvatiBrojVlasnika().subscribe(
      data => {
        if (data != null) {
          this.brojVlasnika = data
        }
      }
    )

    this.servis.dohvatiBrojDekoratera().subscribe(
      data => {
        if (data != null) {
          this.brojDekoratera = data
        }
      }
    )

    this.servis.dohvatiSveFirme().subscribe(
      data => {
        if (data != null) {
          this.firme = data
          // console.log(this.firme)
          this.sortiraneFirme = this.firme
          this.applySearchAndSort()
        }
      }
    )

    this.servis.dohvatiBrojDekorisanihBasta().subscribe(
      data=>{
        if(data){
          this.brojDekorisanihBasta = data
        }
      }
    )

    this.servis.dohvatiPosloveZaTrazenoVreme().subscribe(
      data=>{
        if(data){
          this.brojDekorisanihPoslednjih24h = data[0]
          this.brojDekorisanihPoslednjih7Dana = data[1]
          this.brojDekorisanihPoslednjih30Dana = data[2]
        }
      }
    )
  }

  getDecoratorsNames(dekorateri: User[]): string {
    return dekorateri.map(dekorater => `${dekorater.ime} ${dekorater.prezime}`).join(', ');
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
        return a.naziv.localeCompare(b.naziv);
      } else if (this.sortBy === 'adresaRastuce') {
        return a.adresa.localeCompare(b.adresa);
      } else if (this.sortBy === 'nazivOpadajuce') {
        return b.naziv.localeCompare(a.naziv);
      } else if (this.sortBy === 'adresaOpadajuce') {
        return b.adresa.localeCompare(a.adresa);
      }
      return 0;
    });
  }
}
