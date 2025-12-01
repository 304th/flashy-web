import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const GoBackButton = () => {
  const router = useRouter();

  return (
    <Button variant="ghost" onClick={() => router.back()}>
      <ArrowLeft />
      Go Back
    </Button>
  );
};
