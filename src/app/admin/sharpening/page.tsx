import { ServiceRequestsTable } from "@/widgets/admin/service-requests-table/ServiceRequestsTable";

export default function SharpeningPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Sharpening Requests</h1>
        <p className="text-sm text-gray-400">Kelola permintaan asah & perbaikan pisau dari customer</p>
      </div>
      <ServiceRequestsTable type="sharpening" />
    </div>
  );
}
