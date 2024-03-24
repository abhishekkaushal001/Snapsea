"use client";

import Button from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { GiBigWave } from "react-icons/gi";

const LoginPage = () => {
  const [isLoading, setLoading] = useState(false);

  async function loginWithGoogle() {
    setLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-screen w-full flex flex-col items-center justify-start pt-20">
        <div className="flex flex-col items-center justify-start text-center m-4">
          <div className="">
            <GiBigWave className="h-16 w-auto text-slate-800 rounded-full" />
          </div>
          <div className="mt-14 font-bold text-4xl tracking-tight text-gray-900">
            Sign in to your Account
          </div>
          <Button
            isLoading={isLoading}
            className="mt-10 w-full"
            type="button"
            onClick={loginWithGoogle}
          >
            {!isLoading && (
              <svg
                className="h-5 w-5 mr-2"
                focusable="false"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
            )}
            Google
          </Button>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
