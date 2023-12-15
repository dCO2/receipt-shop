import Logo from '@/components/Logo';
import MenuGuide from '@/components/MenuGuide';
import ToggleTheme from '@/components/ToggleTheme';
import { UserButton } from '@clerk/nextjs';
import React, { ReactNode } from 'react';

function Layout({children}: {children: ReactNode}) {
  return (
    <div>
      <nav className="flex items-center justify-between p-4 border-b border-solid">
        <div className="flex items-center justify-between gap-2">
          <MenuGuide/>
          <Logo/>
        </div>
        <div className="flex justify-between gap-2">
          <ToggleTheme/>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
      <main className="">{children}</main>
    </div>
  )
}

export default Layout;