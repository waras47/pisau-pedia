export const orderStatusOptions = [
  { value: "pending", label: "Menunggu Konfirmasi" },
  { value: "processing", label: "Diproses" },
  { value: "ready_for_delivery", label: "Siap Dikirim" },
  { value: "delivered", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

export const paymentStatusOptions = [
  { value: "unpaid", label: "Belum Dibayar" },
  { value: "paid", label: "Sudah Dibayar" },
  { value: "expired", label: "Kedaluwarsa" },
  { value: "failed", label: "Gagal" },
];

export function orderStatusLabel(value: string) {
  return orderStatusOptions.find((o) => o.value === value)?.label ?? value;
}

export function orderStatusStyle(value: string) {
  switch (value) {
    case "delivered":
      return "bg-emerald-50 text-emerald-600";
    case "cancelled":
      return "bg-red-50 text-red-500";
    case "ready_for_delivery":
      return "bg-blue-50 text-blue-500";
    case "processing":
      return "bg-amber-50 text-amber-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export function paymentStatusLabel(value: string) {
  return paymentStatusOptions.find((p) => p.value === value)?.label ?? value;
}

export function paymentStyle(value: string) {
  switch (value) {
    case "paid":
      return "bg-emerald-50 text-emerald-600";
    case "unpaid":
      return "bg-amber-50 text-amber-600";
    default:
      return "bg-red-50 text-red-500";
  }
}
