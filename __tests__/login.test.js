import { POST } from '@/app/api/auth/login/route';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { connectDB } from '@/lib/dbConnect';
import { generateToken } from '@/lib/auth';

jest.mock('@/lib/dbConnect');
jest.mock('@/models/User');
jest.mock('bcryptjs');
jest.mock('@/lib/auth');
jest.mock('next/server');

describe('Login API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log in a user with correct credentials', async () => {
    const mockUser = {
      _id: '123',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'employee',
    };
    const req = {
      json: jest.fn().mockResolvedValue({ email: 'test@example.com', password: 'password123' }),
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    generateToken.mockResolvedValue('testtoken');
    const response = {
        cookies: {
            set: jest.fn(),
        },
    };
    NextResponse.json.mockReturnValue(response);

    await POST(req);

    expect(connectDB).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
    expect(generateToken).toHaveBeenCalledWith(mockUser);
    expect(NextResponse.json).toHaveBeenCalledWith({
      message: 'Login successful',
      user: { id: '123', email: 'test@example.com', role: 'employee' },
    });
    expect(response.cookies.set).toHaveBeenCalled();
  });

  it('should return 401 for incorrect password', async () => {
    const mockUser = {
      _id: '123',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'employee',
    };
    const req = {
      json: jest.fn().mockResolvedValue({ email: 'test@example.com', password: 'wrongpassword' }),
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Invalid credentials' }, { status: 401 });
  });

  it('should return 404 for non-existent user', async () => {
    const req = {
      json: jest.fn().mockResolvedValue({ email: 'nouser@example.com', password: 'password123' }),
    };

    User.findOne.mockResolvedValue(null);

    await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'User not found' }, { status: 404 });
  });
});
