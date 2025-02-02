import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="w-2 h-2 bg-gray-500 rounded-full"
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.3,
          }}
        />
      ))}
    </div>
  );
};

export default Loading;
