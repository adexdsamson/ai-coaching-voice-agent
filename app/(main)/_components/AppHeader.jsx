import { UserButton } from "@stackframe/stack";
import Image from "next/image";
import React from "react";

function AppHeader() {
  return (
    <div className="p-4 shadow-sm flex items-center justify-between">
      <Image src={"/logo.svg"} alt="logo" height={150} width={150} />

      <UserButton />
    </div>
  );
}

export default AppHeader;
