import PrimaryButton from '@/components/PrimaryButton';
import GuestLayout from '@/layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Verify your email</h2>
                <p className="mt-2 text-sm text-gray-600">
                    We've sent a verification link to your email address
                </p>
            </div>

            <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
                <div className="flex items-start">
                    <i className="ti ti-mail-check text-blue-600 text-xl mr-2 mt-0.5"></i>
                    <div>
                        <p className="text-sm font-medium text-blue-800">Check your inbox</p>
                        <p className="text-sm text-blue-700 mt-1">
                            Click the verification link in your email to activate your account. 
                            Don't forget to check your spam folder!
                        </p>
                    </div>
                </div>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
                    <div className="flex items-start">
                        <i className="ti ti-circle-check text-green-600 text-xl mr-2 mt-0.5"></i>
                        <div>
                            <p className="text-sm font-medium text-green-800">Email sent successfully!</p>
                            <p className="text-sm text-green-700 mt-1">
                                A new verification link has been sent to your email address.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                
                <div>
                    <PrimaryButton
                        className="w-full justify-center py-3 text-base font-semibold"
                        disabled={processing}
                    >
                        {processing ? (
                            <span className="flex items-center">
                                <i className="ti ti-loader-2 animate-spin mr-2"></i>
                                Sending...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <i className="ti ti-mail-forward mr-2"></i>
                                Resend verification email
                            </span>
                        )}
                    </PrimaryButton>
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-100 text-gray-500">or</span>
                    </div>
                </div>

                <div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <i className="ti ti-logout mr-2"></i>
                        Log out
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}