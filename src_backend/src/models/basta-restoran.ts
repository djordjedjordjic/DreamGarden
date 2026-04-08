import mongoose from 'mongoose'

const restoranBastaSchema = new mongoose.Schema(
    {
        vlasnik: String,
        datumZakazivanja: String,
        datumDolaskaMajstora: String,
        ukupnaKvadratura: String,
        kvadraturaPodFontanom: String,
        kvadraturaPodZelenilom: String,
        brojLezaljki: String,
        brojStolova: String,
        opis: String,
        usluge: Array,
        nazivFirme: String,
        izgled: String,
        dekorater: String,
        status: String,
        komentar: String,
        ocena: String,
        datumZavrsetka: String

    }, {
    versionKey: false
}
);

export default mongoose.model('ResBModel',
    restoranBastaSchema, 'restoran-basta');