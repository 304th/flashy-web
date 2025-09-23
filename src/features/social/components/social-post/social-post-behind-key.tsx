import Image from "next/image";
import { motion } from "framer-motion";
import { useModals } from "@/hooks/use-modals";
import { useIsSocialPostLocked } from "@/features/social/hooks/use-is-social-post-locked";

export const SocialPostBehindKey = ({ socialPost }: { socialPost: SocialPost }) => {
  const isLocked = useIsSocialPostLocked(socialPost);
  const { openModal } = useModals()

  if (!isLocked) {
    return null;
  }

  return <div className="relative aspect-video max-h-[200px] rounded-md" onClick={(e) => {
    e.preventDefault();
    openModal('BuyKeyModal', { user: { fbId: socialPost.userId, username: socialPost.username, userimage: socialPost.userimage } })
  }}>
    <div className="absolute inset-0 rounded-md bg-cover bg-center" style={{ backgroundImage: 'url(/images/forest.png)' }} />
    <motion.div whileHover={{ translateY: -5 }} className="absolute inset-0 flex flex-col items-center justify-center z-1">
      <Image src="/key-lock.svg" alt='Key lock icon' width={100} height={100} />
      <p className="text-white">Locked behind key</p>
    </motion.div>
  </div>
}