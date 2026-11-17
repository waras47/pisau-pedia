export type StaticPaymentType = "bank_transfer" | "qris" | "shopeepay" | "dana";

export const paymentConfig = {
  bankTransfer: {
    label: "Transfer Bank (Mandiri)",
    bankName: "Bank Mandiri",
    accountNumber: "1170011490331",
    accountHolder: "Rahmawati Nur Aida",
  },
  shopeepay: {
    label: "ShopeePay",
    number: "",
    holder: "",
    disabled: true,
  },
  dana: {
    label: "DANA",
    number: "",
    holder: "",
    disabled: true,
  },
  qris: {
    label: "QRIS",
    imageUrl: "",
    disabled: true,
  },
} as const;

export const staticPaymentOptions: { value: StaticPaymentType; label: string; disabled?: boolean }[] = [
  { value: "bank_transfer", label: paymentConfig.bankTransfer.label },
  { value: "qris", label: paymentConfig.qris.label, disabled: true },
  { value: "shopeepay", label: paymentConfig.shopeepay.label, disabled: true },
  { value: "dana", label: paymentConfig.dana.label, disabled: true },
];
