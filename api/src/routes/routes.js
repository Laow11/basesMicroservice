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

// AP BAPRO
import envios_Bapro_Arg from "./Argenprom/Bapro/Envios.js";

// AP BAYERN ELO
import envios_Bayer_Elo from "./Argenprom/BayerElo/Envios.js";

// AP CIUDAD
import cambios_retirosAP_Ciudad from "./Argenprom/Ciudad/Cambios_Retiros.js";

// AP NETQUEST
import envios_Netquest_Arg from "./Argenprom/Netquest/Envios.js";

// AP MASSALIN
import envios_Massalin_Arg from "./Argenprom/Massalin/Envios.js";

// AP HIPOTECARIO
import envios_Hipotecario_Arg from "./Argenprom/Hipotecario/Envios.js";

// AP CTC
import envios_CTC_Arg from "./Argenprom/CTC/Envios.js";

// AP GALICIA
import cambio_retiros_Galicia from "./Argenprom/Galicia/Cambios_Retiros.js";
import envios_Galicia from "./Argenprom/Galicia/Envios.js";

//----------------------------------------------------------

// DECOMOSS
import envios_DecoMoss from "./DecoMoss/Envios.js";

// PEPPERS
import envios_Peppers from "./Peppers/Envios.js";

// TRIMAGE
import envios_Trimage from "./Trimage/Envios.js";

const router = Router();

// AC Itau
router.use("/", cambios_retirosACItau);

router.use("/", diaria_puntosACItau);

// AC Bapro
router.use("/", cambios_retirosACBapro);

router.use("/", diaria_puntosACBapro);

// AC Macro
router.use("/", envios_Macro);

// AP Ciudad
router.use("/", cambios_retirosAP_Ciudad);

// AP Bayern elo
router.use("/", envios_Bayer_Elo);

// AP Netquest
router.use("/", envios_Netquest_Arg);

// AP Massalin
router.use("/", envios_Massalin_Arg);

// AP Hipotecario
router.use("/", envios_Hipotecario_Arg);

// AP Bapro
router.use("/", envios_Bapro_Arg);

// AP CTC
router.use("/", envios_CTC_Arg);

// AP Galicia CR
router.use("/", cambio_retiros_Galicia);
router.use("/", envios_Galicia);

// Peppers
router.use("/", envios_Peppers);

// DecoMoss
router.use("/", envios_DecoMoss);

// Trimage
router.use("/", envios_Trimage);

// -------------------------Etiquetas de OCA---------------------------------------//

export default router;
