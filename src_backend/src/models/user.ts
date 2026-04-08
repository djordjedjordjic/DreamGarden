import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        korIme: String,
        lozinka: String,
        ime: String,
        prezime: String,
        pol: String,
        adresa: String,
        kontaktTelefon: String,
        gmail: String,
        profilnaSlika: String,
        brojKartice: String,
        tip: String,
        aktiviran: String,
        firma: String
    },{
        versionKey:false  
    }
);

export default mongoose.model('UserModel', 
    userSchema, 'korisnik');