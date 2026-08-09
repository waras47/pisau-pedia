// Static/manual payment channels — this store confirms payment manually
// (admin checks the transfer, then marks the order paid) instead of using
// an automated gateway. See pisau-pedia-backend's DummyGateway.
export type StaticPaymentType = "bank_transfer" | "qris" | "shopeepay" | "dana";

export const paymentConfig = {
  bankTransfer: {
    label: "Transfer Bank",
    // TODO: ganti dengan bank, nomor rekening, dan nama pemilik asli.
    bankName: "BCA",
    accountNumber: "1234567890",
    accountHolder: "PT Pisau Pedia Indonesia",
  },
  shopeepay: {
    label: "ShopeePay",
    // TODO: ganti dengan nomor ShopeePay asli.
    number: "081234567890",
    holder: "Pisau Pedia",
  },
  dana: {
    label: "DANA",
    // TODO: ganti dengan nomor DANA asli.
    number: "081234567890",
    holder: "Pisau Pedia",
  },
  qris: {
    label: "QRIS",
    // TODO: pasang gambar QRIS asli di public/images/payment/qris.png
    // dan ganti imageUrl di bawah ini — sengaja dikosongkan (bukan gambar
    // buatan) karena QRIS palsu/salah bisa membuat pembayaran customer
    // tidak sampai ke mana pun.
    imageUrl: "",
  },
} as const;

export const staticPaymentOptions: { value: StaticPaymentType; label: string }[] = [
  { value: "bank_transfer", label: paymentConfig.bankTransfer.label },
  { value: "qris", label: paymentConfig.qris.label },
  { value: "shopeepay", label: paymentConfig.shopeepay.label },
  { value: "dana", label: paymentConfig.dana.label },
];
