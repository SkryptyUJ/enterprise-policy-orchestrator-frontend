"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth, Role } from "@/features/auth/hooks/useAuth"
import { LayoutDashboard, FileText, FilePlus, LogOut, ArrowLeftRight, ChevronRight, Settings, List } from "lucide-react"
import Link from "next/link"

type NavItem = {
    title: string;
    url: string;
    icon: React.ElementType;
    roles?: Role[];
}

type NavGroup = {
    title: string;
    items: NavItem[];
}

const MENU_CONFIG: NavGroup[] = [
    {
        title: "Główne",
        items: [
            {
                title: "Dashboard",
                url: "/dashboard",
                icon: LayoutDashboard,
            }
        ]
    },
    {
        title: "Wydatki",
        items: [
            {
                title: "Nowy wniosek",
                url: "/expense-request/new",
                icon: ArrowLeftRight,
                roles: ["employee"]
            },
            {
                title: "Historia wnioskow",
                url: "/expense-request/history",
                icon: List,
                roles: ["employee", "manager", "admin"]
            }
        ]
    },
    {
        title: "Polityki",
        items: [
            {
                title: "Wszystkie polityki",
                url: "/policy/all",
                icon: FileText,
                roles: ["admin", "manager", "employee"]
            },
            {
                title: "Nowa polityka",
                url: "/policy/new",
                icon: FilePlus,
                roles: ["admin"]
            }
        ]
    },
    {
        title: "Konto",
        items: [
            {
                title: "Ustawienia",
                url: "/settings",
                icon: Settings,
            },
            {
                title: "Wyloguj się",
                url: "/api/auth/logout",
                icon: LogOut,
            }
        ]
    }
]

function AnimatedNavGroup({ group }: { group: NavGroup }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <SidebarGroup className="border-b border-border/50 last:border-b-0 pb-3 p-2">
            <SidebarGroupLabel asChild>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex w-full items-center justify-between outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground px-2 py-1.5 rounded-md transition-colors cursor-pointer"
                >
                    <span className="font-medium text-sm text-sidebar-foreground/70">{group.title}</span>
                    <motion.div
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <ChevronRight className="size-4 text-sidebar-foreground/50" />
                    </motion.div>
                </button>
            </SidebarGroupLabel>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <SidebarGroupContent className="pt-2">
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            {item.url.startsWith('/api') ? (
                                                <a href={item.url}>
                                                    <item.icon className="size-4" />
                                                    <span>{item.title}</span>
                                                </a>
                                            ) : (
                                                <Link href={item.url}>
                                                    <item.icon className="size-4" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            )}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </SidebarGroup>
    )
}

export function AppSidebar() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    const filteredNavGroups = MENU_CONFIG.map(group => {
        return {
            ...group,
            items: group.items.filter(item => {
                if (!item.roles) return true;
                if (!user) return false;
                return item.roles.some((role) => user.roles.includes(role));
            })
        }
    }).filter(group => group.items.length > 0);

    return (
        <Sidebar>
            <SidebarHeader className="h-16 flex items-center border-b px-4 shrink-0">
                <span className="font-bold tracking-tight">Policy Orchestrator</span>
            </SidebarHeader>

            <SidebarContent className="gap-0 py-2">
                {filteredNavGroups.map((group) => (
                    <AnimatedNavGroup key={group.title} group={group} />
                ))}
            </SidebarContent>
        </Sidebar>
    )
}
