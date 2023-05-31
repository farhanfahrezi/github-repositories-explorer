"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Octokit } from "octokit";
import Skeleton from "react-loading-skeleton";
import UserRepos from "../UserRepo";

import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export default function UserList(props: any) {
  const { user, index } = props;
  const [expanded, setExpanded] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [userRepos, setUserRepos] = useState<any>(null);
  const [reposPage, setReposPage] = useState<number>(1);
  const [canNext, setCanNext] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (expanded && !userRepos) {
      getUserRepos();
    }
  }, [expanded]);

  const getUser = async () => {
    const _user = await octokit.request("GET /users/{username}", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      username: user.login,
    });
    setUserData(_user.data);
  };

  const getUserRepos = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const repos = await octokit.request("GET /users/{username}/repos", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      username: user.login,
      per_page: 100,
      page: reposPage,
    });
    if (repos.data.length === 100) {
      setCanNext(true);
      setReposPage(reposPage + 1);
    } else {
      setCanNext(false);
    }
    setLoading(false);
    setUserRepos(userRepos ? [...userRepos, ...repos.data] : repos.data);
  };

  return (
    <motion.div
      initial={{ translateY: -50, opacity: 0 }}
      animate={{
        translateY: 0,
        opacity: 1,
        transition: { delay: 0.2 * index, duration: 0.2 },
      }}
      className="mb-3"
    >
      <motion.div
        className="flex p-3 md:p-6 rounded-xl cursor-pointer bg-white items-center justify-between z-10"
        whileTap={{
          backgroundColor: "rgba(255,255,255,.6)",
          transition: { delay: 0 },
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-4">
          <Image
            className="w-10 h-10 rounded-full"
            width={40}
            height={40}
            src={user.avatar_url}
            alt="User Avatar"
          />
          <div className="font-normal">
            <div>{userData ? userData?.name || "-" : <Skeleton />}</div>
            <div className="text-sm text-gray-500">@{user.login}</div>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          className={`scale-125 duration-300 mx-2 ${
            expanded ? "rotate-180" : ""
          }`}
        >
          <path
            fillRule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
          />{" "}
        </svg>
      </motion.div>

      {expanded && (
        <motion.div
          initial={{ minHeight: 0, height: 0, opacity: 0, translateY: -5 }}
          animate={{
            minHeight: 100,
            height: userRepos ? "auto" : 100,
            opacity: 1,
            translateY: 0,
          }}
          className={`${
            userRepos && "h-[fit-content !important] pt-6 pb-1 md:pb-3"
          } relative mt-[-10px] rounded-b-xl bg-blur bg-white/50`}
        >
          {userRepos ? (
            <div>
              <div className="flex items-center justify-between px-6 md:px-8 mb-3">
                <div className="font-medium">Repositories</div>
              </div>
              {userRepos.map((repo: any) => (
                <UserRepos key={repo.id} repo={repo} />
              ))}
              {canNext && (
                <div className="flex justify-center">
                  <button
                    className="mx-3 md:mx-6 rounded-xl bg-white px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 w-full transition duration-300 ease-in-out"
                    onClick={() => getUserRepos()}
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-blue-500 mx-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      "Load More"
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <motion.svg
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="absolute mt-10 left-0 right-0 animate-spin h-6 w-6 text-blue-500 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </motion.svg>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
