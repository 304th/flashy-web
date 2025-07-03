import { StreamBillboard } from "@/features/streams/components/stream-billboard/stream-billboard";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <StreamBillboard />
    </div>
  );
}
