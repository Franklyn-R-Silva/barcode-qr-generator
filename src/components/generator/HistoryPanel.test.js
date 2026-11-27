import { persistHistory } from "./HistoryPanel";

test("drops the oldest entries until the history fits in storage", () => {
  const saved = {};
  const storage = {
    setItem: (key, value) => {
      if (value.length > 60) throw new Error("QuotaExceededError");
      saved[key] = value;
    },
  };
  const items = [{ id: 3, t: "newest" }, { id: 2, t: "middle" }, { id: 1, t: "oldest" }];
  const kept = persistHistory(items, storage);
  expect(kept.map((i) => i.id)).toEqual([3, 2]);
  expect(JSON.parse(saved.qrcode_history)).toEqual(kept);
  expect(persistHistory([{ big: "x".repeat(100) }], storage)).toEqual([]);
});
