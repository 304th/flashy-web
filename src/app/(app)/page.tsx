import { StreamingBillboard } from "@/features/streams/components/streaming-billboard/streaming-billboard";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <StreamingBillboard />
    </div>
  );
}
