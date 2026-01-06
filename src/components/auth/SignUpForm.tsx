import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, Eye, EyeOff, Check, X, Users, Headphones } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface SignUpFormProps {
  onToggleForm: () => void;
}

export const SignUpForm = ({ onToggleForm }: SignUpFormProps) => {
  const { signUp } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<'client' | 'support_agent'>('client');
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['client']);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const passwordRequirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Contains number', met: /[0-9]/.test(password) },
  ];

  const isPasswordValid = passwordRequirements.every(req => req.met);

  const specializationOptions = [
    { value: 'hardware', label: 'Hardware Support' },
    { value: 'software', label: 'Software Support' },
    { value: 'network', label: 'Network Solutions' },
    { value: 'cloud', label: 'Cloud Services' },
    { value: 'security', label: 'Cybersecurity' },
    { value: 'data_recovery', label: 'Data Recovery' },
    { value: 'mobile', label: 'Mobile Support' },
    { value: 'web_development', label: 'Web Development' },
  ];

  const handleSpecializationToggle = (specialization: string) => {
    setSelectedSpecializations(prev =>
      prev.includes(specialization)
        ? prev.filter(s => s !== specialization)
        : [...prev, specialization]
    );
  };

  const handleAccountTypeChange = (type: 'client' | 'support_agent') => {
    setAccountType(type);
    setSelectedRoles([type]);
    if (type === 'client') {
      setSelectedSpecializations([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      return;
    }

    if (!isPasswordValid) {
      setError('Please meet all password requirements');
      return;
    }

    if (selectedRoles.length === 0) {
      setError('Please select an account type');
      return;
    }

    if (accountType === 'support_agent' && selectedSpecializations.length === 0) {
      setError('Please select at least one specialization');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, fullName, selectedRoles, selectedSpecializations);

    if (error) {
      setError(error.message || 'Failed to sign up');
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <UserPlus className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Account Created!</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Your account has been created successfully. You can now sign in.
          </p>
          <button
            onClick={onToggleForm}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <div className="flex items-center justify-center mb-6">
        <UserPlus className="w-8 h-8 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Sign Up</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-200 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name *
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            minLength={2}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) validateEmail(e.target.value);
            }}
            onBlur={() => validateEmail(email)}
            required
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              emailError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="you@example.com"
          />
          {emailError && (
            <p className="mt-1 text-sm text-red-600">{emailError}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password *
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="mt-2 space-y-1">
            {passwordRequirements.map((req, index) => (
              <div key={index} className="flex items-center text-sm">
                {req.met ? (
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                ) : (
                  <X className="w-4 h-4 text-gray-400 mr-2" />
                )}
                <span className={req.met ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Account Type *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleAccountTypeChange('client')}
              className={`p-4 border-2 rounded-lg transition-all ${
                accountType === 'client'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <Users className={`w-8 h-8 ${accountType === 'client' ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Client
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                I need tech support assistance
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleAccountTypeChange('support_agent')}
              className={`p-4 border-2 rounded-lg transition-all ${
                accountType === 'support_agent'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <Headphones className={`w-8 h-8 ${accountType === 'support_agent' ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Support Agent / Technician
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                I provide tech support services
              </p>
            </button>
          </div>
        </div>

        {accountType === 'support_agent' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Specializations * (Select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg">
              {specializationOptions.map((spec) => (
                <label key={spec.value} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                  <input
                    type="checkbox"
                    checked={selectedSpecializations.includes(spec.value)}
                    onChange={() => handleSpecializationToggle(spec.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{spec.label}</span>
                </label>
              ))}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Select your areas of expertise to help clients find you
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <button
            onClick={onToggleForm}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
