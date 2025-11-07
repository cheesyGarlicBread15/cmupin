import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Reset password</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Enter your email and we'll send you a link to reset your password
                </p>
            </div>

            {status && (
                <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-4">
                    <div className="flex items-start">
                        <i className="ti ti-circle-check text-green-600 text-xl mr-2 mt-0.5"></i>
                        <div>
                            <p className="text-sm font-medium text-green-800">Email sent successfully!</p>
                            <p className="text-sm text-green-700 mt-1">{status}</p>
                        </div>
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
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <PrimaryButton
                        className="w-full justify-center py-3 text-base font-semibold"
                        disabled={processing}
                    >
                        {processing ? (
                            <span className="flex items-center">
                                <i className="ti ti-loader-2 animate-spin mr-2"></i>
                                Sending link...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <i className="ti ti-mail-forward mr-2"></i>
                                Send reset link
                            </span>
                        )}
                    </PrimaryButton>
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-100 text-gray-500">Remember your password?</span>
                    </div>
                </div>

                <div>
                    <Link
                        href={route('login')}
                        className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <i className="ti ti-arrow-left mr-2"></i>
                        Back to login
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}