import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { isPinSetup, setupPin, login } = useAuth();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isPinSetup) {
      if (pin.length < 4) {
        setError('PIN must be at least 4 digits');
        setLoading(false);
        return;
      }
      if (pin !== confirmPin) {
        setError('PINs do not match');
        setLoading(false);
        return;
      }
      const result = await setupPin(pin);
      if (!result.success) setError(result.error);
    } else {
      const result = await login(pin);
      if (!result.success) setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-blue-600">
      <div className="card w-full max-w-sm mx-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-dark">BizzTrack</h1>
          <p className="text-gray-500 text-sm mt-1">Business Management Toolkit</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isPinSetup ? 'Enter PIN' : 'Create PIN'}
            </label>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="input text-center text-2xl tracking-[0.5em]"
              placeholder="****"
              autoFocus
            />
          </div>

          {!isPinSetup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                className="input text-center text-2xl tracking-[0.5em]"
                placeholder="****"
              />
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || pin.length < 4}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : isPinSetup ? 'Login' : 'Setup PIN'}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          {isPinSetup ? 'Enter your 4-6 digit PIN to access' : 'Create a 4-6 digit PIN to secure your data'}
        </p>
      </div>
    </div>
  );
}
