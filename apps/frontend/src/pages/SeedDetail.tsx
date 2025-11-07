import { useEffect } from "react";
import { track } from "@/lib/analytics";

export default function SeedDetail({ seedId }: { seedId: string }) {
  useEffect(() => {
    if (seedId) track("seed_view", { seedId });
  }, [seedId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Seed Details</h1>
      {/* ...weitere Seed-Daten hier... */}
    </div>
  );
}
