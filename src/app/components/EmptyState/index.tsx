"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-1 flex-col items-center justify-center overflow-hidden"
    >
      <Image
        src="/empty-state.png"
        alt="Empty State Image"
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
      <div className="mt-6 mb-12 mx-6 text-md md:text-xl text-gray-600 text-center max-w-lg">
        Oops, we can't find any users with that keyword, please try again with
        another keyword.
      </div>
    </motion.div>
  );
}
