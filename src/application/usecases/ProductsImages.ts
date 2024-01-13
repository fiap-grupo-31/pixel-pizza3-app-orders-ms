/* eslint-disable prefer-promise-reject-errors */
import { ProductsImages } from '../../domain/entities/ProductsImages';
import { type ProductsGatewayInterface } from '../../domain/interfaces/ProductsGatewayInterface';
import { type ProductsImagesGatewayInterface } from '../../domain/interfaces/ProductsImagesGatewayInterface';

class ProductsImagesUseCases {
  static async getProductsImagesAll (
    ProductsImagesGateway: ProductsImagesGatewayInterface
  ): Promise<ProductsImages[] | null> {
    const allProductsImages = await ProductsImagesGateway.findAll();
    return allProductsImages;
  }

  static async getProductsImagesByProductId (
    reference: Record<string, any> = {},
    ProductsImagesGateway: ProductsImagesGatewayInterface
  ): Promise<ProductsImages[] | null> {
    const allProductsImages = await ProductsImagesGateway.find(reference);
    return allProductsImages;
  }

  static async getProductsImagesById (
    id: string,
    ProductsImagesGateway: ProductsImagesGatewayInterface
  ): Promise<ProductsImages | null> {
    const productsImages = await ProductsImagesGateway.findId(id);
    return productsImages;
  }

  static async setProductImage (
    productId: string,
    name: string,
    size: string,
    type: string,
    base64: string,
    ProductsImagesGateway: ProductsImagesGatewayInterface,
    ProductsGateway: ProductsGatewayInterface
  ): Promise<ProductsImages | null> {
    if (!productId) {
      throw new Error('id product inválid');
    }
    if (productId.length !== 24) {
      throw new Error('id product inválid');
    }
    if (!name) {
      throw new Error('name inválid');
    }
    if (!size) {
      throw new Error('size inválid');
    }
    if (!type) {
      throw new Error('type inválid');
    }
    if (!base64) {
      throw new Error('base64 inválid');
    }

    try {
      // objectIdIsValid
      if (!await ProductsImagesGateway.isValidId(productId)) {
        throw new Error('id product inválid');
      }

      const product = await ProductsGateway.findId(productId);
      if (!product) {
        throw new Error('productId inexistent');
      }

      const productImage = await ProductsImagesGateway.persist(
        productId,
        name,
        size,
        type,
        base64
      );
      return new ProductsImages(
        productImage._id,
        productImage.productId,
        productImage.name,
        productImage.size,
        productImage.type,
        productImage.base64,
        productImage.created_at,
        productImage.updated_at
      );
    } catch (error) {
      throw new Error('failure insert');
    }
  }

  static async updateProductImage (
    id: string,
    productId: string,
    name: string,
    size: string,
    type: string,
    base64: string,
    ProductsImagesGateway: ProductsImagesGatewayInterface
  ): Promise<ProductsImages | null> {
    if (!id) {
      throw new Error('id image inválid');
    }
    if (id.length !== 24) {
      throw new Error('id image inválid');
    }
    if (!productId) {
      throw new Error('id product inválid');
    }
    if (productId.length !== 24) {
      throw new Error('id product inválid');
    }
    if (!name) {
      throw new Error('name inválid');
    }
    if (!size) {
      throw new Error('size inválid');
    }
    if (!type) {
      throw new Error('type inválid');
    }
    if (!base64) {
      throw new Error('base64 inválid');
    }

    // objectIdIsValid
    if (!await ProductsImagesGateway.isValidId(id)) {
      throw new Error('id image inválid');
    }
    if (!await ProductsImagesGateway.isValidId(productId)) {
      throw new Error('id product inválid');
    }

    const product = await ProductsImagesGateway.find({
      _id: id,
      productId
    });

    if (!product) {
      throw new Error('product image inexistent');
    }
    if (!product?.length) {
      throw new Error('product image inexistent');
    }

    try {
      const productImage = await ProductsImagesGateway.update(
        id,
        name,
        size,
        type,
        base64
      );
      return new ProductsImages(
        productImage._id,
        productImage.productId,
        productImage.name,
        productImage.size,
        productImage.type,
        productImage.base64,
        productImage.created_at,
        productImage.updated_at
      );
    } catch (error) {
      throw new Error('failure update');
    }
  }

  static async removeProductsImagesById (
    id: string,
    ProductsImagesGateway: ProductsImagesGatewayInterface
  ): Promise<any> {
    try {
      await ProductsImagesGateway.remove(id);
      return await Promise.resolve('removed');
    } catch (error) {
      throw new Error('id inexistent');
    }
  }
}

export { ProductsImagesUseCases };
