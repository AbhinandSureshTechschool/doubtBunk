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

jest.mock('../../models/Answer', () => ({
  __esModule: true,
  default: {
    countDocuments: jest.fn(),
  },
}));

import Answer from "../../models/Answer";
import { GET } from "../../api/answers/count/[id]/route";

describe("Answers Count /[id] API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns count successfully", async () => {
    Answer.countDocuments.mockResolvedValue(5);

    const res = await GET({}, { params: { id: "doubt123" } });
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.message).toBe("Count get successful");
    expect(data.count).toBe(5);

    expect(Answer.countDocuments).toHaveBeenCalledWith({ doubt: "doubt123" });
  });

  test("returns 500 if server error occurs", async () => {
    Answer.countDocuments.mockRejectedValue(new Error("DB error"));

    const res = await GET({}, { params: { id: "doubt123" } });
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.message).toBe("Server error");
  });
});
