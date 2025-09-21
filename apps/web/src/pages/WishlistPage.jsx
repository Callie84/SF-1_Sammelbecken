import React from "react";
import WishlistDashboard from "../components/WishlistDashboard";

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-6">
          <h1 className="text-3xl font-bold">Wunschliste</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto mt-6">
        <WishlistDashboard />
      </main>
    </div>
  );
}
