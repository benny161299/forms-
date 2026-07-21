import { Router } from "express";
import { catchAsync } from "../../middlewares/error.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import {
  createSchema,
  deleteSchema,
  getSchemaById,
  getSchemaDrafts,
  getSchemas,
   publishSchema,
  updateSchema,
} from "./schema.controller.js";
import {
  createSchemaValidation,
  deleteSchemaValidation,
  getSchemaByIdValidation,
  getSchemasValidation,
  publishSchemaValidation,
  updateSchemaValidation,
} from "./schema.validations.js";

const router = Router();
router.get("/", validateRequest(getSchemasValidation), catchAsync(getSchemas));

router.get("/drafts", validateRequest(getSchemasValidation), catchAsync(getSchemaDrafts));

router.get("/:id", validateRequest(getSchemaByIdValidation), catchAsync(getSchemaById));

router.post("/", validateRequest(createSchemaValidation), catchAsync(createSchema));

router.put("/:id", validateRequest(updateSchemaValidation), catchAsync(updateSchema));

router.patch("/:id/publish", validateRequest(publishSchemaValidation), catchAsync(publishSchema));

router.delete("/:id", validateRequest(deleteSchemaValidation), catchAsync(deleteSchema));

export default router;
