import { Router } from "express";
import { createProductController } from "../controllers/product";

export const initRoutes = () => {
    const router = new Router();

    const path = "/product";
    const productController = createProductController();

    router.get('/', productController.defaultData);
    router.get('/readiness', productController.readiness);

    router.get(`${path}/:id`, productController.getProductById);
    router.put(`${path}`, productController.createOrUpdateProduct);
    router.post(`${path}`, productController.createOrUpdateProduct);
    router.get(`${path}/all`, productController.getAllProducts);
    router.delete(`${path}/:id`, productController.deleteProductById);

    return router;
}
