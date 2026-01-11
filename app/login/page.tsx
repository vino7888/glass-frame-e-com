import Navbar from '@/components/shared/Navbar';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <LoginForm />
      </div>
    </>
  );
}
