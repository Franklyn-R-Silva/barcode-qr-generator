import { crc16, pixPayload, pixAmount, normalizePixKey } from "./pix";

test("CRC-16/CCITT-FALSE check value", () => {
  expect(crc16("123456789")).toBe("29B1");
});

test("matches the static example in the Banco Central BR Code manual", () => {
  expect(
    pixPayload({ keyType: "random", key: "123e4567-e12b-12d1-a456-426655440000", name: "Fulano de Tal", city: "BRASILIA" })
  ).toBe(
    "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***63041D3D"
  );
});

test("amount, accents, description and keys are normalised", () => {
  const p = pixPayload({ keyType: "phone", key: "(11) 91234-5678", name: "João Ação", city: "São Paulo", amount: "1.234,50", description: "Café" });
  expect(p).toContain("0114+5511912345678");
  expect(p).toContain("0204Cafe");
  expect(p).toContain("54071234.50");
  expect(p).toContain("5909Joao Acao6009Sao Paulo");
  expect(p.slice(-4)).toBe(crc16(p.slice(0, -4)));
  expect(pixAmount("10")).toBe("10.00");
  expect(pixAmount("")).toBe("");
  expect(normalizePixKey("cpf", "123.456.789-09")).toBe("12345678909");
  expect(() => normalizePixKey("cpf", "123")).toThrow(/11 dígitos/);
  expect(() => pixAmount("-1")).toThrow();
  expect(() => pixPayload({ keyType: "email", key: "a@b.co", name: "", city: "X" })).toThrow(/nome/);
});
