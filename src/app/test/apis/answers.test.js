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
    create: jest.fn(),
  },
}));

jest.mock('mongoose', () => ({
  Types: {
    ObjectId: jest.fn((id) => id),
  },
}));

import Answer from "../../models/Answer";
import { POST } from "../../api/answers/route";

const mockRequest = (body) => ({
  json: jest.fn().mockResolvedValue(body),
});

describe("Answers API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 400 if text or doubtId missing", async () => {
    const req = mockRequest({
      text: "",
      doubtId: "",
      userId: "user123",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.message).toBe("Text and doubtId are required");
  });

  test("adds answer successfully", async () => {
    const mockAnswer = {
      _id: "1",
      text: "This is an answer",
    };

    Answer.create.mockResolvedValue(mockAnswer);

    const req = mockRequest({
      text: "This is an answer",
      videoUrl: "video.mp4",
      doubtId: "doubt123",
      userId: "user123",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.message).toBe("Solution added successful");
    expect(data.answer).toEqual(mockAnswer);

    expect(Answer.create).toHaveBeenCalledWith({
      text: "This is an answer",
      doubt: "doubt123",
      videoUrl: "video.mp4",
      user: "user123",
    });
  });

  test("returns 500 if server error occurs", async () => {
    Answer.create.mockRejectedValue(new Error("DB error"));

    const req = mockRequest({
      text: "Answer",
      doubtId: "doubt123",
      userId: "user123",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.message).toBe("Server error");
  });
});
