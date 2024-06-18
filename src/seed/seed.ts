import * as bcrypt from 'bcryptjs';
import { RegisterUserDto } from '../auth/application/dtos';
import { CreateProductDto } from '../products/application/dtos';

export const Users: RegisterUserDto[] = [
  {
    email: 'johndoe@google.com',
    password: bcrypt.hashSync('Password123.', 10),
    profile: {
      firstName: 'Jonh',
      lastName: 'Doe',
    },
  },
  {
    email: 'test@test.com',
    password: bcrypt.hashSync('123Password.', 10),
    profile: {
      firstName: 'Test',
      lastName: 'User',
    },
  },
  {
    email: 'test2@test.com',
    password: bcrypt.hashSync('Password123.', 10),
    profile: {
      firstName: 'Test2',
      lastName: 'User2',
    },
  },
  {
    email: 'anadoe@google.com',
    password: bcrypt.hashSync('Password123.', 10),
    profile: {
      firstName: 'Ana',
      lastName: 'Doe',
    },
  },
  {
    email: 'christian@google.com',
    password: bcrypt.hashSync('123Password.', 10),
    profile: {
      firstName: 'Christian',
      lastName: 'Doe',
    },
  },
];

export const Products: CreateProductDto[] = [
  {
    name: 'Product 1',
    productCode: 'P001',
    description: 'Description of product 1',
    price: 10,
    quantity: 10,
  },
  {
    name: 'Product 2',
    productCode: 'P002',
    description: 'Description of product 2',
    price: 20,
    quantity: 20,
  },
  {
    name: 'Product 3',
    productCode: 'P003',
    description: 'Description of product 3',
    price: 30,
    quantity: 30,
  },
  {
    name: 'Product 4',
    productCode: 'P004',
    description: 'Description of product 4',
    price: 40,
    quantity: 40,
  },
  {
    name: 'Product 5',
    productCode: 'P005',
    description: 'Description of product 5',
    price: 50,
    quantity: 50,
  },
];
