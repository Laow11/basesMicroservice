import { Router } from "express";

// ACEASTWAY:

// AC ITAU
import cambios_retirosACItau from "./ACEastway/Itau/Cambios_Retiros.js";
import diaria_puntosACItau from "./ACEastway/Itau/Diaria_Puntos.js";
// AC BAPRO
import cambios_retirosACBapro from "./ACEastway/Bapro/Cambios_Retiros.js";
import diaria_puntosACBapro from "./ACEastway/Bapro/Diaria_Puntos.js";

// AC MACRO
import envios_Macro from "./ACEastway/Macro/Envios.js";

// ARGENPROM:

// CIUDAD

import cambios_retirosAP_Ciudad from "./Argenprom/Ciudad/Cambios_Retiros.js";

// BAYERN ELO

import envios_Bayer_Elo from "./Argenprom/BayerElo/Envios.js";

import envios_Netquest_Arg from "./Argenprom/Netquest/Envios.js";

const router = Router();

// ACEASTWAY:

// AC ITAU
router.use("/", cambios_retirosACItau);
router.use("/", diaria_puntosACItau);

// AC BAPRO
router.use("/", cambios_retirosACBapro);
router.use("/", diaria_puntosACBapro);

// AC MACRO
router.use("/", envios_Macro);

// AP CIUDAD
router.use("/", cambios_retirosAP_Ciudad);

// AP BAYERN ELO
router.use("/", envios_Bayer_Elo);

// Netquest

router.use("/", envios_Netquest_Arg);
export default router;
