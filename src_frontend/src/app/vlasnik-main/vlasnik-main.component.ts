import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { VlasnikService } from '../services/vlasnik.service';

@Component({
  selector: 'app-vlasnik-main',
  templateUrl: './vlasnik-main.component.html',
  styleUrls: ['./vlasnik-main.component.css']
})
export class VlasnikMainComponent implements OnInit{
  constructor(private servis: VlasnikService, private router: Router) { }

  korisnik: User = new User

  porukaProfilna: string = ""
  porukaBrKartice: string = ""
  porukaGmail: string = ""
  selectedImage: File | null = null;
  ikonaKartice: string = ""

  ngOnInit(): void {
    this.porukaProfilna = ""
    let korisnikTxt = localStorage.getItem("logged")

    if (korisnikTxt != null) {
      this.korisnik = JSON.parse(korisnikTxt)
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {

      const validTypes = ['image/png', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        this.porukaProfilna = "Dozvoljeni formati slike su PNG i JPG.";
        this.selectedImage = null;
      }

      else {
        const img = new Image()
        img.onload = () => {
          if (img.width < 100 || img.height < 100 || img.width > 300 || img.height > 300) {
            this.porukaProfilna = "Dimenzije slike moraju biti izmedju 100x100px i 300x300px."
            this.selectedImage = null
          } else {
            this.selectedImage = file
            this.porukaProfilna = ""
          }
        }
        img.src = URL.createObjectURL(file)
      }
    }
  }

  proveriKarticu() {
    const brojKartice = this.korisnik.brojKartice;
    let validnaKartica = false;

    const dinersRegex = /^(300|301|302|303)\d{12}$|^(36|38)\d{13}$/;
    const masterCardRegex = /^(51|52|53|54|55)\d{14}$/;
    const visaRegex = /^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/;

    if (brojKartice.match(dinersRegex)) {
      this.ikonaKartice = 'assets/icons/diners.png';
      validnaKartica = true;
    } else if (brojKartice.match(masterCardRegex)) {
      this.ikonaKartice = 'assets/icons/master.png';
      validnaKartica = true;
    } else if (brojKartice.match(visaRegex)) {
      this.ikonaKartice = 'assets/icons/visa.png';
      validnaKartica = true;
    }

    if (!validnaKartica) {
      this.porukaBrKartice = "Unet broj kartice nije validan!";
    } else {
      this.porukaBrKartice = "";
    }
  }

  azurirajProfilnu() {

    const formData = new FormData()

    if (this.selectedImage) {
      formData.append('file', this.selectedImage)
      formData.append('korIme', this.korisnik.korIme)

      this.servis.dodajSliku(formData).subscribe(
        data => {
          if (data.filePath && data.message == "ok") {
            this.korisnik.profilnaSlika = data.filePath
            this.servis.azurirajProfilnuKorisniku(this.korisnik.korIme, this.korisnik.profilnaSlika).subscribe(
              data => {
                if (data.message == "ok") {
                  //console.log("Uspesno")
                  localStorage.setItem("logged", JSON.stringify(this.korisnik))
                  window.location.reload();
                }
              }
            )
          }
        }
      )
    }
    else{
      localStorage.setItem("logged", JSON.stringify(this.korisnik))
      window.location.reload();
    }
  }

  azurirajInfo(): void {
    if(!this.porukaBrKartice && !this.porukaProfilna){
      this.servis.azurirajPodatkeVlasnika(this.korisnik).subscribe(
        data => {
          if (data.message == "ok") {
            this.porukaGmail = ""
            this.azurirajProfilnu()
          }
  
          else if (data.message == "gmail" || data.message == "Same gmail") {
            this.porukaGmail = "Ne mozete imati dva naloga sa istim gmailom!"
          }
  
          else if (data.message == "Waiting gmail") {
            this.porukaGmail = "Nalog sa ovim  gmail-om vec ceka na odobrenje!"
          }
  
          else if (data.message == "Blocked gmail") {
            this.porukaGmail = "Nalog sa ovim gmail-om je vec odbijen!"
          }
        }
      )
    }
  }


}
