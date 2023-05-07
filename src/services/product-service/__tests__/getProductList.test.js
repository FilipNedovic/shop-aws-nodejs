import { getProductList } from "../functions/get-product-by-id/handler";

describe("product list tests", () => {
  let response;
  let products;

  beforeAll(async () => {
    response = await getProductList();
    products = JSON.parse(response.body);
  });

  it("should return array of products", () => {
    expect(products).toBeInstanceOf(Array);
  });

  it("products array should not be empty", () => {
    expect(products.length).toBeGreaterThan(0);
  });

  it("product should be an object", () => {
    products.map((product) => expect(product).toBeInstanceOf(Object));
  });

  it("should include description, id, price and title properties", () => {
    const productKeys = ["description", "id", "price", "title"];

    products.map((product) => {
      expect(Object.keys(product).length).toEqual(4);

      productKeys.map((key) => {
        expect(product).toHaveProperty(key);
      });
    });
  });

  it("properties should have truthy values", () => {
    products.map((product) => {
      Object.keys(product).map((key) => {
        expect(product[key]).toBeTruthy();
      });
    });
  });
});
