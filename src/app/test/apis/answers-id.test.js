jest.mock('next/server', () => ({
  NextResponse: {
    json: (body, init = {}) => ({
      status: init.status || 200,
      json: async () => body,
    }),
  },
}));

jest.mock('../../models/Answer', () => ({
  __esModule: true,
  default: {
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    find: jest.fn(),
  },
}));

jest.mock('../../models/Doubt', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
  },
}));

import Answer from "../../models/Answer";
import Doubt from "../../models/Doubt";
import { PUT, DELETE, GET } from "../../api/answers/[id]/route";

const mockRequest = (body = {}) => ({
  json: jest.fn().mockResolvedValue(body),
});

describe("Answers /[id] API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* ---------------- PUT ---------------- */

  test("updates answer successfully", async () => {
    Answer.findByIdAndUpdate.mockResolvedValue({ _id: "1" });

    const req = mockRequest({
      text: "Updated answer",
      videoUrl: "video.mp4",
    });

    const res = await PUT(req, { params: { id: "123" } });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe("updated answer successful");

    expect(Answer.findByIdAndUpdate).toHaveBeenCalledWith(
      "123",
      { text: "Updated answer", videoUrl: "video.mp4" }
    );
  });

  test("returns 404 if answer not found", async () => {
    Answer.findByIdAndUpdate.mockResolvedValue(null);

    const req = mockRequest({
      text: "Text",
      videoUrl: "",
    });

    const res = await PUT(req, { params: { id: "123" } });
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.message).toBe("Answer not found");
  });

  /* ---------------- DELETE ---------------- */

  test("deletes answer successfully", async () => {
    Answer.findByIdAndDelete.mockResolvedValue(true);

    const res = await DELETE({}, { params: { id: "123" } });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe("Answer deleted successful");

    expect(Answer.findByIdAndDelete).toHaveBeenCalledWith("123");
  });

  test("gets answers by doubt id successfully", async () => {
    const mockAnswers = [{ text: "A1" }, { text: "A2" }];
    const mockDoubt = [{ title: "Test Doubt" }];

    Doubt.find.mockResolvedValue(mockDoubt);
    Answer.find.mockResolvedValue(mockAnswers);

    const res = await GET({}, { params: { id: "doubt123" } });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe("Answers get successful");
    expect(data.answers).toEqual(mockAnswers);
    expect(data.doubt).toEqual(mockDoubt);

    expect(Doubt.find).toHaveBeenCalledWith({ _id: "doubt123" });
    expect(Answer.find).toHaveBeenCalledWith({ doubt: "doubt123" });
  });

  test("returns 500 if fetching answers fails", async () => {
    Answer.find.mockRejectedValue(new Error("DB error"));

    const res = await GET({}, { params: { id: "doubt123" } });
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.message).toBe("Server error");
  });
});
