import { CANVAS_SIZE } from "@/common/constants/convasSize";
import { useViewportSize } from "@/common/hooks/useViewportSize";
import { MotionValue, useMotionValue, motion } from "framer-motion";
import { Dispatch, SetStateAction, forwardRef, useEffect, useRef } from "react";

const MiniMap = forwardRef<
  HTMLCanvasElement,
  {
    x: MotionValue<number>;
    y: MotionValue<number>;
    dragging: boolean;
    setMovedMinimap: Dispatch<SetStateAction<boolean>>;
  }
>(({ x, y, dragging, setMovedMinimap }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useViewportSize();

  const miniX = useMotionValue(0);
  const miniY = useMotionValue(0);

  useEffect(() => {
    miniX.onChange((newX) => {
      if (!dragging) x.set(-newX * 10);
    });
    miniY.onChange((newY) => {
      if (!dragging) y.set(-newY * 10);
    });

    return () => {
      miniX.clearListeners();
      miniY.clearListeners();
    };
  }, [dragging, miniX, miniY, x, y]);

  return (
    <div
      className="absolute right-10 top-10 z-50 bg-zinc-50"
      ref={containerRef}
      style={{ width: CANVAS_SIZE.width / 10, height: CANVAS_SIZE.height / 10 }}
    >
      <canvas
        ref={ref as any}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className="h-full w-full"
      ></canvas>
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        dragTransition={{ power: 0, timeConstant: 0 }}
        onDragEnd={() => setMovedMinimap((prev: boolean) => !prev)}
        className="absolute top-0 left-0 cursor-grab border-2 border-red-500"
        style={{
          width: width / 10,
          height: height / 10,
          x: miniX,
          y: miniY,
        }}
        animate={{ x: -x.get() / 10, y: -y.get() / 10 }}
        transition={{ duration: 0.1 }}
      ></motion.div>
    </div>
  );
});

MiniMap.displayName = "MiniMap"; // Set the display name

export default MiniMap;
