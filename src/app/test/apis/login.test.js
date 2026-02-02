jest.mock('next/server', () => ({
  NextResponse: {
    json: (body, init = {}) => ({
      status: init.status || 200,
      json: async () => body,
      cookies: {
        set: jest.fn(),
      },
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
    }
}));

jest.mock('bcryptjs', () => ({
    compare: jest.fn(),
}));

jest.mock('../../lib/auth', () => ({
    signToken: jest.fn(),
}));

import bcrypt from "bcryptjs";
import User from "../../models/User";
import { POST } from "../../api/auth/login/route";

const mockRequest = (body) => ({
    json: jest.fn().mockResolvedValue(body),
});


describe("POST /api/auth/login", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    test("returns 401 if user not found", async () => {
        User.findOne.mockResolvedValue(null)

        const req = mockRequest({
            email: "test@example.com",
            password: "123456"
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(401)
        expect(data.success).toBe(false)
    });

    test("returns 400 if email or password missing", async () => {
        const req = mockRequest({
            email: "",
            password: "",
        });

        const res = await POST(req);
        const data = await res.json();
      
        expect(res.status).toBe(400);
        expect(data.message).toBe("Email and Password required")
    });

    
    test("returns 400 if validation fails", async () => {
        const req = mockRequest({
            email: "invalid-email",
            password: "123",
        });
       
        const res = await POST(req);
        const data = await res.json();
        
        expect(res.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.message).toBe('Invalid email');

    });

    test("returns 401 if password is worng", async () => {
        User.findOne.mockResolvedValue({
            _id: "1",
            email: "test@example.com",
            password: "hashed",
            name: "Test",
        });

        bcrypt.compare.mockResolvedValue(false);

        const req = mockRequest({
            email: "test@example.com",
            password: "wrongpass",
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(401);
        expect(data.message).toBe("Invalid credentials")
    });

    test("logs in successfully", async () => {
        User.findOne.mockResolvedValue({
            _id: "1",
            email: "test@example.com",
            password: "hashed",
            name: "Test User",
        });

        bcrypt.compare.mockResolvedValue(true);

        const req = mockRequest({
            email: "test@example.com",
            password: "123456",
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.message).toBe("login successful");
        expect(res.cookies.set).toHaveBeenCalled();
    });
});