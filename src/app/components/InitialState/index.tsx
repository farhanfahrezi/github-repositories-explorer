"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function InitialState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-1 flex-col items-center justify-center overflow-hidden"
    >
      <Image
        src="/initial-state.png"
        alt="Initial State Image"
        width={0}
        height={0}
        sizes="100vh"
        style={{
          display: "flex",
          flex: 1,
          width: "auto",
          maxWidth: "320px",
          height: "auto",
          maxHeight: "320px",
        }}
      />
      <div className="mt-6 mb-12 mx-6 text-md md:text-xl text-gray-600 text-center max-w-96">
        To get started, enter a username in the search box above.
      </div>
    </motion.div>
  );
}
