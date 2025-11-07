import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Confirm password</h2>
                <p className="mt-2 text-sm text-gray-600">
                    This is a secure area. Please confirm your password to continue.
                </p>
            </div>

            <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
                <div className="flex items-start">
                    <i className="ti ti-shield-lock text-blue-600 text-xl mr-2 mt-0.5"></i>
                    <div>
                        <p className="text-sm font-medium text-blue-800">Security verification required</p>
                        <p className="text-sm text-blue-700 mt-1">
                            For your protection, please verify your identity before accessing this area.
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-5">
                
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
                            isFocused={true}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <PrimaryButton
                        className="w-full justify-center py-3 text-base font-semibold"
                        disabled={processing}
                    >
                        {processing ? (
                            <span className="flex items-center">
                                <i className="ti ti-loader-2 animate-spin mr-2"></i>
                                Verifying...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <i className="ti ti-check mr-2"></i>
                                Confirm
                            </span>
                        )}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}