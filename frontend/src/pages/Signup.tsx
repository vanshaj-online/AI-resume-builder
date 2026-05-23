import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuthStore } from '../store/authStore';

interface SignupFormValues {
    name: string;
    email: string;
    password: string;
}

export const Signup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>();
    const { isLoading, error, signup } = useAuthStore();
    const navigate = useNavigate();

    const onSubmit = async (data: SignupFormValues) => {
        try {
            await signup(data);
            navigate('/dashboard');
        } catch {
            console.log('error creating account')
        }
    };

    return (
        <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-canvas-soft rounded-xl p-8 shadow-sm">
                <h1 className="text-3xl font-display font-bold text-ink mb-2">Create an account</h1>
                <p className="text-body mb-8">Enter your details to access your resumes.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <Input
                        label="Name"
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        error={errors.name?.message as string}
                        className='bg-white'
                    />

                    <Input
                        label="Email"
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        error={errors.email?.message as string}
                        className='bg-white'
                    />
                    <Input
                        label="Password"
                        type="password"
                        {...register('password', { required: 'Password is required' })}
                        error={errors.password?.message as string}
                        className='bg-white'
                    />

                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
                        Sign Up
                    </Button>
                </form>

                <p className="mt-6 text-center text-body text-sm">
                    Already have an account? <Link to="/login" className="text-ink font-medium underline hover:text-primary">Log in</Link>
                </p>
            </div>
        </div>
    );
};