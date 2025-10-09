import { motion, useScroll, useTransform } from "framer-motion";
import { useChannelContext } from "@/features/profile/components/channel-context/channel-context";

export const ChannelBanner = ({ className }: { className?: string }) => {
  const { channel, channelQuery } = useChannelContext();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 500]);
  const scale = useTransform(scrollY, [0, 1000], [1, 0.92]);

  return (
    <motion.div
      className={`relative flex w-full h-full bg-cover bg-center justify-center
        overflow-hidden ${className}`}
    >
      {channelQuery.isPending ? (
        <div className="absolute inset-0 skeleton"></div>
      ) : (
        <motion.div
          className="absolute w-[110%] h-[110%] flex bg-cover bg-center
            m-[-40px]"
          style={{
            y,
            scale,
            backgroundImage: `url('${channel?.banner ? channel.banner : "/images/channel-placeholder.png"}')`,
          }}
        />
      )}
    </motion.div>
  );
};
