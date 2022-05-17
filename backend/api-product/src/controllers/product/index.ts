import { Request, Response, NextFunction, Router } from "express";

import Controller from "../../shared/interfaces/controller.interface";
import { InternalServerError, InvalidRequestException } from "../../shared/exceptions/request.exception";
import { DataMissingException } from "../../exceptions/gallery.exception";
import { ProductService } from "../../services/product/galleryService";
import { ProductDto } from "../../dto/product/productDto";
import { plainToClass } from "class-transformer";

export class ProductController implements Controller {

  private productService;
  constructor(productService: ProductService) {
    this.productService = productService;
  }

  public defaultData = async (request: Request, response: Response, next: NextFunction) => {
    return response.status(200).json({ success: true });
  }

  public readiness = async (request: Request, response: Response, next: NextFunction) => {
    return response.status(200).json({ ready : true });
  }

  /**
   * fetch instance from product db using the productId
   * @param request
   * @param response
   * @param nextFunction
   * @returns {Object}
   */
  public getProductById = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const productId = request.params.id;

      if (!productId) {
        return next(new InvalidRequestException());
      }

      const data = await this.productService.getProductById(productId);

      if (!data) {
        return response.status(400).json({ success: false });
      }
      return response.status(200).json({ success: true, data });
    } catch (error) {
      return next(new InternalServerError());
    }
  }

  /**
   * delete instance from product db using the productId
   * @param request
   * @param response
   * @param nextFunction
   * @returns {Object}
   */
  public deleteProductById = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const productId = request.params.id;

      if (!productId) {
        return next(new InvalidRequestException());
      }

      const data = await this.productService.deleteProduct(productId);

      if (!data) {
        return response.status(400).json({ success: false });
      }
      return response.status(200).json({ success: true, data });
    } catch (error) {
      return next(new InternalServerError());
    }
  }

  /**
  * fetch all instances from product db
  * @param request
  * @param response
  * @param nextFunction
  * @returns {Object}
  */
  public getAllProducts = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const data = await this.productService.listAllProducts();

      if (!data) {
        return response.status(400).json({ success: false });
      }
      return response.status(200).json({ success: true, data });
    } catch (error) {
      return next(new InternalServerError());
    }
  }

  /**
   * create or update the existing instance of product in the product DB
   * @param request
   * @param response
   * @param next
   * @returns {Object}
   */
  public createOrUpdateProduct = async (request: Request, response: Response, next: NextFunction) => {
    try {

      const productDto: ProductDto = plainToClass(ProductDto, request.body, { enableImplicitConversion: true });

      if (!productDto.id) {
        return next(new DataMissingException());
      }

      const data = await this.productService.createOrUpdateProduct(productDto);
      if (!data) {
        return response.status(400).json({ success: false });
      }
      return response.status(200).json({ success: true, data });
    } catch (error) {
      return next(new InternalServerError());
    }
  }
}

export const createProductController = (): ProductController => {
  return new ProductController(new ProductService())
}
