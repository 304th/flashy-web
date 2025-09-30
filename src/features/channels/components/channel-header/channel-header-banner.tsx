import { motion, useScroll, useTransform } from "framer-motion";

export const ChannelHeaderBanner = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 500]);
  const scale = useTransform(scrollY, [0, 1000], [1, 0.92]);

  return (
    <motion.div
      className="relative flex w-full h-full bg-cover bg-center justify-center
        overflow-hidden"
    >
      <motion.div
        className="absolute w-[110%] h-[110%] flex bg-cover bg-center m-[-40px]"
        style={{
          y,
          scale,
          backgroundImage: "url('/images/channel-placeholder.png')",
        }}
      />
    </motion.div>
  );
};
