"use client";

import { useEffect, useState } from "react";

import {
  exportSalesReport,
  getSalesReport,
  type SalesReport,
} from "@/entities/report/api/report.api";
import { HttpError } from "@/shared/api/http-error";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

const statusLabels: Record<string, string> = {
  pending: "Menunggu Konfirmasi",
  processing: "Diproses",
  ready_for_delivery: "Siap Dikirim",
  delivered: "Selesai",
  cancelled: "Dibatalkan",
};

export default function SalesReportPage() {
  const [from, setFrom] = useState(daysAgoISO(30));
  const [to, setTo] = useState(todayISO());
  const [report, setReport] = useState<SalesReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<"xlsx" | "pdf" | null>(null);

  async function loadReport() {
    setLoading(true);
    try {
      const data = await getSalesReport(from, to);
      setReport(data);
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal memuat laporan penjualan");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleExport(format: "xlsx" | "pdf") {
    setExporting(format);
    try {
      await exportSalesReport(format, from, to);
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal mengunduh laporan");
    } finally {
      setExporting(null);
    }
  }

  const avgOrderValue = report && report.total_orders > 0 ? report.total_revenue / report.total_orders : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sales Report</h1>
          <p className="text-sm text-gray-400">Revenue, orders, and sales analytics</p>
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

      <div className="flex flex-wrap items-end gap-3 rounded-xl bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Dari Tanggal</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Sampai Tanggal</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={loadReport}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
        >
          Terapkan
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl bg-white p-8 text-center text-gray-400 shadow-sm">Memuat...</div>
      ) : !report ? (
        <div className="rounded-xl bg-white p-8 text-center text-gray-400 shadow-sm">Gagal memuat data.</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 p-5 shadow-sm">
              <p className="text-xs text-white/80">Total Revenue</p>
              <p className="mt-1 text-2xl font-bold text-white">{formatRupiah(report.total_revenue)}</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 p-5 shadow-sm">
              <p className="text-xs text-white/80">Total Orders</p>
              <p className="mt-1 text-2xl font-bold text-white">{report.total_orders}</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-5 shadow-sm">
              <p className="text-xs text-white/80">Rata-rata Nilai Order</p>
              <p className="mt-1 text-2xl font-bold text-white">{formatRupiah(avgOrderValue)}</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-gray-700">Status Pesanan</h3>
              <div className="flex flex-col gap-2">
                {Object.entries(report.status_counts).length === 0 ? (
                  <p className="text-sm text-gray-400">Tidak ada data.</p>
                ) : (
                  Object.entries(report.status_counts).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{statusLabels[status] ?? status}</span>
                      <span className="font-medium text-gray-700">{count}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-gray-700">Top 5 Produk Terlaris</h3>
              {report.top_products.length === 0 ? (
                <p className="text-sm text-gray-400">Belum ada penjualan pada rentang ini.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {report.top_products.map((p) => (
                    <div key={p.product_name} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium text-gray-700">{p.product_name}</p>
                        <p className="text-xs text-gray-400">{p.quantity_sold} terjual</p>
                      </div>
                      <p className="font-medium text-gray-700">{formatRupiah(p.revenue)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
