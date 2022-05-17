import { IsString, IsNumber } from "class-validator";
import { Expose } from "class-transformer";

export class ProductDto {
  @Expose()
  @IsString()
  public id: string;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsNumber()
  public quantity: number;

  @Expose()
  @IsNumber()
  public price: number;

  @Expose()
  @IsString()
  public storedLocation: string;
}