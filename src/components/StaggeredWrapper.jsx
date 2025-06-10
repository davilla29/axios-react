// Updated with inview
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { Children } from "react";

const getChildVariants = (direction, duration = 0.4) => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  };

  const offset = directions[direction] || directions.up;

  return {
    initial: {
      opacity: 0,
      ...offset,
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration },
    },
  };
};

const StaggeredWrapper = ({
  children,
  direction = "up",
  staggerDelay = 0.2,
  duration = 0.4,
  initialDelay = 0,
}) => {
  const childVariants = getChildVariants(direction, duration);
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };

  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: true }); // animate once when 30% in view

  useEffect(() => {
    if (inView) {
      controls.start("animate");
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="initial"
      animate={controls}
    >
      {Children.toArray(children).map((child, i) => (
        <motion.div key={i} variants={childVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StaggeredWrapper;
