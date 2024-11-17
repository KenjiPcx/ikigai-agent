'use client';

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function AnimatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={false}
        animate={isHome ? "grid" : "chat"}
        variants={{
          grid: {
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
          },
          chat: {
            gridTemplateColumns: "1fr",
            gap: 0,
          },
        }}
        transition={{
          duration: 0.6,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
} 