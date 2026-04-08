import { Component, OnInit } from '@angular/core';
import { DekoraterService } from '../services/dekorater.service';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-dekorater-statistika',
  templateUrl: './dekorater-statistika.component.html',
  styleUrls: ['./dekorater-statistika.component.css']
})
export class DekoraterStatistikaComponent implements OnInit {

  constructor(private servis: DekoraterService, private router: Router) { }

  svaZakazivanjaZaDekoratera: any[] = []
  svaZakazivanjaZafirmu: any[] = []
  svaZavrsenaZakazivanja: any[] = []
  brojZakazivanjaPoMesecima: { [key: string]: number } = {}
  brojZakazivanjaPoDekoraterima: { [key: string]: number } = {}
  brojZakazivanjaPoDanimaUSedmici: { [key: string]: number } = {};
  dekorater: User = new User
  chartOptions1: any = {
    title: {
      text: "Loading..."
    },
    animationEnabled: true,
    axisY: {
      includeZero: true,
      title: "Broj zakazivanja"
    },
    data: [{
      type: "bar",
      indexLabel: "{y}",
      yValueFormatString: "#,###",
      dataPoints: []
    }]
  };

  chartOptions2: any = {
    animationEnabled: true,
    title: {
      text: "Raspodela poslova među dekoraterima"
    },
    data: [{
      type: "pie",
      startAngle: -90,
      indexLabel: "{name}: {y}",
      yValueFormatString: "#,###.##'%'",
      dataPoints: []
    }]
  };

  chartOptions3: any = {
    title: {
      text: "Prosecan broj poslova po danima u nedelji"
    },
    animationEnabled: true,
    data: [{
      type: "column",
      dataPoints: []
    }]
  };

  processZakazivanjaMeseci(zakazivanja: any[]) {
    this.brojZakazivanjaPoMesecima = {}
    zakazivanja.forEach(zakazivanje => {

      const datumDolaska = new Date(zakazivanje.datumDolaskaMajstora);
      const mesec = datumDolaska.toLocaleString('default', { month: 'long' });

      if (this.brojZakazivanjaPoMesecima[mesec]) {
        this.brojZakazivanjaPoMesecima[mesec]++;
      } else {
        this.brojZakazivanjaPoMesecima[mesec] = 1;
      }
    });

    this.updateChart()
  }

  processZakazivanjaDekorateri(zakazivanja: any[]) {
    this.brojZakazivanjaPoDekoraterima = {}
    zakazivanja.forEach(zakazivanje => {

      const dekorater = zakazivanje.dekorater
      if (this.brojZakazivanjaPoDekoraterima[dekorater]) {
        this.brojZakazivanjaPoDekoraterima[dekorater]++;
      } else {
        this.brojZakazivanjaPoDekoraterima[dekorater] = 1;
      }
    });

    this.updatePieChart()
  }

  processZakazivanjaDanima(zakazivanja: any[]) {
    this.brojZakazivanjaPoDanimaUSedmici = {}
    const daniUSedmici = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let mesecniPodaci: { [key: string]: { [key: string]: number } } = {};

    const trenutniDatum = new Date();
    const dvadesetCetiriMesecaPre = new Date();
    dvadesetCetiriMesecaPre.setMonth(trenutniDatum.getMonth() - 24);

    zakazivanja.forEach(zakazivanje => {
      const datumDolaska = new Date(zakazivanje.datumDolaskaMajstora);

      if (datumDolaska < dvadesetCetiriMesecaPre) {
        return;
      }

      const mesec = datumDolaska.toLocaleString('default', { year: 'numeric', month: 'long' });
      const danUSedmici = daniUSedmici[datumDolaska.getDay()];

      if (!mesecniPodaci[mesec]) {
        mesecniPodaci[mesec] = {};
      }

      if (mesecniPodaci[mesec][danUSedmici]) {
        mesecniPodaci[mesec][danUSedmici]++;
      } else {
        mesecniPodaci[mesec][danUSedmici] = 1;
      }

      // console.log(mesecniPodaci[mesec][danUSedmici])
    });

    // Izracunavanje najaktivnijeg dana u nedelji za svaki mesec, ako ih imas vise svima povecamo vr za 1
    for (let mesec in mesecniPodaci) {
      const najviseZakazivanja = Math.max(...Object.values(mesecniPodaci[mesec]));
      let najaktivnijiDani = Object.keys(mesecniPodaci[mesec]).filter(dan => mesecniPodaci[mesec][dan] === najviseZakazivanja);

      najaktivnijiDani.forEach(najaktivnijiDan => {
        if (this.brojZakazivanjaPoDanimaUSedmici[najaktivnijiDan]) {
          this.brojZakazivanjaPoDanimaUSedmici[najaktivnijiDan]++;
        } else {
          this.brojZakazivanjaPoDanimaUSedmici[najaktivnijiDan] = 1;
        }
      });
    }

    this.updateHistogram()
  }

  updateChart() {
    const meseci = Object.keys(this.brojZakazivanjaPoMesecima).sort((a, b) => {
      return new Date(Date.parse(a + " 1, 2024")).getMonth() - new Date(Date.parse(b + " 1, 2024")).getMonth();
    });

    this.chartOptions1 = {
      title: {
        text: "Broj zakazivanja po mesecima"
      },
      animationEnabled: true,
      axisY: {
        includeZero: true,
        title: "Broj zakazivanja",
        interval: 1
      },
      data: [{
        type: "bar",
        indexLabel: "{y}",
        yValueFormatString: "#,###",
        dataPoints: meseci.map(mesec => ({
          label: mesec,
          y: this.brojZakazivanjaPoMesecima[mesec] || 0 // U slučaju da neki meseci nemaju podatke
        }))
      }]
    };
  }

  updatePieChart() {
    this.chartOptions2 = {
      animationEnabled: true,
      title: {
        text: "Raspodela poslova među dekoraterima"
      },
      data: [{
        type: "pie",
        startAngle: -90,
        indexLabel: "{name}: {y}",
        yValueFormatString: "#,###.##",
        dataPoints: Object.keys(this.brojZakazivanjaPoDekoraterima).map(dekorater => ({
          name: dekorater,
          y: this.brojZakazivanjaPoDekoraterima[dekorater]
        }))
      }]
    };
  }

  updateHistogram() {
    const daniUSedmici = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    this.chartOptions3 = {
      title: {
        text: "Prosečan broj poslova po danima u nedelji"
      },
      animationEnabled: true,
      data: [{
        type: "column",
        dataPoints: daniUSedmici.map(dan => ({
          label: dan,
          y: this.brojZakazivanjaPoDanimaUSedmici[dan] || 0
        }))
      }]
    };
  }

  dohvatiZakazivanja() {
    this.servis.dohvatiSvaZavrsenaZakazivanjaSaKorImeDeko(this.dekorater.korIme).subscribe(
      data => {
        if (data) {
          this.svaZakazivanjaZaDekoratera = data
          this.processZakazivanjaMeseci(data)
        }
      }
    )

    this.servis.dohvatiSvaZavrsenaZakazivanjaSaNazivomFirmeDeko(this.dekorater.firma).subscribe(
      data => {
        if (data) {
          this.svaZakazivanjaZafirmu = data
          this.processZakazivanjaDekorateri(this.svaZakazivanjaZafirmu)
        }
      }
    )

    this.servis.dohvatiSvaZavrsenaZakazivanja().subscribe(
      data => {
        if (data) {
          this.svaZavrsenaZakazivanja = data
          this.processZakazivanjaDanima(data)
        }
      }
    )
  }

  ngOnInit(): void {
    let korisnikTxt = localStorage.getItem("logged")

    if (korisnikTxt) {
      this.dekorater = JSON.parse(korisnikTxt)
    }

    this.dohvatiZakazivanja()
  }

}