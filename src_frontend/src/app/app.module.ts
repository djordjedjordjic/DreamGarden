import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginoComponent } from './logino/logino.component';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { RegistracijaComponent } from './registracija/registracija.component';
import { VlasnikComponent } from './vlasnik/vlasnik.component';
import { DekoraterComponent } from './dekorater/dekorater.component';
import { NovaSifraComponent } from './nova-sifra/nova-sifra.component';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { AdminUpdateComponent } from './admin-update/admin-update.component';
import { AdminDekoraterComponent } from './admin-dekorater/admin-dekorater.component';
import { AdminFirmaComponent } from './admin-firma/admin-firma.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapSelectorComponent } from './map-selector/map-selector.component';
import { VlasnikMainComponent } from './vlasnik-main/vlasnik-main.component';
import { VlasnikFirmeComponent } from './vlasnik-firme/vlasnik-firme.component';
import { DekoraterMainComponent } from './dekorater-main/dekorater-main.component';
import { NeRegistrovaniComponent } from './ne-registrovani/ne-registrovani.component';
import { NrIzgledComponent } from './nr-izgled/nr-izgled.component';
import { MapDisplayComponent } from './map-display/map-display.component';
import { VlasnikPodaciFirmaComponent } from './vlasnik-podaci-firma/vlasnik-podaci-firma.component';
import { VlasnikZakazivanjeFirmaComponent } from './vlasnik-zakazivanje-firma/vlasnik-zakazivanje-firma.component';
import { DekoraterZakazivanjaComponent } from './dekorater-zakazivanja/dekorater-zakazivanja.component';
import { VlasnikZakazivanjaComponent } from './vlasnik-zakazivanja/vlasnik-zakazivanja.component';
import { VlasnikOdrzavanjeComponent } from './vlasnik-odrzavanje/vlasnik-odrzavanje.component';
import { DekoraterOdrzavanjeComponent } from './dekorater-odrzavanje/dekorater-odrzavanje.component';
import { DekoraterStatistikaComponent } from './dekorater-statistika/dekorater-statistika.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

@NgModule({
  declarations: [
    AppComponent,
    LoginoComponent,
    RegistracijaComponent,
    VlasnikComponent,
    DekoraterComponent,
    NovaSifraComponent,
    AdminMainComponent,
    AdminLoginComponent,
    AdminUpdateComponent,
    AdminDekoraterComponent,
    AdminFirmaComponent,
    MapSelectorComponent,
    VlasnikMainComponent,
    VlasnikFirmeComponent,
    DekoraterMainComponent,
    NeRegistrovaniComponent,
    NrIzgledComponent,
    MapDisplayComponent,
    VlasnikPodaciFirmaComponent,
    VlasnikZakazivanjeFirmaComponent,
    DekoraterZakazivanjaComponent,
    VlasnikZakazivanjaComponent,
    VlasnikOdrzavanjeComponent,
    DekoraterOdrzavanjeComponent,
    DekoraterStatistikaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RecaptchaModule,  //this is the recaptcha main module
    RecaptchaFormsModule, //this is the module for form incase form validation
    BrowserModule,
    GoogleMapsModule,
    CanvasJSAngularChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
