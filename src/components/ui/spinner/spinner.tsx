import styles from "@/components/ui/spinner/spinner.module.css";

export const Spinner = ({ className }: { className?: string }) => (
  <div className={`flex w-4 h-4 ${className}`}>
    <div className={styles.loader} />
  </div>
);
