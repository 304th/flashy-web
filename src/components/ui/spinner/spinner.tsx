import styles from "@/components/ui/spinner/spinner.module.css";

export const Spinner = () => (
  <div className="flex w-4 h-4">
    <div className={styles.loader} />
  </div>
);
