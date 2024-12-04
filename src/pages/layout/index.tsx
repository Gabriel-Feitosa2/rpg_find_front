import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

function Layout() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full h-full">
          <SidebarTrigger />
          <Outlet />
          <Analytics />
        </main>
      </SidebarProvider>
    </>
  );
}

export default Layout;
