import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { getInitials } from '@/lib/formatters';
import { SharedData, type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const {
        auth: {
            user: { name },
        },
        member: { member_no, photo },
    } = usePage<SharedData>().props;

    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex w-full items-center justify-between gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link href="/profile" className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={photo ?? undefined} />
                        <AvatarFallback>{getInitials(name)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-gray-700">{name}</p>
                        <p className="text-xs text-gray-500">Member #{member_no}</p>
                    </div>
                </Link>
            </div>
        </header>
    );
}
