import { Router } from "express";
import instanceRoutes from "./services/instances/instance.routes.js";
import schemaRoutes from "./services/schemas/schema.routes.js";

const apiRouter = Router();

apiRouter.use("/schemas", schemaRoutes);
apiRouter.use("/instances", instanceRoutes);

export default apiRouter;
