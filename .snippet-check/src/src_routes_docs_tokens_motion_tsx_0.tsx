import { motion } from "motion/react";

// The "snap" spring preset for interactive elements
const snapSpring = { type: "spring", stiffness: 500, damping: 32 };

export function AnimatedCard() {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={snapSpring}
      className="bg-surface border border-border rounded-xl p-5"
    >
      <h3 className="text-foreground font-semibold">Interactive Card</h3>
    </motion.div>
  );
}