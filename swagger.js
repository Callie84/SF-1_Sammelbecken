const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "SF-1 API Documentation",
    version: "1.0.0",
    description: "Swagger UI für SF-1 Grower-App API",
  },
  servers: [{ url: "http://localhost:3000/api" }],
};

const options = {
  swaggerDefinition,
  apis: ["./API/src/routes/*.js", "./API/controllers/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
