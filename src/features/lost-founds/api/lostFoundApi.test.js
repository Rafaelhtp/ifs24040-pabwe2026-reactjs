import { describe, it, expect, vi, beforeEach } from "vitest";
import lostFoundApi, {
  getLostFounds,
  getLostFoundById,
  createLostFound,
  updateLostFound,
  uploadCover,
  deleteLostFound,
  getDailyStats,
  getMonthlyStats,
  fetchLostFounds,
  fetchLostFound,
  postLostFound,
  putLostFound,
  postLostFoundCover,
  removeLostFound,
  fetchStatsDaily,
  fetchStatsMonthly,
} from "./lostFoundApi";
import apiHelper from "../../../helpers/apiHelper";

function mockFetch(result = { status: "success" }) {
  return vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
    json: async () => result,
  });
}

describe("lostFoundApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("getLostFounds", () => {
    it("should call endpoint without query string when no filter given", async () => {
      const spy = mockFetch({ data: { lost_founds: [] } });

      const result = await lostFoundApi.getLostFounds();

      expect(result).toEqual({ data: { lost_founds: [] } });
      const url = spy.mock.calls[0][0];
      expect(url.endsWith("/lost-founds")).toBe(true);
      expect(url).not.toContain("?");
    });

    it("should append status, is_completed and is_me filters", async () => {
      const spy = mockFetch();

      await lostFoundApi.getLostFounds({ status: "lost", is_completed: "1", is_me: "1" });

      const url = spy.mock.calls[0][0];
      expect(url).toContain("status=lost");
      expect(url).toContain("is_completed=1");
      expect(url).toContain("is_me=1");
    });

    it("should keep numeric zero filters and ignore empty or undefined filters", async () => {
      const spy = mockFetch();

      await lostFoundApi.getLostFounds({ status: "", is_completed: 0, is_me: undefined });

      const url = spy.mock.calls[0][0];
      expect(url).toContain("is_completed=0");
      expect(url).not.toContain("status=");
      expect(url).not.toContain("is_me=");
    });

    it("should ignore undefined is_completed and empty is_me", async () => {
      const spy = mockFetch();

      await lostFoundApi.getLostFounds({ is_completed: undefined, is_me: "" });

      expect(spy.mock.calls[0][0]).not.toContain("?");
    });
  });

  describe("getLostFoundById", () => {
    it("should request detail by id", async () => {
      const spy = mockFetch({ data: { lost_found: { id: 5 } } });

      const result = await lostFoundApi.getLostFoundById(5);

      expect(result.data.lost_found.id).toBe(5);
      expect(spy.mock.calls[0][0].endsWith("/lost-founds/5")).toBe(true);
    });
  });

  describe("createLostFound", () => {
    it("should POST title, description and status as JSON", async () => {
      const spy = mockFetch();

      await lostFoundApi.createLostFound({
        title: "Dompet",
        description: "Warna hitam",
        status: "lost",
        ignored: "x",
      });

      const [url, options] = spy.mock.calls[0];
      expect(url.endsWith("/lost-founds")).toBe(true);
      expect(options.method).toBe("POST");
      expect(options.headers).toEqual({ "Content-Type": "application/json" });
      expect(JSON.parse(options.body)).toEqual({
        title: "Dompet",
        description: "Warna hitam",
        status: "lost",
      });
    });
  });

  describe("updateLostFound", () => {
    it("should PUT data and convert is_completed true to 1", async () => {
      const spy = mockFetch();

      await lostFoundApi.updateLostFound(3, {
        title: "A",
        description: "B",
        status: "found",
        is_completed: true,
      });

      const [url, options] = spy.mock.calls[0];
      expect(url.endsWith("/lost-founds/3")).toBe(true);
      expect(options.method).toBe("PUT");
      expect(JSON.parse(options.body)).toEqual({
        title: "A",
        description: "B",
        status: "found",
        is_completed: 1,
      });
    });

    it("should convert falsy is_completed to 0", async () => {
      const spy = mockFetch();

      await lostFoundApi.updateLostFound(3, {
        title: "A",
        description: "B",
        status: "lost",
        is_completed: false,
      });

      expect(JSON.parse(spy.mock.calls[0][1].body).is_completed).toBe(0);
    });
  });

  describe("uploadCover", () => {
    it("should POST file as FormData to cover endpoint", async () => {
      const spy = mockFetch();
      const file = new File(["x"], "cover.png", { type: "image/png" });

      await lostFoundApi.uploadCover(9, file);

      const [url, options] = spy.mock.calls[0];
      expect(url.endsWith("/lost-founds/9/cover")).toBe(true);
      expect(options.method).toBe("POST");
      expect(options.body).toBeInstanceOf(FormData);
      expect(options.body.get("cover")).toBeInstanceOf(File);
    });
  });

  describe("deleteLostFound", () => {
    it("should send DELETE request", async () => {
      const spy = mockFetch();

      await lostFoundApi.deleteLostFound(4);

      const [url, options] = spy.mock.calls[0];
      expect(url.endsWith("/lost-founds/4")).toBe(true);
      expect(options.method).toBe("DELETE");
    });
  });

  describe("stats", () => {
    it("should request daily stats", async () => {
      const spy = mockFetch({ data: { total: 1 } });

      const result = await lostFoundApi.getDailyStats();

      expect(result).toEqual({ data: { total: 1 } });
      expect(spy.mock.calls[0][0].endsWith("/lost-founds/stats/daily")).toBe(true);
    });

    it("should request monthly stats", async () => {
      const spy = mockFetch({ data: { total: 2 } });

      const result = await lostFoundApi.getMonthlyStats();

      expect(result).toEqual({ data: { total: 2 } });
      expect(spy.mock.calls[0][0].endsWith("/lost-founds/stats/monthly")).toBe(true);
    });
  });

  describe("named exports and aliases", () => {
    it("should expose every method as named export and alias", () => {
      expect(getLostFounds).toBe(lostFoundApi.getLostFounds);
      expect(getLostFoundById).toBe(lostFoundApi.getLostFoundById);
      expect(createLostFound).toBe(lostFoundApi.createLostFound);
      expect(updateLostFound).toBe(lostFoundApi.updateLostFound);
      expect(uploadCover).toBe(lostFoundApi.uploadCover);
      expect(deleteLostFound).toBe(lostFoundApi.deleteLostFound);
      expect(getDailyStats).toBe(lostFoundApi.getDailyStats);
      expect(getMonthlyStats).toBe(lostFoundApi.getMonthlyStats);

      expect(fetchLostFounds).toBe(lostFoundApi.getLostFounds);
      expect(fetchLostFound).toBe(lostFoundApi.getLostFoundById);
      expect(postLostFound).toBe(lostFoundApi.createLostFound);
      expect(putLostFound).toBe(lostFoundApi.updateLostFound);
      expect(postLostFoundCover).toBe(lostFoundApi.uploadCover);
      expect(removeLostFound).toBe(lostFoundApi.deleteLostFound);
      expect(fetchStatsDaily).toBe(lostFoundApi.getDailyStats);
      expect(fetchStatsMonthly).toBe(lostFoundApi.getMonthlyStats);
    });
  });
});
