import express from 'express'
import axios from 'axios';
import UserM from '../models/user'
import ZahtevM from '../models/zahtev'
import OdbNM from '../models/odbijeniNalog'
import FirmaM from '../models/firma'
import PrivB from '../models/basta-privatna'
import RestoranB from '../models/basta-restoran'
import OdbZakaz from '../models/odbijenoZakazivanje'
import OdrzavanjeM from '../models/odrzavanje'
const bcrypt = require('bcrypt');
import multer from 'multer';
import path from 'path';
import * as fs from 'fs';

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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //process.cwd() vraca koreni direktorijum koji je za nas backend, zato moramo i iz njega da izadjemo(../)
        const dir = path.join(process.cwd(), '../frontend/app/src/assets/profilePic');
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // const ext = path.extname(file.originalname);
        // const baseFilename = req.body.korIme;
        // console.log(baseFilename)
        // const jpgFullPath = path.join(process.cwd(), '../frontend/app/src/assets/profilePic', baseFilename + '.jpg');
        // const pngFullPath = path.join(process.cwd(), '../frontend/app/src/assets/profilePic', baseFilename + '.png');
        // console.log(jpgFullPath)
        // console.log(pngFullPath)
        // if (fs.existsSync(jpgFullPath)) {
        //     fs.unlinkSync(jpgFullPath);
        // } else if (fs.existsSync(pngFullPath)) {
        //     fs.unlinkSync(pngFullPath);
        // }

        // const filename = baseFilename + ext;

        const ext = path.extname(file.originalname);
        const filename = req.body.korIme + ext;
        const fullPath = path.join(process.cwd(), '../frontend/app/src/assets/profilePic', filename);
        // console.log("Saving file as:", filename);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
        cb(null, filename);
        cb(null, filename);
    }
});

const upload = multer({ storage: storage })

const jsonStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(process.cwd(), '../frontend/app/src/assets/jsonFiles');
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const randomNum = Math.floor(Math.random() * 1000000);
        const filename = `${req.body.korIme}_${randomNum}.json`;
        const fullPath = path.join(process.cwd(), '../frontend/app/src/assets/jsonFiles', filename);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
        cb(null, filename);
    }
});

const uploadJson = multer({ storage: jsonStorage });

export class UserController {

    login = (req: express.Request, res: express.Response) => {
        let korIme = req.body.korIme;
        let lozinka = req.body.lozinka;

        UserM.findOne({ korIme: korIme })
            .then((user) => {
                if (!user) {
                    return ZahtevM.findOne({ korIme: korIme }).then(ok => {
                        res.json({ message: "cekanje" })
                    }).catch((err: Error) => {
                        console.error(err);
                        res.status(500).json({ message: 'Greška prilikom pretrage korisnika.' });
                    });
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

    register = async (req: express.Request, res: express.Response) => {

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

        const inWaitingListUserName = await ZahtevM.findOne({ korIme: korisnik.korIme });
        if (inWaitingListUserName) {
            res.json({ message: "Waiting username" });
        }

        const inWaitingListGmail = await ZahtevM.findOne({ gmail: korisnik.gmail });
        if (inWaitingListGmail) {
            res.json({ message: "Waiting gmail" });
        }

        const inBlockedListUserName = await OdbNM.findOne({ korIme: korisnik.korIme });
        if (inBlockedListUserName) {
            res.json({ message: "Blocked username" });
        }

        const inBlockedListGmail = await OdbNM.findOne({ gmail: korisnik.gmail });
        if (inBlockedListGmail) {
            res.json({ message: "Blocked gmail" });
        }

        if (!existingUserByEmail && !existingUserByUsername && !inBlockedListUserName && !inBlockedListGmail && !inWaitingListUserName && !inWaitingListGmail) {

            // Generiši so (slanu vrednost) - preporučljivo koristiti funkciju bcrypt.genSaltSync()
            const salt = bcrypt.genSaltSync(10);

            // Hesiraj poruku pomoću so-a
            const hesovanaPoruka = bcrypt.hashSync(korisnik.lozinka, salt);

            korisnik.lozinka = hesovanaPoruka

            new ZahtevM(korisnik).save().then(ok => {
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

    postaviNovuSifru = async (req: express.Request, res: express.Response) => {
        try {
            let korIme = req.body.korIme;
            let staraLozinka = req.body.staraLozinka;
            let novaLozinka = req.body.novaLozinka;

            const user = await UserM.findOne({ korIme: korIme });
            if (!user) {
                return res.json({ message: 'Korisnik nije pronadjen.' });
            }

            const isMatch = await bcrypt.compare(staraLozinka, user.lozinka);
            if (!isMatch) {
                return res.json({ message: "Nije dobra lozinka" });
            }

            const salt = bcrypt.genSaltSync(10);
            const hashedNovaLozinka = bcrypt.hashSync(novaLozinka, salt);

            await UserM.findOneAndUpdate({ korIme: korIme }, { $set: { lozinka: hashedNovaLozinka } });
            res.json({ message: "ok" });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Greška prilikom ažuriranja lozinke.' });
        }
    }

    dodajSliku = (req: express.Request, res: express.Response) => {

        //multer presrece multipart/form-data fajlove i onda kada se okine upload.single on se prvi poziva, a zatim 
        //podaci postaju dostupni u req.body
        upload.single('file')(req, res, (err) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }

            if (!req.file) {
                return res.status(400).json({ message: 'Nema fajla' });
            }

            // console.log('Sadržaj req.file nakon obrade:', req.file);       
            // const fullPath = req.file.path;

            const korIme = req.body.korIme;
            if (!korIme) {
                return res.status(400).json({ message: 'korIme nije prosleđeno' });
            }

            const jpgPath = path.join(req.file.destination, korIme + '.jpg');
            const pngPath = path.join(req.file.destination, korIme + '.png');
            const ext = path.extname(req.file.originalname);

            if (ext != '.jpg' && fs.existsSync(jpgPath)) {
                fs.unlinkSync(jpgPath);
            }
            if (ext != '.png' && fs.existsSync(pngPath)) {
                fs.unlinkSync(pngPath);
            }


            const newFilename = korIme + ext;
            const newPath = path.join(req.file.destination, newFilename);

            //console.log(newPath)
            //menjam ime fajla da bude korisnicko ime radi jednostavnosti
            fs.rename(req.file.path, newPath, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Greska pri promeni imena fajla' });
                }

                const relativePath = path.relative(process.cwd(), newPath);
                const baseDir = path.join('frontend', 'app', 'src');

                const index = relativePath.indexOf(baseDir);
                if (index !== -1) {
                    const publicPath = relativePath.substring(index + baseDir.length).replace(/\\/g, '/'); // Zamena \ sa /
                    // console.log("Public path:", publicPath);
                    res.json({ message: 'ok', filePath: publicPath });
                } else {
                    res.status(400).json({ message: 'Greska u putanji' });
                }

            });
        });
    }

    azurirajProfilnu = (req: express.Request, res: express.Response) => {
        let korIme = req.body.korIme;
        let profilna = req.body.profilna;

        ZahtevM.updateOne({ korIme: korIme },
            { $set: { profilnaSlika: profilna } }).then(
                ok => res.json({ message: "ok" })
            ).catch(err => console.log(err))
    };

    azurirajPodatkeKorisniku = async (req: express.Request, res: express.Response) => {
        const korisnik = req.body

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

    azurirajProfilnuKorisniku = (req: express.Request, res: express.Response) => {
        let korIme = req.body.korIme;
        let profilna = req.body.profilna;

        UserM.updateOne({ korIme: korIme },
            { $set: { profilnaSlika: profilna } }).then(
                ok => res.json({ message: "ok" })
            ).catch(err => console.log(err))
    };

    dohvatiBrojDekorisanihBasta = async (req: express.Request, res: express.Response) => {

        try {
            // Izvršavanje oba asinhrona poziva paralelno pomoću Promise.all
            const [brojBastaPrivatnih, brojBastaRestoran] = await Promise.all([
                PrivB.countDocuments({ status: "Zavrseno" }),
                RestoranB.countDocuments({ status: "Zavrseno" })
            ]);

            const ukupnoDekorisaneBaste = brojBastaPrivatnih + brojBastaRestoran;
            res.json(ukupnoDekorisaneBaste);
        } catch (err) {
            console.error(err);
        }

    }


    dohvatiBrojVlasnika = (req: express.Request, res: express.Response) => {
        UserM.countDocuments({ tip: "V" }).then(broj => {
            res.json(broj)
        }).catch((err) => {
            console.log(err)
        })
    }

    dohvatiBrojDekoratera = (req: express.Request, res: express.Response) => {
        UserM.countDocuments({ tip: "D" }).then(broj => {
            res.json(broj)
        }).catch((err) => {
            console.log(err)
        })
    }

    dohvatiSveFirme = (req: express.Request, res: express.Response) => {
        FirmaM.find({}).then(firme => {
            res.json(firme)
        }).catch((err) => {
            console.log(err)
        })
    }

    dohvatiPosloveZaTrazenoVreme = async (req: express.Request, res: express.Response) => {
        try {
            const danasnjiDatum = new Date();
            const poslednjih24h = new Date(danasnjiDatum);
            poslednjih24h.setDate(danasnjiDatum.getDate() - 1);

            const poslednjih7dana = new Date(danasnjiDatum);
            poslednjih7dana.setDate(danasnjiDatum.getDate() - 7);

            const poslednjih30dana = new Date(danasnjiDatum);
            poslednjih30dana.setDate(danasnjiDatum.getDate() - 30);

            // Izvršavanje asinhronih poziva paralelno pomoću Promise.all
            const [brojBastaPoslednjih24h, brojBastaPoslednjih7dana, brojBastaPoslednjih30dana] = await Promise.all([
                // Za poslednjih 24 sata
                Promise.all([
                    PrivB.countDocuments({ datumZakazivanja: { $gte: poslednjih24h.toISOString() } }),
                    RestoranB.countDocuments({ datumZakazivanja: { $gte: poslednjih24h.toISOString() } })
                ]).then(([privatne, restorani]) => privatne + restorani),

                // Za poslednjih 7 dana
                Promise.all([
                    PrivB.countDocuments({ datumZakazivanja: { $gte: poslednjih7dana.toISOString() } }),
                    RestoranB.countDocuments({ datumZakazivanja: { $gte: poslednjih7dana.toISOString() } })
                ]).then(([privatne, restorani]) => privatne + restorani),

                // Za poslednjih 30 dana
                Promise.all([
                    PrivB.countDocuments({ datumZakazivanja: { $gte: poslednjih30dana.toISOString() } }),
                    RestoranB.countDocuments({ datumZakazivanja: { $gte: poslednjih30dana.toISOString() } })
                ]).then(([privatne, restorani]) => privatne + restorani)
            ]);

            const rezultati = [brojBastaPoslednjih24h, brojBastaPoslednjih7dana, brojBastaPoslednjih30dana];
            res.json(rezultati);
        } catch (err) {
            console.error(err);
        }
    }


    dohvatiFirmuSaDatimNazivom = (req: express.Request, res: express.Response) => {
        let naziv = req.params.naziv;

        FirmaM.findOne({ naziv: naziv }).then(
            firma => res.json(firma)
        ).catch(err => console.log(err))
    }

    dodajPrivatnuBastu = (req: express.Request, res: express.Response) => {

        new PrivB(req.body).save().then(ok => {
            res.json({ message: "ok" })
        }).catch(err => {
            console.log(err)
        })
    }

    dodajBastuRestorana = (req: express.Request, res: express.Response) => {

        new RestoranB(req.body).save().then(ok => {
            res.json({ message: "ok" })
        }).catch(err => {
            console.log(err)
        })
    }

    dodajJSONFajl = (req: express.Request, res: express.Response) => {

        uploadJson.single('fileJSON')(req, res, (err) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }

            if (!req.file) {
                return res.status(400).json({ message: 'Nema fajla' });
            }

            const korIme = req.body.korIme;
            if (!korIme) {
                return res.status(400).json({ message: 'korIme nije prosleđeno' });
            }

            const ext = path.extname(req.file.originalname);
            const randomNum = Math.floor(Math.random() * 1000000);
            const newFilename = `${req.body.korIme}_${randomNum}` + ext;
            const newPath = path.join(req.file.destination, newFilename);

            fs.rename(req.file.path, newPath, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Greska pri promeni imena fajla' });
                }

                const relativePath = path.relative(process.cwd(), newPath);
                const baseDir = path.join('frontend', 'app', 'src');

                const index = relativePath.indexOf(baseDir);
                if (index !== -1) {
                    const publicPath = relativePath.substring(index + baseDir.length).replace(/\\/g, '/'); // Zamena \ sa /
                    res.json({ message: 'ok', filePath: publicPath });
                } else {
                    res.status(400).json({ message: 'Greska u putanji' });
                }

            });
        });
    }

    dohvatiSvaZakazivanjaZaPrivatnuBastuTrenutna = (req: express.Request, res: express.Response) => {
        let nazivFirme = req.body.nazivFirme;

        PrivB.find({
            nazivFirme: nazivFirme, $or: [
                { status: "Cekanje" },
                { status: "Prihvaceno", dekorater: req.body.dekorater }
            ]
        }).then(
            zakazivanja => res.json(zakazivanja)
        ).catch(err => console.log(err))
    }

    dohvatiSvaZakazivanjaZaRestoranTrenutna = (req: express.Request, res: express.Response) => {
        let nazivFirme = req.body.nazivFirme;

        RestoranB.find({
            nazivFirme: nazivFirme, $or: [
                { status: "Cekanje" },
                { status: "Prihvaceno", dekorater: req.body.dekorater }
            ]
        }).then(
            zakazivanja => res.json(zakazivanja)
        ).catch(err => console.log(err))
    }

    odbijZakazivanje = (req: express.Request, res: express.Response) => {

        let zakazivanje = req.body.zakazivanje

        const odbijenoZakazivanje = {
            vlasnik: zakazivanje.vlasnik,
            nazivFirme: zakazivanje.nazivFirme,
            datumDolaskaMajstora: zakazivanje.datumDolaskaMajstora,
            ukupnaKvadratura: zakazivanje.ukupnaKvadratura,
            opis: zakazivanje.opis,
            usluge: zakazivanje.usluge,
            razlog: req.body.razlog
        }

        new OdbZakaz(odbijenoZakazivanje).save().then(ok => {

            if ('kvadraturaPodBazenom' in zakazivanje) {
                PrivB.deleteOne({ _id: zakazivanje._id }).then(zahtev => {
                    res.json({ message: "ok" })
                }).catch(err => {
                    console.log(err)
                })
            }
            else {
                RestoranB.deleteOne({ _id: zakazivanje._id }).then(zahtev => {
                    res.json({ message: "ok" })
                }).catch(err => {
                    console.log(err)
                })
            }

        }).catch(err => {
            console.log(err)
        })

    }

    azurirajZakazivanje = (req: express.Request, res: express.Response) => {

        const zakazivanje = req.body

        if ('kvadraturaPodBazenom' in zakazivanje) {

            PrivB.findOneAndUpdate(
                { _id: zakazivanje._id },
                { $set: zakazivanje }
            ).then(
                ok => res.json({ message: "ok" })
            ).catch(err => console.log(err))
        }
        else {
            RestoranB.findOneAndUpdate(
                { _id: zakazivanje._id },
                { $set: zakazivanje }
            ).then(
                ok => res.json({ message: "ok" })
            ).catch(err => console.log(err))
        }
    }

    dohvatiSvaZakazivanjaPrivatnaSaDatimKorIme = (req: express.Request, res: express.Response) => {
        let korIme = req.params.korIme;

        PrivB.find({ vlasnik: korIme }).then(
            zakazivanja => res.json(zakazivanja)
        ).catch(err => console.log(err))
    }

    dohvatiSvaZakazivanjaRestoranSaDatimKorIme = (req: express.Request, res: express.Response) => {
        let korIme = req.params.korIme;

        RestoranB.find({ vlasnik: korIme }).then(
            zakazivanja => res.json(zakazivanja)
        ).catch(err => console.log(err))
    }

    dohvatiSvaOdbijenaZakazivanja = (req: express.Request, res: express.Response) => {
        let korIme = req.params.korIme;

        OdbZakaz.find({ vlasnik: korIme }).then(
            zakazivanja => res.json(zakazivanja)
        ).catch(err => console.log(err))
    }

    dohvatiSvaZakazivanjaPrivatna = (req: express.Request, res: express.Response) => {

        PrivB.find().then(
            zakazivanja => res.json(zakazivanja)
        ).catch(err => console.log(err))
    }

    dohvatiSvaZakazivanjaRestoran = (req: express.Request, res: express.Response) => {

        RestoranB.find().then(
            zakazivanja => res.json(zakazivanja)
        ).catch(err => console.log(err))
    }

    dohvatiSvaZakazivanjaPrivatnaSaDatimNazivomFirme = (req: express.Request, res: express.Response) => {
        let nazivFirme = req.params.nazivFirme

        PrivB.find({ nazivFirme: nazivFirme }).then(
            zakazivanja => res.json(zakazivanja)
        ).catch(err => console.log(err))
    }

    dohvatiSvaZakazivanjaRestoranSaDatimNazivomFirme = (req: express.Request, res: express.Response) => {
        let nazivFirme = req.params.nazivFirme

        RestoranB.find({ nazivFirme: nazivFirme }).then(
            zakazivanja => res.json(zakazivanja)
        ).catch(err => console.log(err))
    }

    otkaziPosao = (req: express.Request, res: express.Response) => {

        const zakazivanje = req.body

        if ('kvadraturaPodBazenom' in zakazivanje) {

            PrivB.deleteOne({ _id: zakazivanje._id }).then(zahtev => {
                res.json({ message: "ok" })
            }).catch(err => {
                console.log(err)
            })
        }
        else {

            RestoranB.deleteOne({ _id: zakazivanje._id }).then(zahtev => {
                res.json({ message: "ok" })
            }).catch(err => {
                console.log(err)
            })
        }
    }

    dohvatiSvaZavrsenaZakazivanjaSaKorIme = (req: express.Request, res: express.Response) => {
        let korIme = req.params.korIme

        Promise.all([
            RestoranB.find({ vlasnik: korIme, status: "Zavrseno" }),
            PrivB.find({ vlasnik: korIme, status: "Zavrseno" })
        ])
            .then(([zakazivanjaRestoran, zakazivanjaPrivatna]) => {
                const svaZakazivanja = [...zakazivanjaRestoran, ...zakazivanjaPrivatna];

                res.json(svaZakazivanja);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: "Greška pri dohvatanju podataka." });
            });
    }

    dohvatiOdrKojaMoguDaSeServisiraju = async (req: express.Request, res: express.Response) => {
        try {
            const zakazivanja = req.body
            const preSestMeseci = new Date()
            preSestMeseci.setMonth(preSestMeseci.getMonth() - 6)
            const danasnjiDatum = new Date()

            const validnaZakazivanjaId: string[] = []

            const gotovaOdrzavanja = await OdrzavanjeM.find({ status: "U procesu" })

            for (const odrzavanje of gotovaOdrzavanja) {

                if (odrzavanje.datumPoslednjegOdrzavanja && new Date(odrzavanje.datumPoslednjegOdrzavanja) < danasnjiDatum) {
                    await OdrzavanjeM.updateOne(
                        { _id: odrzavanje._id },
                        { $set: { status: "Zavrseno" } }
                    );
                }
            }

            await Promise.all(zakazivanja.map(async (zakazivanje: any) => {

                const odrzavanje = await OdrzavanjeM.find({ idZakazivanja: zakazivanje._id });

                if (odrzavanje.length > 0) {

                    if (odrzavanje[0].status == "Zavrseno") {

                        const poslednjeOdrzavanje = odrzavanje[0].datumPoslednjegOdrzavanja

                        if (poslednjeOdrzavanje) {
                            const poslednjeOdrzavanjeDate = new Date(poslednjeOdrzavanje);

                            if (poslednjeOdrzavanjeDate < preSestMeseci) {
                                validnaZakazivanjaId.push(zakazivanje._id);
                            }
                        }
                    }
                }

                else {
                    let poslednjeOdrzavanje = ""
                    if ('kvadraturaPodBazenom' in zakazivanje) {
                        const privatnaBasta = await PrivB.find({ _id: zakazivanje._id })
                        if (privatnaBasta.length > 0 && privatnaBasta[0].datumZavrsetka) {
                            poslednjeOdrzavanje = privatnaBasta[0].datumZavrsetka
                        }
                    }
                    else {
                        const restoranBasta = await RestoranB.find({ _id: zakazivanje._id })
                        if (restoranBasta.length > 0 && restoranBasta[0].datumZavrsetka) {
                            poslednjeOdrzavanje = restoranBasta[0].datumZavrsetka
                        }
                    }

                    if (poslednjeOdrzavanje) {
                        const poslednjeOdrzavanjeDate = new Date(poslednjeOdrzavanje);

                        if (poslednjeOdrzavanjeDate < preSestMeseci) {
                            validnaZakazivanjaId.push(zakazivanje._id);
                        }
                    }
                }
            }));

            res.json(validnaZakazivanjaId);

        } catch (err) {
            console.error(err);
        }
    }

    zakaziOdrzavanje = async (req: express.Request, res: express.Response) => {
        try {
            const zakazivanje = req.body

            const postojiVecOdrzavanje = await OdrzavanjeM.find({ idZakazivanja: zakazivanje._id });

            if (postojiVecOdrzavanje.length > 0) {

                await OdrzavanjeM.findOneAndUpdate({ idZakazivanja: zakazivanje._id }, { $set: { status: "Cekanje"} }).then(
                    data =>{
                         res.json({ message: "ok" })
                    }
                ).catch(err => console.log(err))
            }

            else {

                const odrzavanje = {
                    idZakazivanja: zakazivanje._id,
                    nazivFirme: zakazivanje.nazivFirme,
                    vlasnik: zakazivanje.vlasnik,
                    datumPoslednjegOdrzavanja: "",
                    status: "Cekanje"

                }

                await new OdrzavanjeM(odrzavanje).save().then(ok => {
                    res.json({ message: "ok" })
                }).catch(err => {
                    console.log(err)
                })

            }

        } catch (err) {
            console.error(err);
        }
    }

    dohvatiTrenutnaOdrzavanja = (req: express.Request, res: express.Response) => {
        let vlasnik = req.params.korIme

        OdrzavanjeM.find({ vlasnik: vlasnik, status: { $ne: "Zavrseno" } }).then(
            firma => res.json(firma)
        ).catch(err => console.log(err))
    }

    dohvatiSvaOdrzavanjaNaCekanjuZaFirmu = (req: express.Request, res: express.Response) => {
        let nazivFirme = req.params.nazivFirme

        OdrzavanjeM.find({ nazivFirme: nazivFirme, status: "Cekanje" }).then(
            firma => res.json(firma)
        ).catch(err => console.log(err))
    }

    odbijOdrzavanje = (req: express.Request, res: express.Response) => {
        let odrzavanje = req.body

        OdrzavanjeM.findOneAndDelete({ _id: odrzavanje._id }).then(
            firma => res.json({ message: "ok" })
        ).catch(err => console.log(err))
    }

    prihvatiOdrzavanje = (req: express.Request, res: express.Response) => {
        let odrzavanje = req.body

        OdrzavanjeM.findOneAndUpdate({ _id: odrzavanje._id }, { $set: { status: "U procesu", datumPoslednjegOdrzavanja: odrzavanje.datumPoslednjegOdrzavanja } }).then(
            data => res.json({ message: "ok" })
        ).catch(err => console.log(err))
    }

    dohvatiSvaZavrsenaZakazivanjaSaKorImeDeko = (req: express.Request, res: express.Response) => {
        let korIme = req.params.korIme

        Promise.all([
            RestoranB.find({ dekorater: korIme, status: "Zavrseno" }),
            PrivB.find({ dekorater: korIme, status: "Zavrseno" })
        ])
            .then(([zakazivanjaRestoran, zakazivanjaPrivatna]) => {
                const svaZakazivanja = [...zakazivanjaRestoran, ...zakazivanjaPrivatna];

                res.json(svaZakazivanja);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: "Greska pri dohvatanju podataka." });
            });
    }

    dohvatiSvaZavrsenaZakazivanjaSaNazivomFirmeDeko = (req: express.Request, res: express.Response) => {
        let nazivFirme = req.params.nazivFirme

        Promise.all([
            RestoranB.find({ nazivFirme: nazivFirme, status: "Zavrseno" }),
            PrivB.find({ nazivFirme: nazivFirme, status: "Zavrseno" })
        ])
            .then(([zakazivanjaRestoran, zakazivanjaPrivatna]) => {
                const svaZakazivanja = [...zakazivanjaRestoran, ...zakazivanjaPrivatna];

                res.json(svaZakazivanja);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: "Greska pri dohvatanju podataka." });
            });
    }

    dohvatiSvaZavrsenaZakazivanja = (req: express.Request, res: express.Response) => {

        Promise.all([
            RestoranB.find({ status: "Zavrseno" }),
            PrivB.find({ status: "Zavrseno" })
        ])
            .then(([zakazivanjaRestoran, zakazivanjaPrivatna]) => {
                const svaZakazivanja = [...zakazivanjaRestoran, ...zakazivanjaPrivatna];

                res.json(svaZakazivanja);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: "Greska pri dohvatanju podataka." });
            });
    }

}