import { Lokacija } from "./lokacija"
import { User } from "./user"
import { Usluga } from "./usluga"

export class Firma{
    naziv: string = ""
    adresa: string = ""
    usluge: Usluga[] = []
    lokacija: Lokacija | null = null;
    kontaktOsoba: string = ""
    dekorateri: User[] = []
    pocetakGodisnjegOdmora:  string = ""
    krajGodisnjegOdmora:  string = ""
    prosecnaOcena: string = ""
} 