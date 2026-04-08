import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { RegistrovanjeService } from '../services/registrovanje.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dekorater',
  templateUrl: './admin-dekorater.component.html',
  styleUrls: ['./admin-dekorater.component.css']
})
export class AdminDekoraterComponent implements OnInit {

  constructor(private servis: RegistrovanjeService, private router: Router) { }
  korisnik: User = new User

  porukaKorIme: string = ""
  porukaLozinka: string = ""
  porukaIme: string = ""
  porukaPrezime: string = ""
  porukaGmail: string = ""
  porukaBrKartice: string = ""
  porukaProfilnaSlika: string = ""

  currentStep: number = 1;
  totalSteps: number = 4;
  selectedImage: File | null = null;
  recaptchaResponse: string = ""
  recaptchaError: string = ""
  ikonaKartice: string = ""
  naziviFirmi: string[] = []
  siteKey: string = "6Lf0HSAqAAAAAH5mI3i9Wtu_4EVAmKr0hWRr-Yeg"

  ngOnInit(): void {
    this.korisnik.tip = 'D';
    this.korisnik.aktiviran = "Da"
    this.porukaProfilnaSlika = ""

    this.servis.dohvatiSveNaziveFirmi().subscribe(
      data => {
        if (data != null) {
          this.naziviFirmi = data
        }
      }
    )
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

  nextStepKiPiG() {
    const regex = /^(?=[A-Za-z])(?=(?:[^a-z]*[a-z]){3})(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,9}$/;
    let moze = true

    if (this.korisnik.korIme == "") {
      this.porukaKorIme = "Ovo polje mora biti popunjeno!"
    }
    else {
      this.porukaKorIme = ""
    }
    if (this.korisnik.lozinka == "") {
      this.porukaLozinka = "Ovo polje mora biti popunjeno!"
    }
    else if (!regex.test(this.korisnik.lozinka)) {
      moze = false
      this.porukaLozinka = "Lozinka mora pocinjati slovom, mora da ima od 6 do 10 karaktera (bar jedno veliko slovo "
        + "i 3 mala, kao i specijalan znak), kao i jedan broj !"
    }
    else {
      this.porukaLozinka = ""
    }
    if (this.korisnik.gmail == "") {
      this.porukaGmail = "Ovo polje mora biti popunjeno!"
    }
    else {
      this.porukaGmail = ""
    }
    if (this.korisnik.korIme != "" && this.korisnik.lozinka != "" && this.korisnik.gmail != "" && moze) {
      this.nextStep()
    }
  }

  nextStepIiP() {
    if (this.korisnik.ime == "") {
      this.porukaIme = "Ovo polje mora biti popunjeno!"
    }
    else {
      this.porukaIme = ""
    }
    if (this.korisnik.prezime == "") {
      this.porukaPrezime = "Ovo polje mora biti popunjeno!"
    }
    else {
      this.porukaPrezime = ""
    }
    if (this.korisnik.ime != "" && this.korisnik.prezime != "") {
      this.nextStep()
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

    if (brojKartice === "") {
      this.porukaBrKartice = "Ovo polje mora biti popunjeno!";
    } else if (!validnaKartica) {
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

  dodajProfilnuDekorateru() {

    const formData = new FormData()

    if (this.selectedImage) {
      formData.append('file', this.selectedImage)
      formData.append('korIme', this.korisnik.korIme)

      this.servis.dodajSliku(formData).subscribe(
        data => {
          if (data.filePath && data.message == "ok") {
            this.korisnik.profilnaSlika = data.filePath
            // console.log(this.korisnik.profilnaSlika)
            this.servis.azurirajProfilnuKorisniku(this.korisnik.korIme, this.korisnik.profilnaSlika).subscribe(
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

    else {
      this.korisnik.profilnaSlika = "/assets/profilePic/basic/userDeco.png"
      this.servis.azurirajProfilnuKorisniku(this.korisnik.korIme, this.korisnik.profilnaSlika).subscribe(
        data => {
          if (data.message == "ok") {
            this.router.navigate(['adminMain'])
          }
        }
      )
    }

  }


  register() {
    if (this.recaptchaResponse && !this.porukaProfilnaSlika) {
      this.recaptchaError = ""

      this.servis.registrujDekoratera(this.korisnik, this.recaptchaResponse).subscribe(
        data => {
          if (data.message == "ok") {
            this.dodajProfilnuDekorateru()
          }
          else if (data.message == "reCAPTCHA verification failed") {
            this.recaptchaError = "reCAPTCHA verifikacija neuspesna!"
          }
          else if (data.message == "korIme" || data.message == "Same username") {
            this.porukaKorIme = "Ovo korisnicko ime vec postoji!"
            setTimeout(() => {
              window.location.reload();
            }, 3000);

          }
          else if (data.message == "gmail" || data.message == "Same gmail") {
            this.porukaGmail = "Ne mozete imati dva naloga sa istim gmailom!"
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }
          else if (data.message == "Blocked username" || data.message == "Blocked gmail") {
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
    console.log(`Resolved response token: ${captchaResponse}`);
  }

  logout(event: Event) {
    event.preventDefault();
    localStorage.removeItem("logged");
    this.router.navigate(['admin-login']);
  }
}
