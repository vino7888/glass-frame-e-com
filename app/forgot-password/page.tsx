import Navbar from '@/components/shared/Navbar';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <ForgotPasswordForm />
      </div>
    </>
  );
}
