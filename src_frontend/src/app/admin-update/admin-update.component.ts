import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { AdminService } from '../services/admin.service';
import { Router } from '@angular/router';
import { RegistrovanjeService } from '../services/registrovanje.service';

@Component({
  selector: 'app-admin-update',
  templateUrl: './admin-update.component.html',
  styleUrls: ['./admin-update.component.css']
})
export class AdminUpdateComponent implements OnInit {

  constructor(private servis: AdminService, private servisRegistrovanje: RegistrovanjeService, private router: Router) { }

  korisnik: User = new User

  porukaKorIme: string = ""
  porukaGmail: string = ""
  porukaBrKartice: string = ""
  porukaProfilnaSlika: string = ""

  currentStep: number = 1;
  totalSteps: number = 4;
  selectedImage: File | null = null;
  recaptchaResponse: string = ""
  recaptchaError: string = ""
  ikonaKartice: string = ""
  siteKey: string = "6Lf0HSAqAAAAAH5mI3i9Wtu_4EVAmKr0hWRr-Yeg"
  naziviFirmi: string[] = []

  ngOnInit(): void {
    let korisnikTxt = localStorage.getItem("korisnik")

    if (korisnikTxt != null) {
      this.korisnik = JSON.parse(korisnikTxt)
    }
    localStorage.removeItem("korisnik");

    this.korisnik.aktiviran = "Da";

    this.servisRegistrovanje.dohvatiSveNaziveFirmi().subscribe(
      data => {
        if (data != null) {
          this.naziviFirmi = data
        }
      }
    )

  }

  logout() {
    localStorage.removeItem("logged");
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

  nextStepBrKart() {
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
      this.nextStep();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {

      const validTypes = ['image/png', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        this.porukaProfilnaSlika = "Dozvoljeni formati su PNG i JPG.";
        this.selectedImage = null;
      }

      else {
        const img = new Image()
        img.onload = () => {
          if (img.width < 100 || img.height < 100 || img.width > 300 || img.height > 300) {
            this.porukaProfilnaSlika = "Dimenzije slike moraju biti izmedju 100x100px i 300x300px."
            this.selectedImage = null
          } else {
            this.selectedImage = file
            this.porukaProfilnaSlika = ""
          }
        }
        img.src = URL.createObjectURL(file)
      }
    }
  }

  azurirajProfilnuDekorateru() {

    const formData = new FormData()

    if (this.selectedImage) {
      formData.append('file', this.selectedImage)
      formData.append('korIme', this.korisnik.korIme)

      this.servisRegistrovanje.dodajSliku(formData).subscribe(
        data => {
          if (data.filePath && data.message == "ok") {
            this.korisnik.profilnaSlika = data.filePath
            // console.log(this.korisnik.profilnaSlika)
            this.servisRegistrovanje.azurirajProfilnuKorisniku(this.korisnik.korIme, this.korisnik.profilnaSlika).subscribe(
              data => {
                if (data.message == "ok") {
                  this.router.navigate(['adminMain'])
                }
              }
            )
          }
        }
      )
    }

    else{
      this.router.navigate(['adminMain'])
    }
  }

  azuriraj() {
    if (this.recaptchaResponse) {
      this.recaptchaError = ""
      if(this.korisnik.tip == "V"){
        this.korisnik.firma = ""
      }
      const formData = new FormData()
      if (this.selectedImage) {
        formData.append('file', this.selectedImage)
      }

      this.servis.azurirajKorisnika(this.korisnik, this.recaptchaResponse).subscribe(
        data => {
          if (data.message == "ok") {
            this.azurirajProfilnuDekorateru()
          }
          else if (data.message == "reCAPTCHA verification failed") {
            this.recaptchaError = "reCAPTCHA verifikacija neuspesna!"
          }
          else if (data.message == "gmail" || data.message == "Same gmail") {
            this.porukaGmail = "Ne mozete postojati dva naloga sa istim gmailom!"
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }
          else if (data.message == "Waiting gmail") {
            this.porukaGmail = "Nalog sa ovim gmail-om vec ceka na odobrenje!"
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }
          else if (data.message == "Blocked gmail") {
            this.porukaGmail = "Nalog sa ovim korisnickim imenom ili gmail-om je vec odbijen!"
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }
        }
      )
    }

    else {
      this.recaptchaError = "Obavezna potvrda reCAPTCHA!"
    }

  }

  resolved(captchaResponse: string) {
    this.recaptchaError = ""
    this.recaptchaResponse = captchaResponse
    // console.log(`Resolved response token: ${captchaResponse}`);
  }
}
