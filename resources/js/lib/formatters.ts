export function getInitials(fullName: string) {
    const names = fullName.split(' ');
    if (names.length < 2) {
        return fullName.charAt(0).toUpperCase();
    }
    const initials = names[0].charAt(0) + names[names.length - 1].charAt(0);
    return initials.toUpperCase();
}
