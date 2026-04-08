import mongoose from 'mongoose'

const odbijenoZakazivanjeSchema = new mongoose.Schema(
    {
        vlasnik: String,
        nazivFirme: String,
        datumDolaskaMajstora: String,
        ukupnaKvadratura: String,
        opis: String,
        usluge: Array,
        razlog: String
    },{
        versionKey:false  
    }
);

export default mongoose.model('OdbZModel', 
    odbijenoZakazivanjeSchema, 'odbijenoZakazivanje');
