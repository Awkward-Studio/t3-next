import React from "react";

export default function DisplayCard({ icon, desc, value }: any) {
  return (
    <div className="flex flex-col w-full lg:h-[188px] lg:min-w-[280px] lg:w-[416px] border-2 border-gray-200 rounded-lg shadow-sm p-4">
      <div className="border-2 rounded-lg p-3 w-fit mb-6">{icon}</div>
      <div className="text-sm text-gray-500">{desc}</div>
      <div className="text-4xl font-semibold">{value}</div>
    </div>
  );
}
