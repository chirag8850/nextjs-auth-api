"use client";
import { useState } from "react";

const useAuthState = () => {
  return ([useAuthState, setAuthState] = useState());
};

export default useAuthState;
