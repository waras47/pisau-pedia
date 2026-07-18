"use client";

import { useEffect, useState } from "react";

import {
  exportInventoryReport,
  getInventoryReport,
  type InventoryReport,
} from "@/entities/report/api/report.api";
import { HttpError } from "@/shared/api/http-error";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

export default function InventoryReportPage() {
  const [report, setReport] = useState<InventoryReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<"xlsx" | "pdf" | null>(null);

  async function loadReport() {
    setLoading(true);
    try {
      const data = await getInventoryReport();
      setReport(data);
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal memuat laporan inventori");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, []);

  async function handleExport(format: "xlsx" | "pdf") {
    setExporting(format);
    try {
      await exportInventoryReport(format);
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal mengunduh laporan");
    } finally {
      setExporting(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventory Report</h1>
          <p className="text-sm text-gray-400">Stock levels and inventory analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleExport("xlsx")}
            disabled={exporting !== null}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
          >
            {exporting === "xlsx" ? "Mengunduh..." : "Export Excel"}
          </button>
          <button
            type="button"
            onClick={() => handleExport("pdf")}
            disabled={exporting !== null}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
          >
            {exporting === "pdf" ? "Mengunduh..." : "Export PDF"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl bg-white p-8 text-center text-gray-400 shadow-sm">Memuat...</div>
      ) : !report ? (
        <div className="rounded-xl bg-white p-8 text-center text-gray-400 shadow-sm">Gagal memuat data.</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-gradient-to-br from-slate-400 to-slate-600 p-5 shadow-sm">
              <p className="text-xs text-white/80">Total Produk</p>
              <p className="mt-1 text-2xl font-bold text-white">{report.total_products}</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 p-5 shadow-sm">
              <p className="text-xs text-white/80">Nilai Total Stok</p>
              <p className="mt-1 text-2xl font-bold text-white">{formatRupiah(report.total_stock_value)}</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-5 shadow-sm">
              <p className="text-xs text-white/80">Stok Menipis</p>
              <p className="mt-1 text-2xl font-bold text-white">{report.low_stock_count}</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-red-400 to-red-600 p-5 shadow-sm">
              <p className="text-xs text-white/80">Stok Habis</p>
              <p className="mt-1 text-2xl font-bold text-white">{report.out_of_stock_count}</p>
            </div>
          </div>

          <div className="rounded-xl bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-gray-700">Breakdown per Kategori</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                    <th className="px-5 py-3 font-medium">Kategori</th>
                    <th className="px-5 py-3 font-medium">Jumlah Produk</th>
                    <th className="px-5 py-3 font-medium">Total Stok</th>
                  </tr>
                </thead>
                <tbody>
                  {report.category_breakdown.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-5 py-8 text-center text-gray-400">
                        Belum ada data.
                      </td>
                    </tr>
                  ) : (
                    report.category_breakdown.map((c) => (
                      <tr key={c.category_name} className="border-b border-gray-50">
                        <td className="px-5 py-3 font-medium text-gray-700">{c.category_name}</td>
                        <td className="px-5 py-3 text-gray-500">{c.product_count}</td>
                        <td className="px-5 py-3 text-gray-500">{c.total_stock}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
