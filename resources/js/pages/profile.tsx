import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Dropzone from 'react-dropzone';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FormGroup } from '@/components/ui/form-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Calendar, CameraIcon, Lock, Mail, Phone, User } from 'lucide-react';
import { toast } from 'sonner';

import { Checkbox } from '@/components/ui/checkbox';
import { FormMessage } from '@/components/ui/form-message';
import { dateFormat, getInitials } from '@/lib/formatters';
import { BreadcrumbItem, ErrorResponse, SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Profile',
        href: '/dashboard',
    },
];

export default function Profile() {
    // const { status, error } = usePage<SharedData>().props;
    // useEffect(() => {
    //     if (status) {
    //         toast.success(status);
    //         router.reload();
    //     }
    //     if (error) {
    //         toast.error(error);
    //     }
    // }, [status, error]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile" />
            <div className="h-full flex-1 flex-col gap-4 space-y-6 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Profile</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Manage your personal information and settings</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <ProfileSideBar />
                    <PersonalInformation />
                </div>
            </div>
        </AppLayout>
    );
}

function ProfileSideBar() {
    const {
        member: { photo, name, member_no, contact, registration_date },
        app: { url },
    } = usePage<SharedData>().props;

    return (
        <Card className="self-start p-6 text-center">
            <div className="flex flex-col items-center justify-center gap-2">
                <Avatar className="size-24">
                    <AvatarImage src={photo ? `${url}${photo}` : undefined} />
                    <AvatarFallback className="text-4xl">{getInitials(name)}</AvatarFallback>
                </Avatar>
                <Dropzone
                    onDrop={(acceptedFiles) => {
                        if (!acceptedFiles.length) return;
                        router.post(
                            '/profile/photo',
                            {
                                _method: 'patch',
                                photo: acceptedFiles[0],
                            },
                            {
                                forceFormData: true,
                                onSuccess: () => {
                                    toast.success('Profile photo updated successfully');
                                    router.reload();
                                },
                                onError: (errors: ErrorResponse) => {
                                    if (errors.response?.props?.error) {
                                        toast.error(errors.response.props.error);
                                    } else {
                                        toast.error('An unexpected error occurred. Please try again.');
                                    }
                                },
                            },
                        );
                    }}
                    disabled={false}
                    maxFiles={1}
                    multiple={true}
                    onError={(err) => toast.error(err.message)}
                    accept={{
                        'image/png': ['.png'],
                        'image/jpeg': ['.jpeg'],
                        'image/jpg': ['.jpg'],
                    }}
                    onDropRejected={() => toast.error('Invalid file type')}
                >
                    {({ getRootProps, getInputProps, isDragActive }) => (
                        <div
                            {...getRootProps({
                                className: 'dropzone rounded-md text-center',
                            })}
                        >
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <p className="text-muted-foreground text-sm">Drop the files here ...</p>
                            ) : (
                                <div className="flex flex-col items-center justify-center">
                                    <Button variant="outline" size="sm">
                                        <CameraIcon className="mr-2 h-4 w-4" />
                                        Change Picture
                                    </Button>
                                    {/* <p className="text-muted-foreground text-xs">PNG,JPG or JPEG (MAX: 2MB)</p> */}
                                </div>
                            )}
                        </div>
                    )}
                </Dropzone>
            </div>
            <h2 className="mt-2 text-xl font-bold">{name}</h2>
            <div className="border-t border-gray-100 pt-6">
                <div className="space-y-4 text-left">
                    <div className="flex items-center text-gray-700">
                        <User size={18} className="mr-2 text-gray-500" />
                        <span>Member #{member_no}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <Calendar size={18} className="mr-2 text-gray-500" />
                        <span>Joined {dateFormat(registration_date, 'long')}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <Phone size={18} className="mr-2 text-gray-500" />
                        <span>{contact}</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}

function PersonalInformation() {
    const [selectedTab, setSelectedTab] = useState(new URLSearchParams(window.location.search).get('tab') || 'personal');
    const [isEditing, setIsEditing] = useState(false);

    const handleTabChange = (tab: string) => {
        setSelectedTab(tab);
        router.replace({});
    };
    return (
        <div className="lg:col-span-2">
            <Card>
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex">
                        <button
                            className={`border-b-2 px-6 py-4 text-sm font-medium transition-colors ${
                                selectedTab === 'personal'
                                    ? 'border-blue-800 text-blue-800'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            }`}
                            onClick={() => handleTabChange('personal')}
                        >
                            Personal Information
                        </button>
                        <button
                            className={`border-b-2 px-6 py-4 text-sm font-medium transition-colors ${
                                selectedTab === 'security'
                                    ? 'border-blue-800 text-blue-800'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            }`}
                            onClick={() => handleTabChange('security')}
                        >
                            Security
                        </button>
                    </nav>
                </div>

                {selectedTab === 'personal' && <Information isEditing={isEditing} onSetEditing={setIsEditing} />}

                {selectedTab === 'security' && <Security />}
            </Card>
        </div>
    );
}

function Information({ isEditing, onSetEditing }: { isEditing: boolean; onSetEditing: (editing: boolean) => void }) {
    const {
        member: { name, email, contact, date_of_birth },
    } = usePage<SharedData>().props;
    const { data, setData, errors, processing, patch } = useForm({
        name,
        email: email || '',
        contact,
        date_of_birth: date_of_birth || '',
    });

    return (
        <CardContent className="py-6">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    patch('/profile/details', {
                        onSuccess: (page) => {
                            if (page.props.error) {
                                toast.error(page.props.error as string);
                                return;
                            }
                            toast.success('Profile updated successfully');
                            onSetEditing(false);
                        },
                    });
                }}
            >
                <div className="mb-6 flex items-center justify-end">
                    {!isEditing && (
                        <Button type="button" variant="outline" size="sm" onClick={() => onSetEditing(true)}>
                            Edit
                        </Button>
                    )}
                </div>

                <div className="space-y-4">
                    <FormGroup>
                        <Label>Full Name</Label>
                        <Input
                            Icon={<User className="text-muted-foreground size-4" />}
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={!isEditing || processing}
                            required
                        />
                        {errors.name && <FormMessage message={errors.name} />}
                    </FormGroup>
                    <FormGroup>
                        <Label>Phone No</Label>
                        <Input
                            name="contact"
                            Icon={<Phone className="text-muted-foreground size-4" />}
                            value={data.contact}
                            onChange={(e) => setData('contact', e.target.value)}
                            disabled={!isEditing || processing}
                            required
                        />
                        {errors.contact && <FormMessage message={errors.contact} />}
                    </FormGroup>
                    <FormGroup>
                        <Label>Email</Label>
                        <Input
                            name="email"
                            Icon={<Mail className="text-muted-foreground size-4" />}
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={!isEditing || processing}
                        />
                        {errors.email && <FormMessage message={errors.email} />}
                    </FormGroup>
                    <FormGroup>
                        <Label>Date of Birth</Label>
                        <Input
                            Icon={<Calendar className="text-muted-foreground size-4" />}
                            name="date_of_birth"
                            type="date"
                            value={data.date_of_birth ? dateFormat(data.date_of_birth) : ''}
                            onChange={(e) => setData('date_of_birth', new Date(e.target.value))}
                            disabled={!isEditing || processing}
                            required
                        />
                        {errors.date_of_birth && <FormMessage message={errors.date_of_birth} />}
                    </FormGroup>
                </div>

                {isEditing && (
                    <div className="mt-6 flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={processing}
                            onClick={() => {
                                onSetEditing(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="default" disabled={processing}>
                            Save Changes
                        </Button>
                    </div>
                )}
            </form>
        </CardContent>
    );
}

function Security() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, reset, put, errors, setData, processing } = useForm({
        oldPassword: '',
        newPassword: '',
        newPasswordConfirmation: '',
    });
    return (
        <CardContent className="py-6">
            <form
                onSubmit={() => {
                    put('/profile/password', {
                        onSuccess: (page) => {
                            if (page.props.error) {
                                toast.error(page.props.error as string);
                                return;
                            }
                            toast.success('Password updated successfully');
                            reset();
                        },
                    });
                }}
            >
                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                    <p className="mt-1 text-sm text-gray-500">Ensure your account is using a strong password for security</p>
                </div>

                <div className="space-y-4">
                    <FormGroup>
                        <Label>Current Password</Label>
                        <Input
                            Icon={<Lock className="text-muted-foreground size-4" />}
                            name="oldPassword"
                            type={showPassword ? 'text' : 'password'}
                            value={data.oldPassword}
                            onChange={(e) => setData('oldPassword', e.target.value)}
                            disabled={processing}
                            required
                        />
                        {errors.oldPassword && <FormMessage message={errors.oldPassword} />}
                    </FormGroup>
                    <FormGroup>
                        <Label>New Password</Label>
                        <Input
                            Icon={<Lock className="text-muted-foreground size-4" />}
                            name="newPassword"
                            type={showPassword ? 'text' : 'password'}
                            value={data.newPassword}
                            onChange={(e) => setData('newPassword', e.target.value)}
                            disabled={processing}
                            required
                        />
                        {errors.newPassword && <FormMessage message={errors.newPassword} />}
                    </FormGroup>
                    <FormGroup>
                        <Label>Confirm Password</Label>
                        <Input
                            Icon={<Lock className="text-muted-foreground size-4" />}
                            name="newPasswordConfirmation"
                            type={showPassword ? 'text' : 'password'}
                            value={data.newPasswordConfirmation}
                            onChange={(e) => setData('newPasswordConfirmation', e.target.value)}
                            disabled={processing}
                            required
                        />
                        {errors.newPasswordConfirmation && <FormMessage message={errors.newPasswordConfirmation} />}
                    </FormGroup>
                </div>
                <div className="mt-6 flex items-center justify-between space-x-3">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="showPassword" onCheckedChange={(value) => setShowPassword(!!value)} />
                        <label
                            htmlFor="showPassword"
                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Show Password
                        </label>
                    </div>
                    <Button type="submit" variant="default">
                        Update Password
                    </Button>
                </div>
            </form>
        </CardContent>
    );
}
