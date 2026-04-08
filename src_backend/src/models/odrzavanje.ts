import mongoose from 'mongoose'

const odrzavanjeSchema = new mongoose.Schema(
    {
        idZakazivanja: String,
        nazivFirme: String,
        vlasnik: String,
        datumPoslednjegOdrzavanja: String,
        status: String
    },{
        versionKey:false  
    }
);

export default mongoose.model('OdrzavanjeModel', 
    odrzavanjeSchema, 'odrzavanje');