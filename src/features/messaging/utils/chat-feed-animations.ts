import { getStaggerAnimations } from "@/lib/framer";

export const chatFeedAnimation = getStaggerAnimations({
  speed: 0.05,
  container: {
    hidden: {
      opacity: 0,
      y: -10,
    },
    show: {
      opacity: 1,
      y: 0,
    },
  },
});

export const getChatFeedMessagesAnimation = (x: number) => getStaggerAnimations({
  speed: 0.05,
  child: {
    hidden: {
      opacity: 0,
      y: 5,
      x: x * 10,
    },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
    },
  },
});