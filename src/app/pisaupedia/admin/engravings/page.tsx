import { ServiceRequestsTable } from "@/widgets/admin/service-requests-table/ServiceRequestsTable";

export default function EngravingsAdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Engraving Requests</h1>
        <p className="text-sm text-gray-400">Kelola permintaan desain ukiran custom dari customer</p>
      </div>
      <ServiceRequestsTable type="engraving" />
    </div>
  );
}
