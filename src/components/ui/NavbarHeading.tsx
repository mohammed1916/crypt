"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function NavbarHeading() {
  const pathname = usePathname();
  // You can add more logic here for other routes if needed
  // For now, just show the default heading for the homepage
  return (
    <div id="navbar-heading" className="text-2xl font-bold">
      {pathname === "/" ? "Cryptocurrency Prices" : ""}
    </div>
  );
}
