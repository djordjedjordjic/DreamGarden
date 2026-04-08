import { Usluga } from "./usluga"

export class RestoranBastaRaspored {
    vlasnik: string = ""
    datumZakazivanja: string = ""
    datumDolaskaMajstora: string = ""
    ukupnaKvadratura: string = ""
    kvadraturaPodFontanom: string = ""
    kvadraturaPodZelenilom: string = ""
    brojLezaljki: string = ""
    brojStolova: string = ""
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