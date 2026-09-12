import { Router } from "express";
import { listProduct, getCategories, getProductBySlug } from "../controllers/productController";

const router = Router();

router.use("/", listProduct);
router.use("/categories", getCategories);
router.use("/:slug", getProductBySlug);

export default router;