import express from 'express'
import axios from 'axios';
import AdminM from '../models/admin'
import ZahtevM from '../models/zahtev'
import UserM from '../models/user'
import OdbNM from '../models/odbijeniNalog'
import FirmaM from '../models/firma'
const bcrypt = require('bcrypt');

async function verifyRecaptcha(recaptchaResponse: string): Promise<boolean> {
    const secretKey = '6Lf0HSAqAAAAAH4zypaOq-hvETLwfMj6YF0T5thW';
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
        params: {
            secret: secretKey,
            response: recaptchaResponse
        }
    });
    return response.data.success;
}

export class AdminController {
    login = (req: express.Request, res: express.Response) => {
        let korIme = req.body.korIme;
        let lozinka = req.body.lozinka;

        AdminM.findOne({ korIme: korIme })
            .then((user) => {
                if (!user) {
                    return res.status(200).json(null);
                }

                bcrypt.compare(lozinka, user.lozinka, function (err: Error, result: boolean) {
                    if (err) {
                        return res.status(500).json({ message: 'Greška prilikom provere lozinke.' });
                    }

                    if (result) {
                        res.json(user)
                    } else {
                        return res.status(200).json(null);
                    }
                });
            })
            .catch((err: Error) => {
                console.error(err);
                res.status(500).json({ message: 'Greška prilikom pretrage korisnika.' });
            });
    }

    dohvatiSveZahteve = (req: express.Request, res: express.Response) => {
        ZahtevM.find({}).then(zahtevi => {
            res.json(zahtevi)
        }).catch((err) => {
            console.log(err)
        })
    }

    prihvatiKorisnika = async (req: express.Request, res: express.Response) => {

        let korisnik = req.body

        await new UserM(korisnik).save().then(ok => {
        }).catch(err => {
            console.log(err)
        })

        let korIme = korisnik.korIme

        ZahtevM.deleteOne({ korIme: korIme }).then(zahtev => {
            res.json({ message: "ok" })
        }).catch(err => {
            console.log(err)
        })
    }

    odbijZahtev = async (req: express.Request, res: express.Response) => {

        let korIme = req.body.korIme
        let gmail = req.body.gmail

        const data = {
            korIme: korIme,
            gmail: gmail
        }

        await new OdbNM(data).save().then(ok => {
        }).catch(err => {
            console.log(err)
        })


        ZahtevM.deleteOne({ korIme: korIme }).then(zahtev => {
            res.json({ message: "ok" })
        }).catch(err => {
            console.log(err)
        })
    }

    dohvatiSveKorisnike = (req: express.Request, res: express.Response) => {
        UserM.find({}).then(korisnici => {
            res.json(korisnici)
        }).catch((err) => {
            console.log(err)
        })
    }

    deaktivirajKorisnika = (req: express.Request, res: express.Response) => {
        let korIme = req.params.korIme;

        UserM.findOneAndUpdate({ korIme: korIme }, { $set: { aktiviran: "Ne" } }).then(
            ok => res.json({ message: "ok" })
        ).catch(err => console.log(err))
    }

    azurirajKorisnika = async (req: express.Request, res: express.Response) => {
        const { korisnik, recaptchaResponse } = req.body;

        const isCaptchaValid = await verifyRecaptcha(recaptchaResponse);
        if (!isCaptchaValid) {
            return res.json({ message: 'reCAPTCHA verification failed' });
        }

        const existingUserByEmail = await UserM.findOne({ gmail: korisnik.gmail, korIme: { $ne: korisnik.korIme } });
        if (existingUserByEmail) {
            res.json({ message: "Same gmail" });
        }

        const inWaitingListGmail = await ZahtevM.findOne({ gmail: korisnik.gmail, korIme: { $ne: korisnik.korIme } });
        if (existingUserByEmail) {
            res.json({ message: "Waiting gmail" });
        }

        const inBlockedListGmail = await OdbNM.findOne({ gmail: korisnik.gmail });
        if (inBlockedListGmail) {
            res.json({ message: "Blocked gmail" });
        }

        if (!existingUserByEmail && !inBlockedListGmail && !inWaitingListGmail) {
            let korIme = korisnik.korIme

            const result = await UserM.findOneAndUpdate(
                { korIme: korIme },
                { $set: korisnik }
            ).then(
                ok => res.json({ message: "ok" })
            ).catch(err => console.log(err))
        }
    }

    registerDeco = async (req: express.Request, res: express.Response) => {

        const { korisnik, recaptchaResponse } = req.body;

        const isCaptchaValid = await verifyRecaptcha(recaptchaResponse);
        if (!isCaptchaValid) {
            return res.json({ message: 'reCAPTCHA verification failed' });
        }

        const existingUserByUsername = await UserM.findOne({ korIme: korisnik.korIme });
        if (existingUserByUsername) {
            res.json({ message: "Same username" });
        }

        const existingUserByEmail = await UserM.findOne({ gmail: korisnik.gmail });
        if (existingUserByEmail) {
            res.json({ message: "Same gmail" });
        }

        const inBlockedListUserName = await OdbNM.findOne({ korIme: korisnik.korIme });
        if (inBlockedListUserName) {
            res.json({ message: "Blocked username" });
        }

        const inBlockedListGmail = await OdbNM.findOne({ gmail: korisnik.gmail });
        if (inBlockedListGmail) {
            res.json({ message: "Blocked gmail" });
        }

        if (!existingUserByEmail && !existingUserByUsername && !inBlockedListUserName && !inBlockedListGmail) {

            // Generiši so (slanu vrednost) - preporučljivo koristiti funkciju bcrypt.genSaltSync()
            const salt = bcrypt.genSaltSync(10);

            // Hesiraj poruku pomoću so-a
            const hesovanaPoruka = bcrypt.hashSync(korisnik.lozinka, salt);

            korisnik.lozinka = hesovanaPoruka

            new UserM(korisnik).save().then(ok => {
                res.json({ message: "ok" })
            }).catch(err => {
                if (err.code === 11000 && err.keyPattern) {
                    const duplicateKey = Object.keys(err.keyPattern)[0];
                    res.json({ message: `${duplicateKey}` })
                    // console.error(`Duplikat pronađen na polju: ${duplicateKey}`);
                } else {
                    console.error(err);
                }
            })
        }
    }

    dohvatiSveSlobodneDekoratere = (req: express.Request, res: express.Response) => {
        UserM.find({ tip: "D", firma: "", aktiviran: "Da" }).then(korisnici => {
            res.json(korisnici)
        }).catch((err) => {
            console.log(err)
        })
    }

    dodajFirmu = (req: express.Request, res: express.Response) => {
        new FirmaM(req.body).save().then(ok => {
            res.json({ message: "ok" })
        }).catch(err => {
            console.log(err)
        })
    }

    dodajFirmuDekoraterima = async (req: express.Request, res: express.Response) => {
        const dekorateri = req.body.dekorateri
        const firma = req.body.firma

        try {
            for (const dekorator of dekorateri) {
                await UserM.updateOne(
                    { korIme: dekorator.korIme },
                    { $set: { firma: firma } }
                );
            }
            res.json({ message: "ok" })
        } catch (error) {
            res.json({ message: "greska" })
        }
    }

    dohvatiSveNaziveFirmi = (req: express.Request, res: express.Response) => {
        FirmaM.find({}).then(firme => {
            const nazivi = firme.map(firma => firma.naziv);
            res.json(nazivi);
        }).catch((err) => {
            console.log(err)
        })
    }

    proveriJelFirmaVecPostoji = (req: express.Request, res: express.Response) => {

        FirmaM.findOne({ naziv: req.params.naziv }).then(firma => {
            if (firma) {
                res.json({ message: "vec postoji" });
            } else {
                res.json({ message: "ok" });
            }
        }).catch(err => {
                res.status(500).json({ message: "Greska u pretrazi", error: err });
            });
    }
}