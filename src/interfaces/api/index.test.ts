import request from 'supertest';
import { FastfoodApp } from './index';
import { ProductsController } from '../controllers/products';
import { ProductsImagesController } from '../controllers/productsImages';
import { CustomersController } from '../controllers/customers';
import { OrdersController } from '../controllers/orders';

jest.mock('../controllers/products');
jest.mock('../controllers/productsImages');
jest.mock('../controllers/customers');
jest.mock('../controllers/orders');

describe('FastfoodApp', () => {
  let fastfoodApp: FastfoodApp;
  let mockDbConnection: any;

  beforeAll(() => {
    mockDbConnection = {};
    process.env.PORT = '9010';
    fastfoodApp = new FastfoodApp(mockDbConnection);
    fastfoodApp.start();
  });

  afterAll(() => {
    fastfoodApp.stop();
  });

  describe('Configuração da Aplicação', () => {
    it('deve configurar a aplicação corretamente', () => {
      expect(fastfoodApp).toBeInstanceOf(FastfoodApp);
    });

    it('deve configurar os middlewares corretamente', () => {
    });
  });

  describe('Endpoints', () => {
    it('deve fornecer a especificação Swagger em /swagger.json', async () => {
      const response = await request(fastfoodApp._app).get('/swagger.json');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve fornecer a documentação Swagger em /api-docs', async () => {
      const response = await request(fastfoodApp._app).get('/api-docs');
      expect(response.headers['content-type']).toContain('text/html; charset=UTF-8');
    });

    it('deve responder corretamente ao endpoint /products', async () => {
      const mockProductionData = '[]';
      (ProductsController.getProducts as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).get('/products');
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /products/:id', async () => {
      const mockProductionData = '[]';
      (ProductsController.getProductsById as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).get('/products/1');
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /products ( post )', async () => {
      const mockProductionData = '[]';
      (ProductsController.setProduct as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).post('/products');
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /products/:id ( put )', async () => {
      const mockProductionData = '[]';
      (ProductsController.updateProduct as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).put('/products/1');
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /products/:id ( delete )', async () => {
      const mockProductionData = '[]';
      (ProductsController.removeProductsById as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).delete('/products/1');
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /products/:id/images', async () => {
      const mockProductionData = '[]';
      (ProductsImagesController.getProductsImagesByProductId as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).get('/products/1/images');
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /products/:id/images (post)', async () => {
      const mockProductionData = '[]';
      (ProductsImagesController.setProductImage as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).post('/products/1/images');
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /products/:id/images/:imageId', async () => {
      const mockProductionData = '[]';
      (ProductsImagesController.getProductsImagesByProductId as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).get('/products/1/images/2');
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /products/:id/images/:imageId ( put) ', async () => {
      const mockProductionData = '[]';
      (ProductsImagesController.updateProductImage as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).put('/products/:id/images/:imageId2');
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /products/:id/images/:imageId ( delete) ', async () => {
      const mockProductionData = '[]';
      (ProductsImagesController.removeProductsImagesById as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).delete('/products/:id/images/:imageId2');
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /customers', async () => {
      const mockProductionData = '[]';
      (CustomersController.getCustomers as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).get('/customers');
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /customers/:id', async () => {
      const mockProductionData = '[]';
      (CustomersController.getCustomersById as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).get('/customers/:id');
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /customers ( post )', async () => {
      const mockProductionData = '[]';
      (CustomersController.setCustomer as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).post('/customers');
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /customers/:id ( put )', async () => {
      const mockProductionData = '[]';
      (CustomersController.updateCustomer as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).put('/customers/:id');
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /customers/:id ( delete )', async () => {
      const mockProductionData = '[]';
      (CustomersController.removeCustomersById as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).delete('/customers/:id');
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /orders ( post )', async () => {
      const mockProductionData = '[]';
      (OrdersController.setOrder as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).post('/orders');
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /orders/open', async () => {
      const mockProductionData = '[]';
      (OrdersController.getOrdersByOpen as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).get('/orders/open');
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /orders/status/:status', async () => {
      const mockProductionData = '[]';
      (OrdersController.getOrdersByStatus as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).get('/orders/status/DONE');
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /orders/:id (put)', async () => {
      const mockProductionData = '[]';
      (OrdersController.updateOrder as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).put('/orders/1');
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /orders/:id/payment (put)', async () => {
      const mockProductionData = '[]';
      (OrdersController.updatePaymentOrder as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).put('/orders/1/payment');
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /orders/:id', async () => {
      const mockProductionData = '[]';
      (OrdersController.getOrdersById as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).get('/orders/:id');
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /orders/:id (delete)', async () => {
      const mockProductionData = '[]';
      (OrdersController.removeOrdersById as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).delete('/orders/:id');
      expect(response.headers['content-type']).toContain('application/json');
    });
  });
});
