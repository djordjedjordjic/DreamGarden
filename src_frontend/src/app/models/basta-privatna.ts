import { Usluga } from "./usluga"

export class PrivatnaBastaRaspored{
    vlasnik: string = ""
    datumZakazivanja: string = ""
    datumDolaskaMajstora: string = ""
    ukupnaKvadratura: string = ""
    kvadraturaPodBazenom: string = ""
    kvadraturaPodZelenilom: string = ""
    kvadraturaLezaljkeIStolovi: string = ""
    opis: string = ""
    usluge: Usluga[] = []
    nazivFirme: string = ""
    izgled: string = ""
    dekorater: string = ""
    status: string = ""
    komentar: string = ""
    ocena: string = ""
    datumZavrsetka: string = ""
}