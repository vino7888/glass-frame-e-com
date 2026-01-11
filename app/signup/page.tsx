import Navbar from '@/components/shared/Navbar';
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <SignupForm />
      </div>
    </>
  );
}
