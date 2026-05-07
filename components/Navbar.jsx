"use client";

import React from "react";
import Header from "@/components/Header";

export default function Navbar(props) {
  // Keep existing Header logic + API calls intact; this is a UI-level alias.
  return <Header {...props} />;
}

