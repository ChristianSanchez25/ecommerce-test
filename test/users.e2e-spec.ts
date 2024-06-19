import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/application/services/auth.service';
import { UpdateProfileDto } from '../src/users/application/dtos';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let adminToken: string;
  let userToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    authService = app.get(AuthService);

    // Create admin user and get token
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

    // Create regular user and get token
    const regularUser = {
      email: 'test@test.com',
      password: '123Password.',
    };

    userToken = (
      await authService.login({
        email: regularUser.email,
        password: regularUser.password,
      })
    ).token;

    userId = '1';
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users/:id (GET)', async () => {
    await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(400);
  });

  it('/users (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('users');
    expect(response.body.users.length).toBeGreaterThan(0);
  });

  it('/users/profile/info-user (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users/profile/info-user')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('email', 'test@test.com');
  });

  it('/users/profile (PATCH)', async () => {
    const updateProfileDto: UpdateProfileDto = {
      firstName: 'Updated',
      lastName: 'User',
      avatar: 'https://example.com/avatar.png',
    };

    const response = await request(app.getHttpServer())
      .patch('/users/profile')
      .set('Authorization', `Bearer ${userToken}`)
      .send(updateProfileDto)
      .expect(200);

    expect(response.body).toMatchObject({
      profile: {
        firstName: updateProfileDto.firstName,
        lastName: updateProfileDto.lastName,
        avatar: updateProfileDto.avatar,
      },
    });
  });
});
