"use client";

import { useEffect, useState } from "react";

import { HttpError } from "@/shared/api/http-error";

import {
  getSalesReport,
  listOrders,
  type OrderResponse,
  type SalesReportData,
} from "@/entities/order/api/order.api";
import { orderStatusLabel, orderStatusStyle } from "@/entities/order/model/order-status";
import {
  getInventoryReport,
  listProducts,
  type ProductApiItem,
} from "@/entities/product/api/product.api";

// --- Helpers ---

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function formatShortDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function toIsoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function computeRange(days: number) {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - (days - 1));
  return { from: toIsoDate(from), to: toIsoDate(to) };
}

// Backend only returns days that had at least one paid order (GROUP BY) —
// fill the gaps with 0 so the chart reflects the full selected range.
function buildDailySeries(dailyRevenue: SalesReportData["daily_revenue"], from: string, to: string) {
  const byDate = new Map(dailyRevenue.map((d) => [d.date, d.revenue]));
  const series: { date: string; revenue: number }[] = [];
  const cursor = new Date(from);
  const end = new Date(to);
  while (cursor <= end) {
    const key = toIsoDate(cursor);
    series.push({ date: key, revenue: byDate.get(key) ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }
  return series;
}

const periodOptions = [
  { value: 7, label: "7 Hari Terakhir" },
  { value: 30, label: "30 Hari Terakhir" },
  { value: 90, label: "90 Hari Terakhir" },
];

// --- Chart (inline SVG, no charting library) ---

function RevenueChart({ data }: { data: { date: string; revenue: number }[] }) {
  const width = 800;
  const height = 200;
  const max = Math.max(1, ...data.map((d) => d.revenue));
  const stepX = data.length > 1 ? width / (data.length - 1) : width;
  const points = data.map((d, i) => ({
    x: i * stepX,
    y: height - (d.revenue / max) * (height - 20),
    ...d,
  }));
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ minWidth: 400, height: 200 }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </linearGradient>
        </defs>
        {data.length > 0 && (
          <>
            <path d={areaPath} fill="url(#revenueGradient)" stroke="none" />
            <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            {points.map((p) => (
              <circle key={p.date} cx={p.x} cy={p.y} r="3" fill="#3b82f6">
                <title>{`${formatShortDate(p.date)}: ${formatRupiah(p.revenue)}`}</title>
              </circle>
            ))}
          </>
        )}
      </svg>
      {data.length > 0 && (
        <div className="mt-2 flex justify-between text-[9px] text-gray-300">
          <span>{formatShortDate(data[0]!.date)}</span>
          {data.length > 2 && <span>{formatShortDate(data[Math.floor(data.length / 2)]!.date)}</span>}
          <span>{formatShortDate(data[data.length - 1]!.date)}</span>
        </div>
      )}
    </div>
  );
}

// --- Page ---

export function AdminDashboard() {
  const [days, setDays] = useState(30);
  const [salesReport, setSalesReport] = useState<SalesReportData | null>(null);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [topRated, setTopRated] = useState<ProductApiItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadSalesReport() {
    setLoading(true);
    try {
      const { from, to } = computeRange(days);
      setSalesReport(await getSalesReport(from, to));
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal memuat laporan penjualan");
    } finally {
      setLoading(false);
    }
  }

  async function loadStaticData() {
    try {
      const [inventory, ratedProducts, orders] = await Promise.all([
        getInventoryReport(),
        listProducts({ perPage: 8, sort: "rating" }),
        listOrders({ perPage: 6 }),
      ]);
      setTotalProducts(inventory.total_products);
      setTopRated(ratedProducts.filter((p) => p.review_count > 0).slice(0, 5));
      setRecentOrders(orders);
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal memuat data dashboard");
    }
  }

  useEffect(() => {
    loadSalesReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  useEffect(() => {
    loadStaticData();
  }, []);

  const chartSeries = salesReport ? buildDailySeries(salesReport.daily_revenue, salesReport.from, salesReport.to) : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">Dashboard</h1>
          <p className="text-xs text-gray-400 sm:text-sm">
            dashboard / <span className="text-emerald-500">dashboard</span>
          </p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600"
        >
          {periodOptions.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm sm:gap-4 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-lg sm:h-12 sm:w-12 sm:rounded-xl sm:text-xl">
            💰
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-gray-800 sm:text-xl">
              {salesReport ? formatRupiah(salesReport.total_revenue) : "…"}
            </p>
            <p className="truncate text-[10px] text-gray-400 sm:text-xs">Total Pendapatan</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm sm:gap-4 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-lg sm:h-12 sm:w-12 sm:rounded-xl sm:text-xl">
            📦
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-gray-800 sm:text-xl">
              {salesReport ? salesReport.total_orders : "…"}
            </p>
            <p className="truncate text-[10px] text-gray-400 sm:text-xs">Total Orders</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm sm:gap-4 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-lg sm:h-12 sm:w-12 sm:rounded-xl sm:text-xl">
            🔪
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-gray-800 sm:text-xl">
              {totalProducts ?? "…"}
            </p>
            <p className="truncate text-[10px] text-gray-400 sm:text-xs">Products</p>
          </div>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 sm:mb-6">
          <h2 className="text-base font-semibold text-gray-800 sm:text-lg">Pendapatan Harian</h2>
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-400 sm:gap-4 sm:text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500 sm:h-2.5 sm:w-2.5" />
              Pendapatan {salesReport ? formatRupiah(salesReport.total_revenue) : "…"}
            </span>
          </div>
        </div>
        {loading ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-gray-400">Memuat...</div>
        ) : (
          <RevenueChart data={chartSeries} />
        )}
      </div>

      {/* Two tables row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top selling */}
        <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-800 sm:text-lg">Top Selling Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                  <th className="pb-3 font-medium">Product Name</th>
                  <th className="pb-3 font-medium">Qty Terjual</th>
                  <th className="pb-3 text-right font-medium">Pendapatan</th>
                </tr>
              </thead>
              <tbody>
                {(salesReport?.top_products.length ?? 0) === 0 ? (
                  <tr><td colSpan={3} className="py-8 text-center text-gray-400">Belum ada data.</td></tr>
                ) : (
                  salesReport!.top_products.map((product) => (
                    <tr key={product.product_name} className="border-b border-gray-50">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-[10px] text-gray-400">
                            IMG
                          </div>
                          <span className="font-medium text-gray-700">{product.product_name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-gray-500">{product.quantity_sold}</td>
                      <td className="py-3 text-right font-semibold text-emerald-500">{formatRupiah(product.revenue)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top rated */}
        <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-800 sm:text-lg">Top Rated Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                  <th className="pb-3 font-medium">Product Name</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Rating</th>
                </tr>
              </thead>
              <tbody>
                {topRated.length === 0 ? (
                  <tr><td colSpan={4} className="py-8 text-center text-gray-400">Belum ada review.</td></tr>
                ) : (
                  topRated.map((product) => (
                    <tr key={product.id} className="border-b border-gray-50">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.image} alt={product.name} className="h-9 w-9 rounded-lg object-cover" />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-[10px] text-gray-400">
                              IMG
                            </div>
                          )}
                          <span className="font-medium text-gray-700">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-gray-500">{product.category ?? "—"}</td>
                      <td className="py-3 text-gray-500">{formatRupiah(product.price)}</td>
                      <td className="py-3">
                        <span className="flex items-center gap-1 text-amber-500">
                          ★ {product.rating.toFixed(1)}
                          <span className="text-gray-400">({product.review_count})</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent orders table */}
      <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-800 sm:text-lg">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Tanggal</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-400">Belum ada pesanan.</td></tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50">
                    <td className="py-3 font-mono text-xs text-gray-500">{order.id.slice(0, 8)}</td>
                    <td className="py-3 text-gray-700">{order.customer_name}</td>
                    <td className="py-3 text-gray-400">{formatDate(order.created_at)}</td>
                    <td className="py-3 font-medium text-gray-700">{formatRupiah(order.total)}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${orderStatusStyle(order.status)}`}>
                        {orderStatusLabel(order.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
