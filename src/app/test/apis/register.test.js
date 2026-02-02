jest.mock('next/server', () => ({
  NextResponse: {
    json: (body, init = {}) => ({
      status: init.status || 200,
      json: async () => body,
    }),
  },
}));

jest.mock('../../lib/db', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(true),
}));

jest.mock('../../models/User', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

import bcrypt from "bcryptjs";
import User from "../../models/User";
import { POST } from "../../api/auth/register/route";

const mockRequest = (body) => ({
  json: jest.fn().mockResolvedValue(body),
});

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 400 if validation fails", async () => {
    const req = mockRequest({
      name: "",
      email: "invalid-email",
      password: "123",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
  });

  test("returns 400 if email already exists", async () => {
    User.findOne.mockResolvedValue({
      _id: "1",
      email: "test@example.com",
    });

    const req = mockRequest({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.message).toBe("Email already registered");
  });

  test("registers user successfully", async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed-password");
    User.create.mockResolvedValue(true);

    const req = mockRequest({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.message).toBe("User registered successfully");

    expect(User.create).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@example.com",
      password: "hashed-password",
    });
  });
});
