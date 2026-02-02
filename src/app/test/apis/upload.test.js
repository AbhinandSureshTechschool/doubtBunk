jest.mock('next/server', () => ({
  NextResponse: {
    json: (body, init = {}) => ({
      status: init.status || 200,
      json: async () => body,
    }),
  },
}));

jest.mock('../../lib/cloudinary', () => ({
  uploader: {
    upload_stream: jest.fn(),
  },
}));

import cloudinary from "../../lib/cloudinary";
import { POST } from "../../api/upload/route";

const mockFile = () => ({
  arrayBuffer: jest.fn().mockResolvedValue(
    new Uint8Array([1, 2, 3]).buffer
  ),
});

const mockRequest = () => ({
  formData: jest.fn().mockResolvedValue({
    get: jest.fn().mockReturnValue(mockFile()),
  }),
});

describe("Upload API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("uploads file successfully", async () => {
    cloudinary.uploader.upload_stream.mockImplementation(
      (options, callback) => {
        return {
          end: () => {
            callback(null, { secure_url: "https://cloudinary.com/video.mp4" });
          },
        };
      }
    );

    const req = mockRequest();

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.url).toBe("https://cloudinary.com/video.mp4");

    expect(cloudinary.uploader.upload_stream).toHaveBeenCalled();
  });

  test("returns 500 if upload fails", async () => {
    cloudinary.uploader.upload_stream.mockImplementation(
      (options, callback) => {
        return {
          end: () => {
            callback(new Error("Upload failed"));
          },
        };
      }
    );

    const req = mockRequest();

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.message).toBe("Upload failed");
  });
});
