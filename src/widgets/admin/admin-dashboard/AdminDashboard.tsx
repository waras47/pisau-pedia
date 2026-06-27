"use client";

import { useState } from "react";

import {
  accessories,
  // engravings,
  japaneseKnives,
  type Product,
} from "@/entities/product";

const allProducts = [...japaneseKnives, ...accessories];

const statsCards = [
  {
    label: "Total Revenue",
    value: "€ 24,680.00",
    change: "+18%",
    positive: true,
    icon: "💰",
    bg: "bg-emerald-50",
  },
  {
    label: "Total Orders",
    value: "342",
    change: "+12%",
    positive: true,
    icon: "📦",
    bg: "bg-blue-50",
  },
  {
    label: "Products",
    value: String(allProducts.length),
    change: "",
    positive: true,
    icon: "🔪",
    bg: "bg-amber-50",
  },
  {
    label: "In Stock",
    value: String(allProducts.filter((p) => p.badge !== "sold-out").length),
    change: "",
    positive: true,
    icon: "✅",
    bg: "bg-green-50",
  },
  {
    label: "Out of Stock",
    value: String(allProducts.filter((p) => p.badge === "sold-out").length),
    change: "",
    positive: false,
    icon: "⚠️",
    bg: "bg-red-50",
  },
];

const orderStats = [
  { label: "Waiting Confirmation", value: "8", icon: "🕐", bg: "bg-yellow-50" },
  { label: "Processing", value: "15", icon: "⚙️", bg: "bg-blue-50" },
  { label: "Ready for Delivery", value: "12", icon: "📋", bg: "bg-indigo-50" },
  { label: "Delivered", value: "287", icon: "✅", bg: "bg-green-50" },
  { label: "Sharpening Requests", value: "6", icon: "🔧", bg: "bg-purple-50" },
  { label: "Engraving Orders", value: "14", icon: "✨", bg: "bg-pink-50" },
];

const chartData = [
  { day: 1, revenue: 820, commission: 82 },
  { day: 2, revenue: 640, commission: 64 },
  { day: 3, revenue: 950, commission: 95 },
  { day: 4, revenue: 780, commission: 78 },
  { day: 5, revenue: 1100, commission: 110 },
  { day: 6, revenue: 560, commission: 56 },
  { day: 7, revenue: 890, commission: 89 },
  { day: 8, revenue: 1200, commission: 120 },
  { day: 9, revenue: 670, commission: 67 },
  { day: 10, revenue: 930, commission: 93 },
  { day: 11, revenue: 750, commission: 75 },
  { day: 12, revenue: 1050, commission: 105 },
  { day: 13, revenue: 880, commission: 88 },
  { day: 14, revenue: 620, commission: 62 },
  { day: 15, revenue: 1150, commission: 115 },
  { day: 16, revenue: 700, commission: 70 },
  { day: 17, revenue: 990, commission: 99 },
  { day: 18, revenue: 840, commission: 84 },
  { day: 19, revenue: 1080, commission: 108 },
  { day: 20, revenue: 760, commission: 76 },
  { day: 21, revenue: 920, commission: 92 },
  { day: 22, revenue: 1300, commission: 130 },
  { day: 23, revenue: 680, commission: 68 },
  { day: 24, revenue: 1020, commission: 102 },
  { day: 25, revenue: 870, commission: 87 },
  { day: 26, revenue: 1180, commission: 118 },
  { day: 27, revenue: 740, commission: 74 },
  { day: 28, revenue: 960, commission: 96 },
  { day: 29, revenue: 1250, commission: 125 },
  { day: 30, revenue: 810, commission: 81 },
];

function getTopProducts(products: Product[], limit = 5) {
  return [...products]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, limit);
}

function getTopRated(products: Product[], limit = 5) {
  return [...products]
    .filter((p) => p.reviewCount > 0)
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, limit);
}

export function AdminDashboard() {
  const [period, setPeriod] = useState("monthly");
  const topSelling = getTopProducts(allProducts);
  const topRated = getTopRated(allProducts);
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue));

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
        <div className="flex items-center gap-2">
          <span className="hidden rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-500 sm:inline">
            Jun 1, 2026 – Jun 24, 2026
          </span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* Stats cards row 1 */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
        {statsCards.map((card) => (
          <div
            key={card.label}
            className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm sm:gap-4 sm:p-4"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg sm:h-12 sm:w-12 sm:rounded-xl sm:text-xl ${card.bg}`}>
              {card.icon}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-gray-800 sm:text-xl">{card.value}</p>
              <p className="truncate text-[10px] text-gray-400 sm:text-xs">{card.label}</p>
            </div>
            {card.change && (
              <span
                className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  card.positive
                    ? "bg-emerald-50 text-emerald-500"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {card.change}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Stats cards row 2 — order statuses + services */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
        {orderStats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800">{stat.value}</p>
              <p className="text-[11px] text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 sm:mb-6">
          <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
            Revenue &amp; Commission
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-400 sm:gap-4 sm:text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500 sm:h-2.5 sm:w-2.5" />
              Revenue € 24,680
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-200 sm:h-2.5 sm:w-2.5" />
              Commission € 2,468
            </span>
          </div>
        </div>

        {/* Simple bar chart */}
        <div className="flex items-end gap-[3px]" style={{ height: 200 }}>
          {chartData.map((d) => (
            <div key={d.day} className="group relative flex flex-1 flex-col items-center gap-0.5">
              <div
                className="w-full rounded-t bg-blue-400 transition-colors hover:bg-blue-500"
                style={{ height: `${(d.revenue / maxRevenue) * 170}px` }}
              />
              <div
                className="w-full rounded-t bg-blue-200"
                style={{ height: `${(d.commission / maxRevenue) * 170}px` }}
              />
              {/* Tooltip */}
              <div className="pointer-events-none absolute -top-10 left-1/2 z-10 hidden -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-[10px] text-white shadow group-hover:block">
                €{d.revenue}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-[3px]">
          {chartData.map((d) => (
            <span key={d.day} className="flex-1 text-center text-[9px] text-gray-300">
              {d.day}
            </span>
          ))}
        </div>
      </div>

      {/* Two tables row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top selling */}
        <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-800 sm:text-lg">
            Top Selling Products
          </h2>
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                <th className="pb-3 font-medium">Product Name</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Sold</th>
                <th className="pb-3 text-right font-medium">Profit</th>
              </tr>
            </thead>
            <tbody>
              {topSelling.map((product) => (
                <tr key={product.id} className="border-b border-gray-50">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-[10px] text-gray-400">
                        IMG
                      </div>
                      <span className="font-medium text-gray-700">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-500">{product.category}</td>
                  <td className="py-3 text-gray-500">€{product.price}</td>
                  <td className="py-3 text-gray-500">{product.reviewCount}</td>
                  <td className="py-3 text-right font-semibold text-emerald-500">
                    €{Math.round(product.price * 0.3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* Top rated */}
        <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-800 sm:text-lg">
            Top Rated Products
          </h2>
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                <th className="pb-3 font-medium">Product Name</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Rating</th>
                <th className="pb-3 text-right font-medium">Profit</th>
              </tr>
            </thead>
            <tbody>
              {topRated.map((product) => (
                <tr key={product.id} className="border-b border-gray-50">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-[10px] text-gray-400">
                        IMG
                      </div>
                      <span className="font-medium text-gray-700">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-500">{product.category}</td>
                  <td className="py-3 text-gray-500">€{product.price}</td>
                  <td className="py-3">
                    <span className="flex items-center gap-1 text-amber-500">
                      ★ {product.rating}
                      <span className="text-gray-400">
                        ({product.reviewCount})
                      </span>
                    </span>
                  </td>
                  <td className="py-3 text-right font-semibold text-emerald-500">
                    €{Math.round(product.price * 0.3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* Recent orders table */}
      <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-800 sm:text-lg">
          Recent Orders
        </h2>
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
              <th className="pb-3 font-medium">Order ID</th>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Product</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b border-gray-50">
                <td className="py-3 font-mono text-xs text-gray-500">
                  {order.id}
                </td>
                <td className="py-3 text-gray-700">{order.customer}</td>
                <td className="py-3 text-gray-500">{order.product}</td>
                <td className="py-3 text-gray-400">{order.date}</td>
                <td className="py-3 font-medium text-gray-700">
                  €{order.amount}
                </td>
                <td className="py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${statusColors[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

const statusColors: Record<string, string> = {
  Delivered: "bg-emerald-50 text-emerald-600",
  Processing: "bg-blue-50 text-blue-600",
  Pending: "bg-yellow-50 text-yellow-600",
  Shipped: "bg-indigo-50 text-indigo-600",
  Cancelled: "bg-red-50 text-red-600",
};

const recentOrders = [
  { id: "#KS-1042", customer: "Lukas Müller", product: "Aoi Gyuto 210mm", date: "Jun 23, 2026", amount: "248.00", status: "Delivered" },
  { id: "#KS-1041", customer: "Marie Dupont", product: "Leather Knife Roll — 10 Slots", date: "Jun 23, 2026", amount: "120.00", status: "Processing" },
  { id: "#KS-1040", customer: "Hans Weber", product: "Sakura Engraving + Yama Gyuto", date: "Jun 22, 2026", amount: "346.00", status: "Pending" },
  { id: "#KS-1039", customer: "Chiara Rossi", product: "Sharpening Service × 3", date: "Jun 22, 2026", amount: "45.00", status: "Processing" },
  { id: "#KS-1038", customer: "Jan de Vries", product: "Hasegawa Board + Sumi Santoku", date: "Jun 21, 2026", amount: "230.00", status: "Shipped" },
  { id: "#KS-1037", customer: "Emma Schmidt", product: "Magnetic Holder — Walnut", date: "Jun 21, 2026", amount: "92.00", status: "Delivered" },
  { id: "#KS-1036", customer: "Pierre Martin", product: "Kuro Bunka 190mm", date: "Jun 20, 2026", amount: "176.00", status: "Delivered" },
  { id: "#KS-1035", customer: "Sofia Andersson", product: "Custom Engraving + Kumo Gyuto", date: "Jun 20, 2026", amount: "228.00", status: "Pending" },
];
