import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuthStore } from '../store/authStore';

type LoginForm = {
    email: string;
    password: string;
};

export const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
    const { login, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const onSubmit = async (data: LoginForm) => {
        try {
            await login(data);
            navigate('/dashboard');
        } catch {
            console.log('error logging in')
        }
    };

    return (
        <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-canvas-soft rounded-xl p-8 shadow-sm">
                <h1 className="text-3xl font-display font-bold text-ink mb-2">Welcome back</h1>
                <p className="text-body mb-8">Enter your details to access your resumes.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                        Log In
                    </Button>
                </form>

                <p className="mt-6 text-center text-body text-sm">
                    Don't have an account? <Link to="/signup" className="text-ink font-medium underline hover:text-primary">Sign up</Link>
                </p>
            </div>
        </div>
    );
};