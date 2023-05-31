"use client";
import { motion } from "framer-motion";

export default function UserRepos(props: any) {
  const { repo } = props;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ opacity: { delay: 0.21 } }}
      whileTap={{ scale: 0.99, transition: { delay: 0 } }}
      className="mb-3 mx-3 md:mx-6 p-3 md:p-6  rounded-xl bg-white cursor-pointer"
      onClick={() => {
        window.open(repo.html_url, "_blank");
      }}
    >
      <div className="font-medium text-sm break-words">{repo.name}</div>
      {repo.description && (
        <div className="text-xs mt-1 text-gray-500 break-words">
          {repo.description}
        </div>
      )}

      <div className="flex flex-row items-center mt-2">
        {repo.language && (
          <div className="flex flex-row items-center mr-3">
            <div className="text-xs text-gray-500 border border-gray-200 rounded-full py-1 px-2">
              {repo.language}
            </div>
          </div>
        )}
        <div className="flex flex-row items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 text-gray-500"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            {" "}
            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />{" "}
          </svg>
          <div className="text-xs text-gray-500 mt-1 ml-1">
            {repo.stargazers_count}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
