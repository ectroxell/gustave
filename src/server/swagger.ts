import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gustave API',
      version: '1.0.0',
      description:
        'API for Gustave, a Zelda-themed warehouse receiving application. '
        + 'Track purchase orders, receive items, and manage warehouse locations '
        + 'with characters and items from The Legend of Zelda.',
    },
    servers: [
      {
        url: 'http://localhost:3030',
        description: 'Development server (via Vite proxy)',
      },
      {
        url: 'http://localhost:3031',
        description: 'API server (direct)',
      },
    ],
  },
  apis: ['./src/server/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
