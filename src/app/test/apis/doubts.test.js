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

jest.mock('../../models/Doubt', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    find: jest.fn(),
  },
}));

jest.mock('mongoose', () => ({
  Types: {
    ObjectId: jest.fn((id) => id),
  },
}));

import Doubt from "../../models/Doubt";
import { POST, GET } from "../../api/doubts/route";

const mockRequest = (body) => ({
  json: jest.fn().mockResolvedValue(body),
});

describe("Doubts API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* ---------------- POST ---------------- */

  test("adds a doubt successfully", async () => {
    Doubt.create.mockResolvedValue(true);

    const req = mockRequest({
      title: "Test Doubt",
      description: "This is a doubt",
      user: "696f04f7530d9ebf65d2047e",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.message).toBe("Doubt added successful");

    expect(Doubt.create).toHaveBeenCalledWith({
      title: "Test Doubt",
      description: "This is a doubt",
      user: expect.anything(),
    });
  });

  test("returns 500 if error occurs while adding doubt", async () => {
    Doubt.create.mockRejectedValue(new Error("DB error"));

    const req = mockRequest({
      title: "Test",
      description: "Desc",
      user: "696f04f7530d9ebf65d2047e",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.message).toBe("Server error");
  });

  /* ---------------- GET ---------------- */

  test("fetches doubts successfully", async () => {
    const mockDoubts = [
      { title: "Doubt 1" },
      { title: "Doubt 2" },
    ];

    Doubt.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockDoubts),
    });

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe("Doubts get successful");
    expect(data.doubts).toEqual(mockDoubts);
  });

  test("returns 500 if fetching doubts fails", async () => {
    Doubt.find.mockImplementation(() => {
      throw new Error("DB error");
    });

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.message).toBe("Failed to fetch doubts");
  });
});
