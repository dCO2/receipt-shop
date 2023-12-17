import Logo from "@/components/Logo";
import MenuGuide from "@/components/MenuGuide";
import ToggleTheme from "@/components/ToggleTheme";
import React, { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-fit">
      <nav className="flex items-center justify-between p-4 border-b border-solid">
        <div className="flex items-center justify-between gap-2">
          <MenuGuide/>
          <Logo/>
        </div>
        <div className="flex justify-between gap-2">
          <ToggleTheme/>
        </div>
      </nav>
      <main className="flex w-full flex-grow h-full p-4 items-center justify-center">{children}</main>
    </div>
  );
}

export default Layout;
