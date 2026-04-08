import mongoose from 'mongoose'

const zahtevSchema = new mongoose.Schema(
    {
        korIme: String,
        lozinka: String,
        bezbednosnoPitanje: String,
        bezbednosnoPitanjeOdgovor: String,
        ime: String,
        prezime: String,
        pol: String,
        adresa: String,
        kontaktTelefon: String,
        gmail: String,
        profilnaSlika: String,
        brojKartice: String,
        tip: String,
        aktiviran: String
    },{
        versionKey:false  
    }
);

export default mongoose.model('ZahtevModel', 
    zahtevSchema, 'zahtev');