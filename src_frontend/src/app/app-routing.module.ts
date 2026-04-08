import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginoComponent } from './logino/logino.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { VlasnikComponent } from './vlasnik/vlasnik.component';
import { DekoraterComponent } from './dekorater/dekorater.component';
import { NovaSifraComponent } from './nova-sifra/nova-sifra.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { AdminUpdateComponent } from './admin-update/admin-update.component';
import { AdminDekoraterComponent } from './admin-dekorater/admin-dekorater.component';
import { AdminFirmaComponent } from './admin-firma/admin-firma.component';
import { VlasnikMainComponent } from './vlasnik-main/vlasnik-main.component';
import { VlasnikFirmeComponent } from './vlasnik-firme/vlasnik-firme.component';
import { DekoraterMainComponent } from './dekorater-main/dekorater-main.component';
import { NeRegistrovaniComponent } from './ne-registrovani/ne-registrovani.component';
import { VlasnikPodaciFirmaComponent } from './vlasnik-podaci-firma/vlasnik-podaci-firma.component';
import { VlasnikZakazivanjeFirmaComponent } from './vlasnik-zakazivanje-firma/vlasnik-zakazivanje-firma.component';
import { DekoraterZakazivanjaComponent } from './dekorater-zakazivanja/dekorater-zakazivanja.component';
import { VlasnikZakazivanjaComponent } from './vlasnik-zakazivanja/vlasnik-zakazivanja.component';
import { VlasnikOdrzavanjeComponent } from './vlasnik-odrzavanje/vlasnik-odrzavanje.component';
import { DekoraterOdrzavanjeComponent } from './dekorater-odrzavanje/dekorater-odrzavanje.component';
import { DekoraterStatistikaComponent } from './dekorater-statistika/dekorater-statistika.component';

const routes: Routes = [
  {path: "", component: NeRegistrovaniComponent},
  {path: "login", component: LoginoComponent},
  {path: "registracija", component: RegistracijaComponent},
  {path: "vlasnik", component: VlasnikComponent},
  {path: "novaSifra", component: NovaSifraComponent},
  {path: "admin-login", component: AdminLoginComponent},
  {path: "adminMain", component: AdminMainComponent},
  {path: "admin-update", component: AdminUpdateComponent},
  {path: "admin-dekorater", component: AdminDekoraterComponent},
  {path: "admin-firma", component: AdminFirmaComponent},
  {path: "vlasnik-main", component: VlasnikMainComponent},
  {path: "vlasnik-firme", component: VlasnikFirmeComponent},
  {path: "dekorater-main", component: DekoraterMainComponent},
  {path: 'firma/:naziv', component: VlasnikPodaciFirmaComponent},
  {path: 'firma-zakazivanje/:naziv', component: VlasnikZakazivanjeFirmaComponent},
  {path: "dekorater-zakazivanja", component: DekoraterZakazivanjaComponent},
  {path: "vlasnik-zakazivanja", component: VlasnikZakazivanjaComponent},
  {path: "vlasnik-odrzavanje", component: VlasnikOdrzavanjeComponent},
  {path: "dekorater-odrzavanje", component: DekoraterOdrzavanjeComponent},
  {path: "dekorater-statistika", component: DekoraterStatistikaComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
