import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  constructor(private servis: AdminService, private router: Router) { }

  korIme: string = ""
  lozinka: string = ""
  porukaLoginAdmin: string = ""

  login(){
    if (this.korIme != "" && this.lozinka != "") {
      this.servis.loginService(this.korIme, this.lozinka).subscribe(
        data => {
          if (data == null) this.porukaLoginAdmin = "Neispravno uneti podaci!"
          else {
            this.porukaLoginAdmin = ""
            localStorage.setItem("logged", JSON.stringify(data))
            this.router.navigate(['adminMain'])
          }
        }
      )
    }
    else{
      this.porukaLoginAdmin = "Svi podaci moraju biti uneti!"
    }
  }
}
