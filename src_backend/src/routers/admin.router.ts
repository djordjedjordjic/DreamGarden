import express from 'express'
import { AdminController } from '../controllers/admin.controller'

const adminRouter = express.Router()

adminRouter.route("/login").post(
    (req,res)=>new AdminController().login(req,res)
)

adminRouter.route("/dohvatiSveZahteve").get(
    (req,res)=>new AdminController().dohvatiSveZahteve(req,res)
)

adminRouter.route("/prihvatiKorisnika").post(
    (req,res)=>new AdminController().prihvatiKorisnika(req,res)
)

adminRouter.route("/odbijZahtev").post(
    (req,res)=>new AdminController().odbijZahtev(req,res)
)

adminRouter.route("/dohvatiSveKorisnike").get(
    (req,res)=>new AdminController().dohvatiSveKorisnike(req,res)
)

adminRouter.route("/deaktivirajKorisnika/:korIme").get(
    (req,res)=>new AdminController().deaktivirajKorisnika(req,res)
)

adminRouter.route("/azurirajKorisnika").post(
    (req,res)=>new AdminController().azurirajKorisnika(req,res)
)

adminRouter.route("/registerDeco").post(
    (req,res)=>new AdminController().registerDeco(req,res)
)

adminRouter.route("/dohvatiSveSlobodneDekoratere").get(
    (req,res)=>new AdminController().dohvatiSveSlobodneDekoratere(req,res)
)

adminRouter.route("/dodajFirmu").post(
    (req,res)=>new AdminController().dodajFirmu(req,res)
)

adminRouter.route("/dodajFirmuDekoraterima").post(
    (req,res)=>new AdminController().dodajFirmuDekoraterima(req,res)
)

adminRouter.route("/dohvatiSveNaziveFirmi").get(
    (req,res)=>new AdminController().dohvatiSveNaziveFirmi(req,res)
)

adminRouter.route("/proveriJelFirmaVecPostoji/:naziv").get(
    (req,res)=>new AdminController().proveriJelFirmaVecPostoji(req,res)
)


export default adminRouter;