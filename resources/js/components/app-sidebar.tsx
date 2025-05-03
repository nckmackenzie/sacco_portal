import { NavMain } from '@/components/nav-main';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type NavItem } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Bell, CreditCard, LayoutGrid, LogOut, PiggyBank, User } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Deposits',
        href: '/deposits',
        icon: PiggyBank,
    },
    {
        title: 'Loans',
        href: '/loans',
        icon: CreditCard,
    },
    {
        title: 'Notifications',
        href: '/notifications',
        icon: Bell,
    },
    {
        title: 'Profile',
        href: '/profile',
        icon: User,
    },
];

export function AppSidebar() {
    const cleanup = useMobileNavigation();
    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };
    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                {/* <NavUser /> */}
                <Button variant="ghost" className="text-destructive hover:text-destructive w-full justify-start" asChild>
                    <Link className="block w-full" method="post" href={route('logout')} as="button" onClick={handleLogout}>
                        <LogOut className="mr-2" />
                        Log out
                    </Link>
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}
