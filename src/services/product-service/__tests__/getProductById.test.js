import { getProductById } from "../functions/get-product-by-id/handler";
import { products } from "../mocks/productsData";

describe("single product tests", () => {
  let event;
  let response;
  let product;

  beforeEach(async () => {
    event = {
      pathParameters: {
        productId: products[Math.floor(Math.random() * products.length)].id,
      },
    };

    response = await getProductById(event);
    product = JSON.parse(response.body);
  });

  it("should return single product", () => {
    expect(product).not.toBeInstanceOf(Array);
    expect(product).toBeInstanceOf(Object);
  });

  it("should return product with given UUID", () => {
    expect(product.id).toEqual(event.pathParameters.productId);
  });

  it("should include description, id, price and title properties", () => {
    let productKeys = ["description", "id", "price", "title"];

    expect(Object.keys(product).length).toEqual(4);
    productKeys.map((key) => {
      expect(product).toHaveProperty(key);
    });
  });

  it("properties should have truthy values", () => {
    Object.keys(product).map((key) => {
      expect(product[key]).toBeTruthy();
    });
  });

  it("should return error if UUID not provided", async () => {
    event.pathParameters.productId = null;
    response = await getProductById(event);
    product = response.body && JSON.parse(response.body);

    expect(product).toBeFalsy();
  });

  it("should return error if incorrect UUID provided", async () => {
    event.pathParameters.productId = "falseUUID";
    response = await getProductById(event);
    product = response.body && JSON.parse(response.body);

    expect(product).toBeFalsy();
  });
});
