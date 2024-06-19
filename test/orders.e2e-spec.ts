import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/application/services/auth.service';
import {
  ChangeOrderStatusDto,
  CreateOrderDto,
} from '../src/orders/application/dtos';
import { OrderStatus } from '../src/orders/domain/enums';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let adminToken: string;
  let orderId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    authService = app.get(AuthService);

    // Register and login user
    const adminUser = {
      email: 'johndoe@google.com',
      password: 'Password123.',
    };

    adminToken = (
      await authService.login({
        email: adminUser.email,
        password: adminUser.password,
      })
    ).token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/orders (POST)', async () => {
    const createOrderDto: CreateOrderDto = {
      items: [
        {
          productId: '6671c7b2098e1be02662778d',
          quantity: 2,
          price: 50,
        },
      ],
    };

    await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createOrderDto)
      .expect(201);
  });

  it('/orders (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/orders')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.orders.length).toBeGreaterThan(0);
  });

  it('/orders/me (GET)', async () => {
    await request(app.getHttpServer())
      .get('/orders/me')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('/orders/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', orderId);
  });

  it('/orders/:id (PATCH)', async () => {
    const changeOrderStatusDto: ChangeOrderStatusDto = {
      status: OrderStatus.COMPLETED,
    };

    const response = await request(app.getHttpServer())
      .patch(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(changeOrderStatusDto)
      .expect(200);

    expect(response.body).toMatchObject({
      id: orderId,
      status: changeOrderStatusDto.status,
    });
  });
});
