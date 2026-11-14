import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

type PasswordStrength = 'weak' | 'fair' | 'strong';

const getPasswordStrength = (password: string): PasswordStrength => {
  if (password.length === 0) return 'weak';
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return 'weak';
  if (score <= 3) return 'fair';
  return 'strong';
};

const strengthConfig: Record<PasswordStrength, { label: string; color: string; width: string }> = {
  weak: { label: 'Weak', color: 'bg-danger', width: '33%' },
  fair: { label: 'Fair', color: 'bg-warning', width: '66%' },
  strong: { label: 'Strong', color: 'bg-success', width: '100%' },
};

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const strength = getPasswordStrength(formData.password);
  const strengthInfo = strengthConfig[strength];

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!termsAccepted) {
      newErrors.terms = 'You must accept the Terms of Service';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register({ ...formData });
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="fw-bold">Create account</h2>
        <p className="text-muted">Join LENS today — it&apos;s free</p>
      </div>

      {apiError && (
        <div className="alert alert-danger mb-3" role="alert">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Name row */}
        <div className="row g-3 mb-3">
          <div className="col-6">
            <label htmlFor="firstName" className="form-label fw-semibold">First Name</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <User size={16} className="text-muted" />
              </span>
              <input
                id="firstName"
                type="text"
                className={`form-control border-start-0 ${errors.firstName ? 'is-invalid' : ''}`}
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                disabled={isLoading}
              />
              {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
            </div>
          </div>
          <div className="col-6">
            <label htmlFor="lastName" className="form-label fw-semibold">Last Name</label>
            <input
              id="lastName"
              type="text"
              className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange('lastName')}
              disabled={isLoading}
            />
            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
          </div>
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="regEmail" className="form-label fw-semibold">Email address</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <Mail size={16} className="text-muted" />
            </span>
            <input
              id="regEmail"
              type="email"
              className={`form-control border-start-0 ${errors.email ? 'is-invalid' : ''}`}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange('email')}
              autoComplete="email"
              disabled={isLoading}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
        </div>

        {/* Password */}
        <div className="mb-1">
          <label htmlFor="regPassword" className="form-label fw-semibold">Password</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <Lock size={16} className="text-muted" />
            </span>
            <input
              id="regPassword"
              type={showPassword ? 'text' : 'password'}
              className={`form-control border-start-0 border-end-0 ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleChange('password')}
              autoComplete="new-password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="input-group-text bg-light border-start-0"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} className="text-muted" /> : <Eye size={16} className="text-muted" />}
            </button>
            {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
          </div>
        </div>

        {/* Password strength indicator */}
        {formData.password.length > 0 && (
          <div className="mb-3 mt-2">
            <div className="progress" style={{ height: 6 }}>
              <div
                className={`progress-bar ${strengthInfo.color}`}
                role="progressbar"
                style={{ width: strengthInfo.width, transition: 'width 0.3s ease' }}
                aria-label={`Password strength: ${strengthInfo.label}`}
              />
            </div>
            <small className={`text-${strength === 'weak' ? 'danger' : strength === 'fair' ? 'warning' : 'success'}`}>
              Password strength: <strong>{strengthInfo.label}</strong>
              {strength === 'weak' && ' — add uppercase, numbers & symbols'}
              {strength === 'fair' && ' — add more variety to strengthen'}
            </small>
          </div>
        )}

        {/* Confirm Password */}
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm Password</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <Lock size={16} className="text-muted" />
            </span>
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              className={`form-control border-start-0 border-end-0 ${errors.confirmPassword ? 'is-invalid' : ''}`}
              placeholder="Repeat password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              autoComplete="new-password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="input-group-text bg-light border-start-0"
              onClick={() => setShowConfirm(v => !v)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff size={16} className="text-muted" /> : <Eye size={16} className="text-muted" />}
            </button>
            {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword}</div>}
          </div>
        </div>

        {/* Terms */}
        <div className="mb-4">
          <div className="form-check">
            <input
              type="checkbox"
              className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`}
              id="terms"
              checked={termsAccepted}
              onChange={(e) => {
                setTermsAccepted(e.target.checked);
                if (errors.terms) setErrors(prev => ({ ...prev, terms: undefined }));
              }}
              disabled={isLoading}
            />
            <label className="form-check-label text-muted" htmlFor="terms">
              I agree to the{' '}
              <a href="#" className="text-primary text-decoration-none">Terms of Service</a>
            </label>
            {errors.terms && <div className="invalid-feedback d-block">{errors.terms}</div>}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary w-100 btn-lg d-flex align-items-center justify-content-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              Creating account...
            </>
          ) : (
            <>
              <UserPlus size={18} />
              Create Account
            </>
          )}
        </button>
      </form>

      <div className="text-center mt-4">
        <span className="text-muted">Already have an account? </span>
        <Link to="/login" className="text-primary fw-semibold text-decoration-none">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
