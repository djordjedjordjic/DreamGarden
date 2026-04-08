import mongoose from 'mongoose'

const lokacijaSchema = new mongoose.Schema({
    lat: Number,
    lng: Number
  });

const firmaSchema = new mongoose.Schema(
    {
        naziv: String,
        adresa: String,
        usluge: Array,
        lokacija: lokacijaSchema,
        kontaktOsoba: String,
        dekorateri: Array,
        pocetakGodisnjegOdmora: String,
        krajGodisnjegOdmora: String
    }, {
    versionKey: false
}
);

export default mongoose.model('FirmaModel',
    firmaSchema, 'firma');
