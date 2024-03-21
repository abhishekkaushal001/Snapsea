"use client";

import React, { useState } from "react";
import Button from "./Button";
import { Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

const SignOutButton = () => {
  const [siginingOut, setSignOut] = useState(false);
  return (
    <Button
      variant="ghost"
      className="aspect-square h-full outline-none"
      onClick={async () => {
        setSignOut(true);
        try {
          await signOut({ callbackUrl: "/" });
        } catch (error) {
          toast.error("There was a problem signing out.");
        } finally {
          setSignOut(true);
        }
      }}
    >
      {siginingOut ? (
        <Loader2 className="animate-spin h-4 w-4" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
    </Button>
  );
};

export default SignOutButton;
