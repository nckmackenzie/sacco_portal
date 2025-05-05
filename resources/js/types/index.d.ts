import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface IdWithName {
    id: string;
    name: string;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    app: {
        name: string;
        url: string;
    };
    member: Member;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
    status: string | null;
    error: string | null;
}

export interface User extends IdWithName {
    contact: string;
    email: string | null;
}

export interface Member extends IdWithName {
    member_no: number;
    contact: string;
    date_of_birth: Date;
    photo: string | null;
    email: string | null;
    registration_date: Date;
}

type ErrorResponse = {
    response?: {
        props?: {
            error?: string;
        };
    };
};
