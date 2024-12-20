import { medusaIntegrationTestRunner } from "@medusajs/test-utils";
import seedFunction from "../../src/scripts/test-data";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    let query;
    let context;

    beforeAll(async () => {
      await seedFunction({
        container: getContainer(),
        args: [],
      });

      query = getContainer().resolve(ContainerRegistrationKeys.QUERY);
    });

    describe("/admin/geoguesser/:productVariant", () => {
      describe("POST /admin/geoguesser/:productVariant", () => {
        let productVariantId;
        let productVariant;
        let id;
        let product_id;
        let product;
        let images;
        let image;
        let imageId;
        let authenticated;

        beforeAll(async () => {
          //fetch product variants
          const { data: variants } = await query.graph({
            entity: "product_variant",
            fields: ["*"],
          });
          productVariant = variants[0];
          ({ id: productVariantId, product_id } = productVariant);

          //fetch images for the product (linked to the variant)
          const { data: product } = await query.graph({
            entity: "product",
            fields: ["images.*"],
            filters: {
              id: product_id,
            },
          });
          image = product[0].images[0];
          ({ id: imageId } = image);

          //login the user
          const loginResponse = await api.post(`/auth/user/emailpass`, {
            email: "admin@test.com",
            password: "admin123",
          });
          const token = loginResponse.data.token;
          authenticated = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        });

        it.only("200: Returns correct geoguesser_image object for a valid product variant, image & map coordinates", async () => {
          const requestBody = {
            image_id: imageId,
            map_coordinates: "55.41565370130057, -1.7079462411391673",
          };

          const response = await api.post(
            `/admin/geoguesser/product-variants/${productVariantId}`,
            requestBody,
            authenticated
          );

          expect(response.status).toEqual(200);
          expect(response.data).toHaveProperty("geoguesser_image");
          expect(response.data.geoguesser_image).toMatchObject({
            id: expect.stringMatching(/^geogimg_/),
            image_id: imageId,
            product_variant_id: productVariantId,
            map_coordinates: requestBody.map_coordinates,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
          });
        });
        it("400: Returns bad request for malformed map coordinates", async () => {});
        it("400: Returns bad request for missing image or map coordinate properties", async () => {});
        it("403: Returns unauthorized for missing authentication header", async () => {});
        it("404: Returns not found for an invalid product variant", async () => {});
        it("404: Returns not found for an invalid image", async () => {});
      });
    });
  },
});

jest.setTimeout(60 * 1000);
