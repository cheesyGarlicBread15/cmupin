import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Create an account</h2>
                <p className="mt-2 text-sm text-gray-600">Join CMUPin to stay updated on crisis management</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                
                <div>
                    <InputLabel htmlFor="name" value="Full Name" />
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="ti ti-user text-gray-400 text-lg"></i>
                        </div>
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="block w-full pl-10"
                            placeholder="John Doe"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.name} className="mt-2" />
                </div>

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
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="phone_number" value="Phone Number" />
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="ti ti-phone text-gray-400 text-lg"></i>
                        </div>
                        <TextInput
                            id="phone_number"
                            name="phone_number"
                            value={data.phone_number}
                            className="block w-full pl-10"
                            placeholder="+63 912 345 6789"
                            autoComplete="tel"
                            onChange={(e) => setData('phone_number', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.phone_number} className="mt-2" />
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
                            placeholder="Create a strong password"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="ti ti-lock-check text-gray-400 text-lg"></i>
                        </div>
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="block w-full pl-10"
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
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
                                Creating account...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <i className="ti ti-user-plus mr-2"></i>
                                Create account
                            </span>
                        )}
                    </PrimaryButton>
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-100 text-gray-500">Already have an account?</span>
                    </div>
                </div>

                <div>
                    <Link
                        href={route('login')}
                        className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <i className="ti ti-login mr-2"></i>
                        Sign in instead
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}