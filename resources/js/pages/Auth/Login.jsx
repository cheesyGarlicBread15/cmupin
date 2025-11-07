import Checkbox from '@/components/Checkbox';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back</h2>
                <p className="mt-2 text-sm text-gray-600">Sign in to your account to continue</p>
            </div>

            {status && (
                <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-4">
                    <div className="flex items-center">
                        <i className="ti ti-circle-check text-green-600 text-xl mr-2"></i>
                        <p className="text-sm font-medium text-green-800">{status}</p>
                    </div>
                </div>
            )}

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
                            className="block w-full pl-10"
                            placeholder="you@example.com"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" />
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
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <div>
                    <PrimaryButton
                        className="w-full justify-center py-3 text-base font-semibold"
                        disabled={processing}
                    >
                        {processing ? (
                            <span className="flex items-center">
                                <i className="ti ti-loader-2 animate-spin mr-2"></i>
                                Signing in...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <i className="ti ti-login mr-2"></i>
                                Sign in
                            </span>
                        )}
                    </PrimaryButton>
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-100 text-gray-500">Don't have an account?</span>
                    </div>
                </div>

                <div>
                    <Link
                        href={route('register')}
                        className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <i className="ti ti-user-plus mr-2"></i>
                        Create an account
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}