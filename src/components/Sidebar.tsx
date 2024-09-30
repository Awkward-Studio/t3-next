"use client";

import React, { useState } from "react";
import Image from "next/image";
import logo from "../../public/assets/Logomark.png";
import loader from "../../public/assets/t3-loader.gif";
// import { Home01Icon, Layers01Icon, Logout04Icon } from "hugeicons-react";
import { House, Layers3, LogOut } from "lucide-react";

import { useRouter } from "next/navigation";
import { logoutUser } from "@/app/lib/appwrite";
import { deleteCookie } from "cookies-next";
import Link from "next/link";

export default function Sidebar({ home }: any) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const router = useRouter();

  const logout = async () => {
    setIsLoggingOut((prev) => true);
    await logoutUser();
    deleteCookie("user");
    router.push("/");
    setIsLoggingOut((prev) => false);
  };

  return (
    <div className="sticky top-0 shadow-xl p-6 flex flex-col h-dvh bg-gray-50 min-w-[80px] items-center py-8">
      <div className="mb-10">
        <Image src={logo} width={50} height={50} alt="Logo" />
      </div>
      <div className="flex flex-col h-full justify-between">
        <div className="flex flex-col space-y-5">
          <Link className="border-2 rounded-md shadow-md p-3" href={home}>
            <House />
          </Link>
          <Link
            className="border-2 rounded-md shadow-md p-3"
            href={`${home}/parts-inventory`}
          >
            <Layers3 />
          </Link>
        </div>
        <div>
          <button
            onClick={logout}
            className={`border-2 rounded-md shadow-md ${
              isLoggingOut ? "opacity-50 p-1" : "p-3"
            }`}
          >
            {isLoggingOut ? (
              <Image src={loader} width={50} height={50} alt="Logo" />
            ) : (
              <LogOut />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
