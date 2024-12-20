import { medusaIntegrationTestRunner } from "@medusajs/test-utils";
import seedFunction from "../../src/scripts/test-data";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  COMPETITION_MODULE,
  CompetitionModuleService,
} from "src/modules/competitions";

medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    let query;
    let context;
    let geoguesserService: CompetitionModuleService;

    //seed before all tests
    beforeAll(async () => {
      await seedFunction({
        container: getContainer(),
        args: [],
      });

      query = getContainer().resolve(ContainerRegistrationKeys.QUERY);
      geoguesserService = getContainer().resolve(COMPETITION_MODULE);
      geoguesserService;
    });

    //cleanup after each test
    afterEach(async () => {
      await geoguesserService.deleteGeoguesserImages(["*"]);
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

        //get product variants, images & authenticate the user before all tests
        beforeAll(async () => {
          const { data: variants } = await query.graph({
            entity: "product_variant",
            fields: ["*"],
          });
          productVariant = variants[0];
          ({ id: productVariantId, product_id } = productVariant);

          const { data: product } = await query.graph({
            entity: "product",
            fields: ["images.*"],
            filters: {
              id: product_id,
            },
          });
          image = product[0].images[0];
          ({ id: imageId } = image);

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

        it("200: Returns correct geoguesser_image object for a valid product variant, image & map coordinates", async () => {
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

        it("400: Returns bad request for malformed map coordinates", async () => {
          try {
            const requestBody = {
              image_id: imageId,
              map_coordinates: "55.41565370130057, notcoords",
            };

            const response = await api.post(
              `/admin/geoguesser/product-variants/${productVariantId}`,
              requestBody,
              authenticated
            );
          } catch (error) {
            expect(error.response.status).toEqual(400);
            expect(error.response.data.message).toEqual(
              "Invalid map coordinates format"
            );
          }
        });

        it("400: Returns bad request (zod error) for missing request body properties", async () => {
          try {
            const requestBody = {
              // Missing image_id
              map_coordinates: "55.41565370130057, -1.7079462411391673",
            };

            const response = await api.post(
              `/admin/geoguesser/product-variants/${productVariantId}`,
              requestBody,
              authenticated
            );
          } catch (error) {
            expect(error.response.status).toEqual(400);
            expect(error.response.data.message).toEqual("Validation failed");
          }
        });

        it("401: Returns unauthorized for missing authentication header", async () => {
          try {
            const requestBody = {
              image_id: imageId,
              map_coordinates: "55.41565370130057, -1.7079462411391673",
            };

            const response = await api.post(
              `/admin/geoguesser/product-variants/${productVariantId}`,
              requestBody
              // No authentication header
            );
          } catch (error) {
            expect(error.response.status).toEqual(401);
          }
        });

        it("404: Returns not found for an invalid product variant", async () => {
          try {
            const requestBody = {
              image_id: imageId,
              map_coordinates: "55.41565370130057, -1.7079462411391673",
            };

            const response = await api.post(
              `/admin/geoguesser/product-variants/invalid_variant_id`,
              requestBody,
              authenticated
            );
          } catch (error) {
            expect(error.response.status).toEqual(404);
            expect(error.response.data.message).toEqual(
              "Product variant not found"
            );
          }
        });

        it("404: Returns not found for an invalid image", async () => {
          try {
            const requestBody = {
              image_id: "invalid_image_id",
              map_coordinates: "55.41565370130057, -1.7079462411391673",
            };
            console.log("⚡ ~ productVariantId:", productVariantId);

            const response = await api.post(
              `/admin/geoguesser/product-variants/${productVariantId}`,
              requestBody,
              authenticated
            );
          } catch (error) {
            expect(error.response.status).toEqual(404);
            expect(error.response.data.message).toEqual("Image not found");
          }
        });
      });
    });
  },
});

jest.setTimeout(60 * 1000);
