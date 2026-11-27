import { encodeContent } from "./qrContent";

test("each content type encodes the standard text", () => {
  expect(encodeContent("link", { url: "devfrs.com" }).text).toBe("https://devfrs.com");
  expect(encodeContent("link", { url: "http://a.b" }).text).toBe("http://a.b");
  expect(encodeContent("whatsapp", { phone: "(82) 99999-0000", message: "Oi, tudo?" }).text).toBe(
    "https://wa.me/5582999990000?text=Oi%2C%20tudo%3F"
  );
  expect(encodeContent("wifi", { ssid: "Casa;2G", password: 'a"b', encryption: "WPA" }).text).toBe(
    'WIFI:T:WPA;S:Casa\\;2G;P:a\\"b;;'
  );
  expect(encodeContent("wifi", { ssid: "Loja", encryption: "nopass", hidden: true }).text).toBe("WIFI:T:nopass;S:Loja;H:true;;");
  expect(encodeContent("email", { to: "a@b.com", subject: "Olá" }).text).toBe("mailto:a@b.com?subject=Ol%C3%A1");
  expect(encodeContent("phone", { phone: "11 3123-4567" }).text).toBe("tel:+551131234567");
  expect(encodeContent("sms", { phone: "11912345678", message: "oi" }).text).toBe("SMSTO:+5511912345678:oi");
  expect(encodeContent("vcard", { firstName: "Ana", lastName: "Silva", phone: "11912345678" }).text).toBe(
    "BEGIN:VCARD\nVERSION:3.0\nN:Silva;Ana;;;\nFN:Ana Silva\nTEL;TYPE=CELL:+5511912345678\nEND:VCARD"
  );
});

test("empty forms give no text; a bad Pix gives an error", () => {
  expect(encodeContent("wifi", {})).toEqual({ text: "" });
  expect(encodeContent("pix", {})).toEqual({ text: "" });
  expect(encodeContent("pix", { key: "1", name: "A", city: "B" }).error).toMatch(/CPF/);
});
