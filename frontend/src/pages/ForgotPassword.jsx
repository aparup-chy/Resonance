import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import Navbar from '../components/Navbar';

function ForgotPassword() {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('email');
  const [emailAddress, setEmailAddress] = useState('');
  const navigate = useNavigate();

  const onSubmitEmail = async (data) => {
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: data.email });
      toast.success('OTP sent to your email');
      setEmailAddress(data.email);
      setStep('otp');
      reset({ email: data.email });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitOtp = async (data) => {
    setIsLoading(true);
    try {
      const resp = await api.post('/auth/verify-otp', {
        email: emailAddress,
        otp: data.otp
      });
      const { resetToken } = resp.data;
      toast.success('OTP verified. Please set your new password.');
      navigate(`/reset-password?token=${resetToken}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center text-white" style={{ backgroundImage: "url('piano-background.jpg')" }}>
      <Navbar showLogin={false} />
      <div className="flex-1 flex justify-center items-center px-4">
        <div className="bg-black/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/30 text-white">
          <h1 className="text-center text-3xl font-bold mb-8">Forgot Password</h1>

          {step === 'otp' ? (
            <form onSubmit={handleSubmit(onSubmitOtp)} className="flex flex-col gap-4">
              <p className="text-white/80 text-sm">
                Enter the 6-digit OTP sent to <span className="font-semibold">{emailAddress}</span>.
              </p>

              <div className="flex flex-col gap-2">
                <label htmlFor="otp" className="font-medium">OTP</label>
                <input
                  type="text"
                  id="otp"
                  maxLength={6}
                  {...register('otp', {
                    required: 'OTP is required',
                    pattern: {
                      value: /^\d{6}$/,
                      message: 'OTP must be 6 digits'
                    }
                  })}
                  className={`p-3 border rounded-md text-base bg-white/10 text-white placeholder-white/60 ${
                    errors.otp ? 'border-red-500' : 'border-white/30'
                  }`}
                  placeholder="Enter 6-digit OTP"
                />
                {errors.otp && <span className="text-red-400 text-sm font-semibold">{errors.otp.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-white text-black font-semibold p-3 rounded-md text-base cursor-pointer transition-colors hover:bg-gray-300 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onSubmitEmail)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-medium">Email Address</label>
                <input
                  type="email"
                  id="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`p-3 border rounded-md text-base bg-white/10 text-white placeholder-white/60 ${
                    errors.email ? 'border-red-500' : 'border-white/30'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && <span className="text-red-400 text-sm font-semibold">{errors.email.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-white text-black font-semibold p-3 rounded-md text-base cursor-pointer transition-colors hover:bg-gray-300 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          )}

          <div className="text-center mt-4">
            <Link to="/login" className="text-white/80 hover:text-white transition-colors">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
