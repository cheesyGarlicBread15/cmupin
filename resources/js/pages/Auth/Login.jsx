import Checkbox from '@/components/Checkbox';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head title="Log in" />

            <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
                <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
                    {/* Logo */}
                    <div className="text-3xl font-bold text-center">
                        <span className="text-white">CMU</span>
                        <span className="text-red-500">Pin</span>
                    </div>

                    <h1 className="text-xl font-semibold text-gray-100 text-center">
                        Welcome Back
                    </h1>

                    {status && (
                        <div className="text-sm text-red-400 text-center">{status}</div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-gray-100 focus:border-red-500 focus:ring focus:ring-red-500 focus:ring-opacity-30"
                                autoComplete="username"
                                isFocused
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-1 text-red-400" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-gray-100 focus:border-red-500 focus:ring focus:ring-red-500 focus:ring-opacity-30"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-1 text-red-400" />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="text-sm text-gray-400">Remember me</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-red-400 hover:text-red-300"
                                >
                                    Forgot your password?
                                </Link>
                            )}
                        </div>

                        <PrimaryButton
                            type="submit"
                            className="w-full py-2 text-white text-lg font-medium rounded-md bg-red-600 hover:bg-red-500 focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                            disabled={processing}
                        >
                            Log in
                        </PrimaryButton>

                        <p className="text-sm text-gray-400 text-center">
                            Don’t have an account?{' '}
                            <Link
                                href={route('register')}
                                className="text-red-400 hover:text-red-300 font-medium"
                            >
                                Register
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}
