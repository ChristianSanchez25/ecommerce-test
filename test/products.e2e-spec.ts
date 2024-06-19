import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/application/services/auth.service';
import {
  CreateProductDto,
  UpdateProductDto,
} from '../src/products/application/dtos';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let token: string;
  let productId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    authService = app.get(AuthService);
    const user = {
      email: 'johndoe@google.com',
      password: 'Password123.',
    };

    token = (
      await authService.login({
        email: user.email,
        password: user.password,
      })
    ).token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/products (POST)', async () => {
    const createProductDto: CreateProductDto = {
      name: 'Test Product',
      productCode: 'TP001',
      price: 100,
      quantity: 10,
      description: 'This is a test product',
    };

    const response = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send(createProductDto)
      .expect(201);

    productId = response.body.id;

    expect(response.body).toMatchObject({
      name: createProductDto.name,
      productCode: createProductDto.productCode,
      price: createProductDto.price,
      quantity: createProductDto.quantity,
      description: createProductDto.description,
    });
  });

  it('/products (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('products');
    expect(response.body.products.length).toBeGreaterThan(0);
  });

  it('/products/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', productId);
  });

  it('/products/:id (PATCH)', async () => {
    const updateProductDto: UpdateProductDto = {
      name: 'Updated Test Product',
      price: 150,
    };

    const response = await request(app.getHttpServer())
      .patch(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateProductDto)
      .expect(200);

    expect(response.body).toMatchObject({
      name: updateProductDto.name,
      price: updateProductDto.price,
    });
  });

  it('/products/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
