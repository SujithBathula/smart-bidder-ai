import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    } else {
      setError('');
      // Redirect or update UI on successful login
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Login</h2>
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
      <button type="submit" className="btn btn-primary w-full">Log In</button>
    </form>
  );
}
