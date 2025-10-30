export const CarouselNavigation = <T,>({
  items,
  currentIndex,
  onScroll,
}: {
  items: T[];
  currentIndex: number;
  onScroll: (index: number) => void;
}) => {
  return (
    <div className="flex justify-center gap-2">
      {items.map((_, index) => (
        <button
          key={index}
          onClick={() => onScroll(index)}
          className="group py-4 rounded transition-all cursor-pointer
            duration-200"
        >
          <div
            className={`h-[2px] rounded transition-all duration-300 ease-in-out
            ${
              index === currentIndex
                ? "bg-white w-14"
                : "bg-white/40 w-8 group-hover:bg-white/80"
            }`}
          />
        </button>
      ))}
    </div>
  );
};
