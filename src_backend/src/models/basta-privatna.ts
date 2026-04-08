import mongoose from 'mongoose'

const privatnaBastaSchema = new mongoose.Schema(
    {
        vlasnik: String,
        datumZakazivanja: String,
        datumDolaskaMajstora: String,
        ukupnaKvadratura: String,
        kvadraturaPodBazenom: String,
        kvadraturaPodZelenilom: String,
        kvadraturaLezaljkeIStolovi: String,
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

export default mongoose.model('PrivBModel',
    privatnaBastaSchema, 'privatna-basta');