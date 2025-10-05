import { motion, useScroll, useTransform } from "framer-motion";
import { useMe } from "@/features/auth/queries/use-me";

export const ProfileHeaderBanner = () => {
  const { data: me, query } = useMe();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 500]);
  const scale = useTransform(scrollY, [0, 1000], [1, 0.92]);

  return (
    <motion.div
      className="relative flex w-full h-full bg-cover bg-center justify-center
        overflow-hidden"
    >
      {
        query.isPending ? <div className="absolute inset-0 skeleton">
        </div> : (
          <motion.div
            className="absolute w-[110%] h-[110%] flex bg-cover bg-center m-[-40px]"
            style={{
              y,
              scale,
              backgroundImage: `url('${me?.banner ? me.banner : '/images/channel-placeholder.png'}')`,
            }}
          />
        )
      }
    </motion.div>
  );
};
