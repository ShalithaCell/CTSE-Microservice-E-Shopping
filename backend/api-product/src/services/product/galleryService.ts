import { ProductManagerRepository } from "../../dal/product/productManagerRepository";
import { ProductDto } from "../../dto/product/productDto";

export class ProductService {
  private productRepo: ProductManagerRepository;

  constructor() {
    this.productRepo = new ProductManagerRepository();
  }

  public createOrUpdateProduct = async (productDto: ProductDto): Promise<any> => {
    return await this.productRepo.createOrUpdateProduct(productDto);
  }

  public listAllProducts = async (): Promise<any> => {
    return await this.productRepo.listAllProducts();
  }

  public getProductById = async (productId: string): Promise<ProductDto> => {
    return await this.productRepo.getProductById(productId);
  }

  public deleteProduct = async (productId: string): Promise<ProductDto> => {
    return await this.productRepo.deleteProduct(productId);
  }
}
