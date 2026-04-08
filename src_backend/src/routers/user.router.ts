import express from 'express'
import { UserController } from '../controllers/user.controller'

const userRouter = express.Router()

userRouter.route("/login").post(
    (req,res)=>new UserController().login(req,res)
)

userRouter.route("/register").post(
    (req,res)=>new UserController().register(req,res)
)

userRouter.route("/postaviNovuSifru").post(
    (req,res)=>new UserController().postaviNovuSifru(req,res)
)

userRouter.route("/dodajSliku").post(
    (req,res)=>new UserController().dodajSliku(req,res)
)

userRouter.route("/azurirajProfilnu").post(
    (req, res) => new UserController().azurirajProfilnu(req, res)
)

userRouter.route("/azurirajPodatkeKorisniku").post(
    (req, res) => new UserController().azurirajPodatkeKorisniku(req, res)
)

userRouter.route("/azurirajProfilnuKorisniku").post(
    (req, res) => new UserController().azurirajProfilnuKorisniku(req, res)
)
//ne-registrovani

userRouter.route("/dohvatiBrojDekorisanihBasta").get(
    (req,res)=>new UserController().dohvatiBrojDekorisanihBasta(req,res)
)

userRouter.route("/dohvatiBrojVlasnika").get(
    (req,res)=>new UserController().dohvatiBrojVlasnika(req,res)
)

userRouter.route("/dohvatiBrojDekoratera").get(
    (req,res)=>new UserController().dohvatiBrojDekoratera(req,res)
)

userRouter.route("/dohvatiSveFirme").get(
    (req,res)=>new UserController().dohvatiSveFirme(req,res)
)

userRouter.route("/dohvatiPosloveZaTrazenoVreme").get(
    (req,res)=>new UserController().dohvatiPosloveZaTrazenoVreme(req,res)
)
//
userRouter.route("/dohvatiFirmuSaDatimNazivom/:naziv").get(
    (req,res)=>new UserController().dohvatiFirmuSaDatimNazivom(req,res)
)

userRouter.route("/dodajPrivatnuBastu").post(
    (req,res)=>new UserController().dodajPrivatnuBastu(req,res)
)

userRouter.route("/dodajBastuRestorana").post(
    (req,res)=>new UserController().dodajBastuRestorana(req,res)
)

userRouter.route("/dodajJSONFajl").post(
    (req,res)=>new UserController().dodajJSONFajl(req,res)
)

//dekorater-zakazivanja
userRouter.route("/dohvatiSvaZakazivanjaZaPrivatnuBastuTrenutna").post(
    (req,res)=>new UserController().dohvatiSvaZakazivanjaZaPrivatnuBastuTrenutna(req,res)
)

userRouter.route("/dohvatiSvaZakazivanjaZaRestoranTrenutna").post(
    (req,res)=>new UserController().dohvatiSvaZakazivanjaZaRestoranTrenutna(req,res)
)

userRouter.route("/odbijZakazivanje").post(
    (req,res)=>new UserController().odbijZakazivanje(req,res)
)

userRouter.route("/azurirajZakazivanje").post(
    (req,res)=>new UserController().azurirajZakazivanje(req,res)
)
//vlasnik-zakazivanja

userRouter.route("/dohvatiSvaZakazivanjaPrivatnaSaDatimKorIme/:korIme").get(
    (req,res)=>new UserController().dohvatiSvaZakazivanjaPrivatnaSaDatimKorIme(req,res)
)

userRouter.route("/dohvatiSvaZakazivanjaRestoranSaDatimKorIme/:korIme").get(
    (req,res)=>new UserController().dohvatiSvaZakazivanjaRestoranSaDatimKorIme(req,res)
)

userRouter.route("/dohvatiSvaOdbijenaZakazivanja/:korIme").get(
    (req,res)=>new UserController().dohvatiSvaOdbijenaZakazivanja(req,res)
)

userRouter.route("/dohvatiSvaZakazivanjaPrivatna").get(
    (req,res)=>new UserController().dohvatiSvaZakazivanjaPrivatna(req,res)
)

userRouter.route("/dohvatiSvaZakazivanjaRestoran").get(
    (req,res)=>new UserController().dohvatiSvaZakazivanjaRestoran(req,res)
)

userRouter.route("/dohvatiSvaZakazivanjaPrivatnaSaDatimNazivomFirme/:nazivFirme").get(
    (req,res)=>new UserController().dohvatiSvaZakazivanjaPrivatnaSaDatimNazivomFirme(req,res)
)

userRouter.route("/dohvatiSvaZakazivanjaRestoranSaDatimNazivomFirme/:nazivFirme").get(
    (req,res)=>new UserController().dohvatiSvaZakazivanjaRestoranSaDatimNazivomFirme(req,res)
)

userRouter.route("/otkaziPosao").post(
    (req,res)=>new UserController().otkaziPosao(req,res)
)

//vlasnik-odrzavanje

userRouter.route("/dohvatiSvaZavrsenaZakazivanjaSaKorIme/:korIme").get(
    (req,res)=>new UserController().dohvatiSvaZavrsenaZakazivanjaSaKorIme(req,res)
)

userRouter.route("/dohvatiOdrKojaMoguDaSeServisiraju").post(
    (req,res)=>new UserController().dohvatiOdrKojaMoguDaSeServisiraju(req,res)
)

userRouter.route("/zakaziOdrzavanje").post(
    (req,res)=>new UserController().zakaziOdrzavanje(req,res)
)

userRouter.route("/dohvatiTrenutnaOdrzavanja/:korIme").get(
    (req,res)=>new UserController().dohvatiTrenutnaOdrzavanja(req,res)
)

//dekorater-odrzavanje

userRouter.route("/dohvatiSvaOdrzavanjaNaCekanjuZaFirmu/:nazivFirme").get(
    (req,res)=>new UserController().dohvatiSvaOdrzavanjaNaCekanjuZaFirmu(req,res)
)

userRouter.route("/odbijOdrzavanje").post(
    (req,res)=>new UserController().odbijOdrzavanje(req,res)
)

userRouter.route("/prihvatiOdrzavanje").post(
    (req,res)=>new UserController().prihvatiOdrzavanje(req,res)
)

//dekorater-statistika

userRouter.route("/dohvatiSvaZavrsenaZakazivanjaSaKorImeDeko/:korIme").get(
    (req,res)=>new UserController().dohvatiSvaZavrsenaZakazivanjaSaKorImeDeko(req,res)
)

userRouter.route("/dohvatiSvaZavrsenaZakazivanjaSaNazivomFirmeDeko/:nazivFirme").get(
    (req,res)=>new UserController().dohvatiSvaZavrsenaZakazivanjaSaNazivomFirmeDeko(req,res)
)

userRouter.route("/dohvatiSvaZavrsenaZakazivanja").get(
    (req,res)=>new UserController().dohvatiSvaZavrsenaZakazivanja(req,res)
)

export default userRouter;