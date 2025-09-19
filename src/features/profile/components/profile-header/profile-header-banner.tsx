import { motion, useScroll, useTransform } from "framer-motion";

export const ProfileHeaderBanner = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 500]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <motion.div
      className="relative flex w-full h-full bg-cover bg-center justify-center
        overflow-hidden"
    >
      <motion.div
        className="absolute w-[110%] h-[110%] flex bg-cover bg-center m-[-40px]"
        style={{ y, scale, backgroundImage: "url('/images/banner.jpg')" }}
      />
    </motion.div>
  );
};
