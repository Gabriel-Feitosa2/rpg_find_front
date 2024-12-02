import { Home, Inbox, LibraryBig } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

// Menu items.
const items = [
  {
    title: "Find",
    url: "/",
    icon: Home,
  },
  {
    title: "All",
    url: "/all",
    icon: LibraryBig,
  },
  {
    title: "Suggest Book",
    url: "/suggestBook",
    icon: Inbox,
  },
];

export function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <Link to={item.url} key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={pathname === item.url ? "bg-neutral-600" : ""}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
