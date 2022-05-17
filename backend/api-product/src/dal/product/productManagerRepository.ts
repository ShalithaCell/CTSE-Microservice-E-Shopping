import { ProductDto } from "../../dto/product/productDto";
import ProductSchema from "./model";

export class ProductManagerRepository {
  private model: any;

  constructor() {
    this.model = ProductSchema;
  }

  public createOrUpdateProduct = async (productDto: ProductDto) => {
    const productToBeUpdated = await this.model.findOne({ id: productDto.id });

    if (productToBeUpdated !== null) {
      const updatedProduct = await this.model.findOneAndUpdate({ id: productDto.id }, { $set: productDto }, { new: true });
      return updatedProduct;
    }

    const createdProduct = await this.model.create(productDto);
    return createdProduct;
  }

  public getProductById = async (productId: string) => {
    const data = await this.model.findOne({ id: productId });

    if (data) return data;
    return null;
  }

  public listAllProducts = async () => {
    const data = await this.model.find();

    if (data) return data;
    return [];
  }

  public deleteProduct = async (productId: string) => {
    const data = await this.model.delete({ id: productId });

    if (data) return data;
    return null;
  }
}