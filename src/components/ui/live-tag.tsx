import { motion } from "framer-motion";

export const LiveTag = ({ className }: { className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex justify-center items-center bg-red-600 px-2 w-[50px]
        rounded-md ${className}`}
    >
      <p className="font-medium text-white">LIVE</p>
    </motion.div>
  );
};
