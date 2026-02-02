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
    findByIdAndUpdate: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    find: jest.fn(),
  },
}));

import Doubt from "../../models/Doubt";
import { PUT, DELETE, GET } from "../../api/doubts/[id]/route";

const mockRequest = (body = {}) => ({
  json: jest.fn().mockResolvedValue(body),
});

describe("Doubt /[id] API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("updates doubt successfully", async () => {
    Doubt.findByIdAndUpdate.mockResolvedValue({ _id: "1" });

    const req = mockRequest({
      title: "Updated title",
      description: "Updated description",
    });

    const res = await PUT(req, { params: { id: "123" } });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe("Doubt updated successful");

    expect(Doubt.findByIdAndUpdate).toHaveBeenCalledWith(
      "123",
      { title: "Updated title", description: "Updated description" },
      { new: true }
    );
  });

  test("returns 404 if doubt not found while updating", async () => {
    Doubt.findByIdAndUpdate.mockResolvedValue(null);

    const req = mockRequest({
      title: "Title",
      description: "Desc",
    });

    const res = await PUT(req, { params: { id: "123" } });
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.message).toBe("Doubt not found");
  });

  /* ---------------- DELETE ---------------- */

  test("deletes doubt successfully", async () => {
    Doubt.findById.mockResolvedValue({ _id: "123" });
    Doubt.findByIdAndDelete.mockResolvedValue(true);

    const res = await DELETE({}, { params: { id: "123" } });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe("Doubt deleted successful");

    expect(Doubt.findByIdAndDelete).toHaveBeenCalledWith("123");
  });

  test("returns 404 if doubt not found while deleting", async () => {
    Doubt.findById.mockResolvedValue(null);

    const res = await DELETE({}, { params: { id: "123" } });
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.message).toBe("Doubt not found");
  });

  /* ---------------- GET ---------------- */

  test("gets doubts by user id successfully", async () => {
    const mockDoubts = [{ title: "D1" }, { title: "D2" }];

    Doubt.find.mockResolvedValue(mockDoubts);

    const res = await GET({}, { params: { id: "user123" } });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe("Doubts (users) get successful");
    expect(data.doubts).toEqual(mockDoubts);

    expect(Doubt.find).toHaveBeenCalledWith({ user: "user123" });
  });
});
