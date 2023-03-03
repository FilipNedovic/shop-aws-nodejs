import { products } from "../mocks/productsData";

class ProductService {
  async getProductsList() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(products), 1000);
    });
  }

  async getProductById(productId) {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(products.find(({ id }) => id === productId)),
        150
      );
    });
  }
}

export const productService = new ProductService();
