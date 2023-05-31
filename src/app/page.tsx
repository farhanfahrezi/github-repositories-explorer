"use client";
import { useRef, useState } from "react";
import { Octokit } from "octokit";
import { motion } from "framer-motion";

import UserList from "./components/UserList";
import InitialState from "./components/InitialState";
import EmptyState from "./components/EmptyState";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  let _input = useRef<HTMLInputElement>(null);

  const submit = async (e: any) => {
    e.preventDefault();
    if (loading) {
      return;
    }
    let username = e.target[0].value.replace(/\s+$/, "");
    if (!username) {
      setUsers([]);
      setTotal(null);
      return;
    }
    setKeyword(username);
    setLoading(true);
    const user = await octokit.request("GET /search/users?q={username}", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      username,
      per_page: 5,
    });
    setUsers([]);
    setTimeout(() => {
      setUsers(user.data.items);
    }, 1);
    setTotal(user.data.total_count);
    setLoading(false);
  };

  return (
    <main className="flex h-full max-h-[-webkit-fill-available] flex-col p-3 md:p-16 bg-[url('/bg.jpg')] bg-no-repeat bg-cover bg-center duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col flex-1 bg-blur backdrop-blur-xl bg-white/50 rounded-3xl border-4 border-white shadow-2xl overflow-hidden"
      >
        <div className="p-3 md:p-6 bg-white/50 rounded-t-xl">
          <div className="flex justify-between mb-4 px-4">
            <h1 className="text-lg md:text-xl font-medium text-gray-900">
              Github Repositories Explorer
            </h1>
            <code className="hidden md:block text-sm text-gray-900">
              Created by Farhan Fahrezi
            </code>
          </div>

          <form className="group relative" onSubmit={submit}>
            <div className="flex">
              <div className="flex flex-1 mr-4">
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="absolute left-3 md:left-5 top-1/2 -mt-2.5 text-slate-400 pointer-events-none group-focus-within:text-blue-500"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  />
                </svg>
                <input
                  ref={_input}
                  className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-md leading-6 text-gray-900 placeholder-gray-400 py-3 pl-10 md:pl-14 ring-1 ring-slate-200 shadow-sm rounded-full"
                  type="text"
                  aria-label="Search GitHub Users"
                  placeholder="Search GitHub Users..."
                  onChange={(e) => {
                    e.target.value = e.target.value
                      .replace(/^\s+/, "")
                      .replace(/\s{2,}/, " ");
                  }}
                />
              </div>
              <button className="flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 w-20 md:w-32 shadow-sm active:scale-[0.97] duration-100">
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  "Search"
                )}
              </button>
            </div>
          </form>
        </div>

        {total && total > -1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: loading ? 0 : 1 }}
            className="flex flex-col flex-1 p-3 md:p-6 pb-0 md:pb-3 text-gray-900 overflow-y-scroll scrollbar-hide"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm md:text-md font-medium">
                Showing users for "{keyword}"
              </span>
              <button
                className="text-sm text-blue-400 hover:text-blue-500 focus:outline-none"
                onClick={() => {
                  setUsers([]);
                  setTotal(null);
                  if (_input?.current) {
                    _input.current.value = "";
                  }
                }}
              >
                Clear
              </button>
            </div>
            {users.map((user, index) => (
              <UserList key={user.id} user={user} index={index} />
            ))}
          </motion.div>
        )}

        {total === null && <InitialState />}
        {total === 0 && <EmptyState />}
      </motion.div>
    </main>
  );
}
