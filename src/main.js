import { logger } from "./app/logging.js";
import { app } from "./app/web.js";

app.listen(6000, () => {
    logger.info("App Start ...");
})