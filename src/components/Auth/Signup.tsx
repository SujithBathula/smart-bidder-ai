import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function Signup() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signUp(email, password);
    if (error) {
      setError(error.message);
      setMessage('');
    } else {
      setError('');
      setMessage('Signup successful! Please check your email to confirm your account.');
      // Optionally redirect to login
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        className="input input-bordered w-full"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="input input-bordered w-full"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}
      <button type="submit" className="btn btn-primary w-full">Sign Up</button>
    </form>
  );
}
