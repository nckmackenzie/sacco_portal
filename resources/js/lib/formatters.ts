import { format } from 'date-fns';

type DateFormattingType = 'reporting' | 'long' | 'regular';

export function getInitials(fullName: string) {
    const names = fullName.split(' ');
    if (names.length < 2) {
        return fullName.charAt(0).toUpperCase();
    }
    const initials = names[0].charAt(0) + names[names.length - 1].charAt(0);
    return initials.toUpperCase();
}

export const dateFormat = (date: Date | string, formattingType: DateFormattingType = 'regular') => {
    if (formattingType === 'reporting') {
        return format(new Date(date), 'dd/MM/yyyy');
    } else if (formattingType === 'long') {
        return format(new Date(date), 'dd MMM yyyy');
    }
    return format(new Date(date), 'yyyy-MM-dd');
};
