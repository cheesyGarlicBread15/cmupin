import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
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
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <>
            <Head title="Register" />

            <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
                <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
                    {/* Logo */}
                    <div className="text-3xl font-bold text-center">
                        <span className="text-white">CMU</span>
                        <span className="text-red-500">Pin</span>
                    </div>

                    <h1 className="text-xl font-semibold text-gray-100 text-center">
                        Create Account
                    </h1>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-gray-100 focus:border-red-500 focus:ring focus:ring-red-500 focus:ring-opacity-30"
                                autoComplete="name"
                                isFocused
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-1 text-red-400" />
                        </div>

                        <div>
                            <InputLabel htmlFor="phone_number" value="Phone Number" />
                            <TextInput
                                id="phone_number"
                                name="phone_number"
                                value={data.phone_number}
                                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-gray-100 focus:border-red-500 focus:ring focus:ring-red-500 focus:ring-opacity-30"
                                autoComplete="phone_number"
                                onChange={(e) => setData('phone_number', e.target.value)}
                                required
                            />
                            <InputError message={errors.phone_number} className="mt-1 text-red-400" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-gray-100 focus:border-red-500 focus:ring focus:ring-red-500 focus:ring-opacity-30"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
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
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-1 text-red-400" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-gray-100 focus:border-red-500 focus:ring focus:ring-red-500 focus:ring-opacity-30"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-1 text-red-400" />
                        </div>

                        <PrimaryButton
                            type="submit"
                            className="w-full py-2 text-white text-lg font-medium rounded-md bg-red-600 hover:bg-red-500 focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                            disabled={processing}
                        >
                            Register
                        </PrimaryButton>

                        <p className="text-sm text-gray-400 text-center">
                            Already registered?{' '}
                            <Link
                                href={route('login')}
                                className="text-red-400 hover:text-red-300 font-medium"
                            >
                                Log in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}
