import { Target } from "framer-motion";

interface StaggerAnimationItem {
  hidden: Target;
  show: Target;
  exit?: Target;
}

interface StaggerAnimationProps {
  speed?: number;
  container?: StaggerAnimationItem;
  child?: StaggerAnimationItem;
}

export const getStaggerAnimations = ({
  speed,
  container,
  child,
}: StaggerAnimationProps) => {
  const containerVariants = container ?? {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };
  const childVariants = child ?? {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  return {
    container: {
      hidden: containerVariants.hidden,
      show: {
        ...(containerVariants.show as any),
        transition: {
          staggerChildren: speed ?? 0.02,
        },
      },
      ...(container?.exit ? { exit: container?.exit } : {}),
    },
    child: {
      hidden: childVariants.hidden,
      show: childVariants.show,
    },
  };
};

export const defaultVariants = getStaggerAnimations({
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
  child: {
    hidden: {
      opacity: 0,
      y: 10,
    },
    show: {
      opacity: 1,
      y: 0,
    },
  },
});
