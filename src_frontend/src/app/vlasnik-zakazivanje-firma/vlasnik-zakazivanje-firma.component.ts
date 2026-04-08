import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZakazivanjeService } from '../services/zakazivanje.service';
import { RestoranBastaRaspored } from '../models/basta-restoran';
import { PrivatnaBastaRaspored } from '../models/basta-privatna';
import { Usluga } from '../models/usluga';
import { Firma } from '../models/firma';

@Component({
  selector: 'app-vlasnik-zakazivanje-firma',
  templateUrl: './vlasnik-zakazivanje-firma.component.html',
  styleUrls: ['./vlasnik-zakazivanje-firma.component.css']
})
export class VlasnikZakazivanjeFirmaComponent implements OnInit {

  constructor(private servis: ZakazivanjeService, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) { }

  startDateTime: string = ""
  ukupnaKvadratura: string = ""
  tipBaste: string = ""
  nazivFirme: string = ""
  dodatniZahtevi: string = ""
  odabraneUsluge: Usluga[] = []
  firma: Firma = new Firma
  korIme: string = ""

  porukaUkupnaKvadratura: string = ""
  porukaDatum: string = ""
  porukaTip: string = ""
  porukaKorakDva: string = ""
  porukaKorakTri: string = ""
  uspesnaRezervacija: boolean = false
  porukaJSONFajl: string = ""
  selectedJsonFile: File | null = null

  currentStep: number = 1;
  totalSteps: number = 3;

  restoranBasta: RestoranBastaRaspored = new RestoranBastaRaspored
  privatnaBasta: PrivatnaBastaRaspored = new PrivatnaBastaRaspored

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const naziv = params.get('naziv');
      if (naziv !== null) {
        this.nazivFirme = naziv;

        this.servis.dohvatiFirmuSaDatimNazivom(this.nazivFirme).subscribe(
          data => {
            if (data) {
              this.firma = data
            }
          }
        )
      }
    });

    let korisnikTxt = localStorage.getItem("logged")

    if (korisnikTxt) {
      this.korIme = JSON.parse(korisnikTxt).korIme
    }
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

  nextStepK1() {
    const start = new Date(this.startDateTime)
    const now = new Date()

    const vremePocetkaOdmora = new Date(this.firma.pocetakGodisnjegOdmora)
    const vremeKrajaOdmora = new Date(this.firma.krajGodisnjegOdmora)

    if (this.tipBaste == "") {
      this.porukaTip = "Ovaj podatak je obavezan!"
    }
    else {
      this.porukaTip = ""
    }

    if (this.ukupnaKvadratura == "") {
      this.porukaUkupnaKvadratura = "Ovaj podatak je obavezan!"
    }
    else if (isNaN(Number(this.ukupnaKvadratura)) && this.ukupnaKvadratura.trim() !== '') {
      this.porukaUkupnaKvadratura = "Ovaj podatak mora biti broj!"
    }
    else {
      this.porukaUkupnaKvadratura = ""
    }

    if (this.startDateTime == "") {
      this.porukaDatum = "Ovaj podatak je obavezan!"
    }

    else if (start <= now) {
      this.porukaDatum = "Pocetak odmora mora biti u buducnosti."
    }

    else if (start >= vremePocetkaOdmora && start < vremeKrajaOdmora) {
      this.porukaDatum = "Odabrana firma je za izabrani datum na odmoru!"
    }

    else {
      this.porukaDatum = ""
      if (!this.porukaTip && !this.porukaUkupnaKvadratura) {
        this.porukaTip = ""
        this.porukaUkupnaKvadratura = ""

        if (this.tipBaste == 'P') {
          this.privatnaBasta.ukupnaKvadratura = this.ukupnaKvadratura
          this.privatnaBasta.datumDolaskaMajstora = this.startDateTime
          this.privatnaBasta.nazivFirme = this.nazivFirme
          this.privatnaBasta.vlasnik = this.korIme
        }
        else {
          this.restoranBasta.ukupnaKvadratura = this.ukupnaKvadratura
          this.restoranBasta.datumDolaskaMajstora = this.startDateTime
          this.restoranBasta.nazivFirme = this.nazivFirme
          this.restoranBasta.vlasnik = this.korIme
        }
        this.nextStep()

      }
    }
  }

  proveriJelBroj(data: string) {

    if (isNaN(Number(data)) && data.trim() !== '') {
      this.porukaKorakDva = "Podaci moraju biti brojevi!"
    }

    else {
      this.porukaKorakDva = ""
    }
  }

  proveriJelVelicinaDobra(vel1: string, vel2: string, vel3: string, vel4: string) {
    let ukupnoInt = parseInt(this.ukupnaKvadratura, 10)
    let vel1Int = parseInt(vel1, 10)
    let vel2Int = parseInt(vel2, 10)
    let vel3Int = parseInt(vel3, 10)
    let vel4Int = parseInt(vel4, 10)

    if (ukupnoInt < (vel1Int + vel2Int + vel3Int + vel4Int)) {
      console.log
      return true
    }

    else {
      return false
    }
  }

  nextStepK2() {

    if (this.tipBaste == "P" && !this.porukaKorakDva && this.proveriJelVelicinaDobra(this.privatnaBasta.kvadraturaPodBazenom, this.privatnaBasta.kvadraturaPodZelenilom, this.privatnaBasta.kvadraturaLezaljkeIStolovi, "0")) {
      this.porukaKorakDva = "Ukupna velicina je manja od zbira ovde unetih velicina!"
    }
    else if (this.tipBaste == "P" && !this.porukaKorakDva) {
      this.porukaKorakDva = ""
    }

    if (this.tipBaste == "R" && !this.porukaKorakDva && this.proveriJelVelicinaDobra(this.restoranBasta.kvadraturaPodFontanom, this.restoranBasta.kvadraturaPodZelenilom, this.restoranBasta.brojLezaljki, this.restoranBasta.brojStolova)) {
      this.porukaKorakDva = "Ukupna velicina je manja od zbira ovde unetih velicina!"
    }
    else if (this.tipBaste == "R" && !this.porukaKorakDva) {
      this.porukaKorakDva = ""
    }

    if (this.tipBaste == "P" && !this.porukaKorakDva && this.privatnaBasta.kvadraturaPodBazenom != "" && this.privatnaBasta.kvadraturaPodZelenilom != "" && this.privatnaBasta.kvadraturaLezaljkeIStolovi != "") {
      this.nextStep()
    }
    else if (this.tipBaste == "P" && !this.porukaKorakDva && (this.privatnaBasta.kvadraturaPodBazenom == "" || this.privatnaBasta.kvadraturaPodZelenilom == "" || this.privatnaBasta.kvadraturaLezaljkeIStolovi == "")) {
      this.porukaKorakDva = "Svi podaci moraju biti uneti!"

      setTimeout(() => {
        this.porukaKorakDva = ""
      }, 2500);
    }

    else if (this.tipBaste == "R" && !this.porukaKorakDva && this.restoranBasta.kvadraturaPodFontanom != "" && this.restoranBasta.kvadraturaPodZelenilom != "" && this.restoranBasta.brojLezaljki != "" && this.restoranBasta.brojStolova != "") {
      this.nextStep()
    }

    else if (this.tipBaste == "R" && !this.porukaKorakDva && (this.restoranBasta.kvadraturaPodFontanom == "" || this.restoranBasta.kvadraturaPodZelenilom == "" || this.restoranBasta.brojLezaljki == "" || this.restoranBasta.brojStolova == "")) {
      this.porukaKorakDva = "Svi podaci moraju biti uneti!"

      setTimeout(() => {
        this.porukaKorakDva = ""
      }, 2500);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0]
    if (file) {
      const validJsonType = 'application/json'

      if (file.type === validJsonType) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonData = JSON.parse(e.target?.result as string);
            if (this.processJsonData(jsonData)) {
              this.selectedJsonFile = file;
              this.porukaJSONFajl = "";
              this.cdr.detectChanges(); //azuriramo prikaz jer u suprotnom drawOnCanvas ne vidi myCanvas i baca gresku
              if (this.selectedJsonFile) {
                this.drawOnCanvas(jsonData);
              }
            } else {
              this.porukaJSONFajl = "Greska: JSON format nije ispravan ili sadrži nedozvoljene vrednosti.";
              this.selectedJsonFile = null;
            }
          } catch (error) {
            this.porukaJSONFajl = "Greska: Fajl nije validan JSON."
            this.selectedJsonFile = null;
          }
        };
        reader.readAsText(file)
      }

      else {
        this.porukaJSONFajl = "Dozvoljeni su samo JSON formati fajlova!"
        this.selectedJsonFile = null
      }
    }
  }

  processJsonData(jsonData: any): boolean {

    let allowedShapes: string[]

    if (this.tipBaste == "P") {
      allowedShapes = ["bazen", "zelenilo", "sto", "lezaljke"];
    }
    else {
      allowedShapes = ["fontana", "zelenilo", "sto", "lezaljke"];
    }


    if (!Array.isArray(jsonData)) {
      return false;
    }

    for (const item of jsonData) {
      if (
        !item.hasOwnProperty('name') ||
        !allowedShapes.includes(item.name) ||
        !item.hasOwnProperty('x_axis') ||
        !item.hasOwnProperty('y_axis') ||
        !item.hasOwnProperty('radius')
      ) {
        return false;
      }
    }

    return true;
  }

  areGreenAreasTooClose(jsonData: any): boolean {
    const greenAreas = jsonData.filter((item: any) => item.name === 'zelenilo')
    const minDistance = 5
  
    for (let i = 0; i < greenAreas.length; i++) {
      for (let j = i + 1; j < greenAreas.length; j++) {
        const area1 = greenAreas[i]
        const area2 = greenAreas[j]
  
        const xDistance = Math.abs(area1.x_axis - area2.x_axis)
        const yDistance = Math.abs(area1.y_axis - area2.y_axis)

        const combinedRadius = (area1.radius + area2.radius)/2

      if (xDistance < (minDistance + combinedRadius) && yDistance < (minDistance + combinedRadius)) {
        return true
      }
  
        if (xDistance < minDistance && yDistance < minDistance) {
          return true
        }
      }
    }
    return false
  }
  

  drawOnCanvas(jsonData: any): void {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')

    let hasError = false

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const item of jsonData) {
        ctx.beginPath()
        if (
          item.x_axis - item.radius < 0 ||
          item.y_axis - item.radius < 0 ||
          item.x_axis + item.radius > canvas.width ||
          item.y_axis + item.radius > canvas.height
        ) {
          hasError = true
          console.warn(`Greška: Objekat ${item.name} izlazi van okvira canvasa.`)
        }

        switch (item.name) {
          case 'fontana':
            ctx.arc(item.x_axis, item.y_axis, item.radius, 0, 2 * Math.PI) // Veliki plavi krug
            ctx.fillStyle = 'blue'
            break
          case 'bazen':
            ctx.rect(item.x_axis, item.y_axis, item.radius * 2, item.radius) // Veliki plavi pravougaonik
            ctx.fillStyle = 'blue'
            break
          case 'zelenilo':
            ctx.rect(item.x_axis, item.y_axis, item.radius, item.radius) // Mali zeleni kvadrat
            ctx.fillStyle = 'green'
            break
          case 'sto':
            ctx.arc(item.x_axis, item.y_axis, item.radius, 0, 2 * Math.PI) // Mali braon krug
            ctx.fillStyle = 'brown';
            break
            case 'lezaljke':
              ctx.rect(item.x_axis, item.y_axis, item.radius / 2, item.radius * 2) // Mali uspravni sivi pravougaonik
              ctx.fillStyle = 'gray'
              break          
          default:
            continue
        }
        ctx.fill();
      }

      for (let i = 0; i < jsonData.length - 1; i++) {
        const item1 = jsonData[i]
        for (let j = i + 1; j < jsonData.length; j++) {
          const item2 = jsonData[j]

          if (item1.name === 'fontana' && item2.name === 'fontana') {
            const distance = Math.sqrt(Math.pow(item1.x_axis - item2.x_axis, 2) + Math.pow(item1.y_axis - item2.y_axis, 2))
            if (distance < item1.radius + item2.radius) {
              hasError = true
            }
          }
        }
      }

      if(this.areGreenAreasTooClose(jsonData)){
        hasError = true
      }

      if (hasError) {
        this.porukaJSONFajl = "Upozorenje: Neki objekti se preklapaju ili izlaze van okvira canvasa."
      } else {
        this.porukaJSONFajl = ""
      }
    }
  }



  onUslugaChange(usluga: Usluga, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.odabraneUsluge.push(usluga);
    } else {
      const index = this.odabraneUsluge.indexOf(usluga);
      if (index > -1) {
        this.odabraneUsluge.splice(index, 1);
      }
    }
  }

  dodajPrivatnuBastu() {

    this.servis.dodajPrivatnuBastu(this.privatnaBasta).subscribe(
      data => {
        if (data.message == "ok") {
          this.uspesnaRezervacija = true
          this.porukaKorakTri = "Uspesno ste napravili rezervaciju!"

          setTimeout(() => {
            this.router.navigate(['vlasnik-firme'])
          }, 2500);
        }
      }
    )
  }

  dodajRestoranBastu() {

    this.servis.dodajBastuRestorana(this.restoranBasta).subscribe(
      data => {
        if (data.message == "ok") {
          this.uspesnaRezervacija = true
          this.porukaKorakTri = "Uspesno ste napravili rezervaciju!"

          setTimeout(() => {
            this.router.navigate(['vlasnik-firme'])
          }, 2500);
        }
      }
    )
  }

  ucitajPutanjuDoJSON(key: string) {
    const formData = new FormData()

    if (this.selectedJsonFile) {
      formData.append('fileJSON', this.selectedJsonFile)
      formData.append('korIme', this.korIme)

      this.servis.dodajJSONFajl(formData).subscribe(
        data => {
          if (data.filePath && data.message == "ok") {
            switch (key) {
              case "P":
                this.privatnaBasta.izgled = data.filePath
                this.dodajPrivatnuBastu()
                // console.log(this.privatnaBasta)
                break;

              case "R":
                this.restoranBasta.izgled = data.filePath
                this.dodajRestoranBastu()
                break;
            }
          }
        }
      )
    }

    else {
      switch (key) {
        case "P":
          this.dodajPrivatnuBastu()
          break;

        case "R":
          this.dodajRestoranBastu()
          break;
      }
    }
  }

  potvrdi() {
    if (this.odabraneUsluge.length > 0 && this.porukaJSONFajl == "") {

      this.porukaKorakTri = ""

      if (this.tipBaste == "P") {
        this.privatnaBasta.usluge = this.odabraneUsluge
        this.privatnaBasta.opis = this.dodatniZahtevi
        this.privatnaBasta.status = "Cekanje"
        this.privatnaBasta.datumZakazivanja = (new Date()).toISOString()

        this.ucitajPutanjuDoJSON("P")
      }
      else {
        this.restoranBasta.usluge = this.odabraneUsluge
        this.restoranBasta.opis = this.dodatniZahtevi
        this.restoranBasta.status = "Cekanje"
        this.restoranBasta.datumZakazivanja = (new Date()).toISOString()

        this.ucitajPutanjuDoJSON("R")
      }
    } else if (this.odabraneUsluge.length <= 0) {
      this.porukaKorakTri = "Mora biti izabrana bar jedna usluga!"
    }
  }
}
