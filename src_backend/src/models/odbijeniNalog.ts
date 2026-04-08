import mongoose from 'mongoose'

const odbijeniNSchema = new mongoose.Schema(
    {
        korIme: String,
        gmail: String
    },{
        versionKey:false  
    }
);

export default mongoose.model('OdbNModel', 
    odbijeniNSchema, 'odbijeniNalog');