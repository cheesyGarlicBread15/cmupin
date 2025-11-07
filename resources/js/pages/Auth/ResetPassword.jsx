import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Set new password</h2>
                <p className="mt-2 text-sm text-gray-600">Create a strong password for your account</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                
                <div>
                    <InputLabel htmlFor="email" value="Email Address" />
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="ti ti-mail text-gray-400 text-lg"></i>
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full pl-10 bg-gray-50"
                            autoComplete="username"
                            readOnly
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="New Password" />
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="ti ti-lock text-gray-400 text-lg"></i>
                        </div>
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full pl-10"
                            placeholder="Create a strong password"
                            autoComplete="new-password"
                            isFocused={true}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                    <p className="mt-1 text-xs text-gray-500">
                        <i className="ti ti-info-circle mr-1"></i>
                        Use at least 8 characters with a mix of letters, numbers & symbols
                    </p>
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm New Password" />
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="ti ti-lock-check text-gray-400 text-lg"></i>
                        </div>
                        <TextInput
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="block w-full pl-10"
                            placeholder="Confirm your new password"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="pt-2">
                    <PrimaryButton
                        className="w-full justify-center py-3 text-base font-semibold"
                        disabled={processing}
                    >
                        {processing ? (
                            <span className="flex items-center">
                                <i className="ti ti-loader-2 animate-spin mr-2"></i>
                                Resetting password...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <i className="ti ti-check mr-2"></i>
                                Reset password
                            </span>
                        )}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}