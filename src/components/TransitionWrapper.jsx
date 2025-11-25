import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function TransitionWrapper({ children }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{
          duration: 0.25,
          ease: [0.22, 1, 0.36, 1] /* Apple-like spring easing */
        }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
