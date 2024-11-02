"use client";
import DashboardHome from "@/components/DashboardHome";



export default function EnhancedVendorDashboard() {
  return (
    <div className={`min-h-screen`}>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <div className="">
          {/* Main content */}
          <DashboardHome />
        </div>
      </div>
    </div>
  );
}
