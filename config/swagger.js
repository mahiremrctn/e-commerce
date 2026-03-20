const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: 'Bahçe Malzemeleri E-Ticaret API Dokümantasyonu',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    // DÜZELTME: components artık definition içinde!
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    // Sayfanın en üstünde genel Authorize butonu çıksın diye:
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;