"use client";

import React, { PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children}
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default Providers;
