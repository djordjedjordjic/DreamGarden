import { Component, OnInit } from '@angular/core';
import { VlasnikService } from '../services/vlasnik.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Firma } from '../models/firma';
@Component({
  selector: 'app-vlasnik-podaci-firma',
  templateUrl: './vlasnik-podaci-firma.component.html',
  styleUrls: ['./vlasnik-podaci-firma.component.css']
})
export class VlasnikPodaciFirmaComponent implements OnInit {

  constructor(private servis: VlasnikService, private router: Router, private route: ActivatedRoute) { }

  firma: Firma = new Firma
  kontaktOsobaBrojTelefona: string = ""

  svaZakazivanja: any[] = []

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const firmaId = params.get('naziv')
      if (firmaId) {
        this.servis.dohvatiFirmuSaDatimNazivom(firmaId).subscribe(data => {

          if (data) {
            this.firma = data
            const dekorater = this.firma.dekorateri.find(d => d.korIme === this.firma.kontaktOsoba);
            if (dekorater) {
              this.kontaktOsobaBrojTelefona = dekorater.kontaktTelefon
            }

            this.servis.dohvatiSvaZakazivanjaPrivatnaSaDatimNazivomFirme(this.firma.naziv).subscribe(
              data => {
                if (data) {
                  data.forEach(zakazivanje => {
                    if (zakazivanje.komentar != "") {
                      this.svaZakazivanja.push(zakazivanje)
                    }
                  });

                  this.servis.dohvatiSvaZakazivanjaRestoranSaDatimNazivomFirme(this.firma.naziv).subscribe(
                    data => {
                      if (data) {
                        data.forEach(zakazivanje => {
                          if (zakazivanje.komentar != "") {
                            this.svaZakazivanja.push(zakazivanje)
                          }
                        });
                      }
                    }
                  )

                }
              }
            )
          }
        }, error => {
          console.error('Greska prilikom preuzimanja firme:', error)
        });
      }
    });
  }
}
