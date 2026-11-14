import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  User, Package, Settings, Edit2, Save, X,
  Eye, EyeOff, ChevronDown, ChevronUp, Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatPrice } from '../utils/helpers';
import { mockOrders } from '../utils/mockData';
import type { Order } from '../types';

type Tab = 'profile' | 'orders' | 'settings';

const statusConfig: Record<Order['status'], { label: string; badgeClass: string }> = {
  pending: { label: 'Pending', badgeClass: 'bg-warning text-dark' },
  processing: { label: 'Processing', badgeClass: 'bg-info text-dark' },
  shipped: { label: 'Shipped', badgeClass: 'bg-primary' },
  delivered: { label: 'Delivered', badgeClass: 'bg-success' },
  cancelled: { label: 'Cancelled', badgeClass: 'bg-danger' },
};

const AccountPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  // Profile
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    phone: user?.phone ?? '',
    street: user?.address?.street ?? '',
    city: user?.address?.city ?? '',
    state: user?.address?.state ?? '',
    postalCode: user?.address?.postalCode ?? '',
    country: user?.address?.country ?? '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Orders
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  // Settings
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState({ old: false, new: false, confirm: false });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [notifications, setNotifications] = useState({ orderUpdates: true, promotions: false, newsletter: true });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();

  const handleProfileSave = async () => {
    setProfileSaving(true);
    try {
      await updateProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone,
        address: {
          fullName: `${profileForm.firstName} ${profileForm.lastName}`,
          street: profileForm.street,
          city: profileForm.city,
          state: profileForm.state,
          postalCode: profileForm.postalCode,
          country: profileForm.country,
        },
      });
      setEditMode(false);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch {
      // silent
    } finally {
      setProfileSaving(false);
    }
  };

  const handleProfileCancel = () => {
    setProfileForm({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone ?? '',
      street: user.address?.street ?? '',
      city: user.address?.city ?? '',
      state: user.address?.state ?? '',
      postalCode: user.address?.postalCode ?? '',
      country: user.address?.country ?? '',
    });
    setEditMode(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (!pwForm.oldPassword) { setPwError('Current password is required'); return; }
    if (pwForm.newPassword.length < 6) { setPwError('New password must be at least 6 characters'); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError('Passwords do not match'); return; }
    // Simulate success
    setPwSuccess(true);
    setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setPwSuccess(false), 3000);
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Sidebar */}
        <div className="col-lg-3">
          <div className="card shadow-sm border-0 text-center p-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
                className="rounded-circle mx-auto mb-3"
                style={{ width: 80, height: 80, objectFit: 'cover' }}
              />
            ) : (
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3 fs-4 fw-bold"
                style={{ width: 80, height: 80 }}
              >
                {initials}
              </div>
            )}
            <h5 className="fw-bold mb-0">{user.firstName} {user.lastName}</h5>
            <p className="text-muted small">{user.email}</p>
            <p className="text-muted small mb-0">Member since {formatDate(user.createdAt)}</p>
          </div>

          <div className="list-group shadow-sm border-0 mt-3">
            {(['profile', 'orders', 'settings'] as Tab[]).map((tab) => {
              const icons = { profile: <User size={16} />, orders: <Package size={16} />, settings: <Settings size={16} /> };
              const labels = { profile: 'Profile', orders: 'Orders', settings: 'Settings' };
              return (
                <button
                  key={tab}
                  className={`list-group-item list-group-item-action d-flex align-items-center gap-2 border-0 ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {icons[tab]}
                  {labels[tab]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <div className="col-lg-9">
          {/* TAB: Profile */}
          {activeTab === 'profile' && (
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Profile Information</h5>
                {!editMode ? (
                  <button className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1" onClick={() => setEditMode(true)}>
                    <Edit2 size={14} /> Edit
                  </button>
                ) : (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success btn-sm d-flex align-items-center gap-1"
                      onClick={handleProfileSave}
                      disabled={profileSaving}
                    >
                      {profileSaving ? <span className="spinner-border spinner-border-sm" /> : <Save size={14} />}
                      Save
                    </button>
                    <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" onClick={handleProfileCancel}>
                      <X size={14} /> Cancel
                    </button>
                  </div>
                )}
              </div>
              <div className="card-body">
                {profileSuccess && <div className="alert alert-success py-2 mb-3">Profile updated successfully!</div>}
                <div className="row g-3">
                  {[
                    { id: 'firstName', label: 'First Name', field: 'firstName' as const },
                    { id: 'lastName', label: 'Last Name', field: 'lastName' as const },
                    { id: 'phone', label: 'Phone', field: 'phone' as const },
                    { id: 'street', label: 'Street Address', field: 'street' as const },
                    { id: 'city', label: 'City', field: 'city' as const },
                    { id: 'state', label: 'State', field: 'state' as const },
                    { id: 'postalCode', label: 'Postal Code', field: 'postalCode' as const },
                    { id: 'country', label: 'Country', field: 'country' as const },
                  ].map(({ id, label, field }) => (
                    <div className="col-md-6" key={id}>
                      <label className="form-label text-muted small fw-semibold">{label}</label>
                      {editMode ? (
                        <input
                          type="text"
                          className="form-control"
                          id={id}
                          value={profileForm[field]}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, [field]: e.target.value }))}
                        />
                      ) : (
                        <p className="mb-0 fw-semibold">{profileForm[field] || <span className="text-muted fst-italic">Not set</span>}</p>
                      )}
                    </div>
                  ))}
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-semibold">Email (read-only)</label>
                    <p className="mb-0 fw-semibold">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Orders */}
          {activeTab === 'orders' && (
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-0">
                <h5 className="fw-bold mb-0">Order History</h5>
              </div>
              <div className="card-body p-0">
                {mockOrders.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <Package size={48} className="mb-3 opacity-50" />
                    <p>No orders yet.</p>
                  </div>
                ) : (
                  mockOrders.map((order) => {
                    const statusInfo = statusConfig[order.status];
                    const isExpanded = expandedOrder === order.id;
                    return (
                      <div key={order.id} className="border-bottom">
                        <button
                          className="w-100 text-start p-3 bg-white border-0 d-flex align-items-center gap-3"
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="flex-grow-1">
                            <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                              <strong>{order.orderNumber}</strong>
                              <span className={`badge ${statusInfo.badgeClass}`}>{statusInfo.label}</span>
                            </div>
                            <small className="text-muted">
                              {formatDate(order.createdAt)} &bull; {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </small>
                          </div>
                          <div className="text-end">
                            <div className="fw-bold">{formatPrice(order.total)}</div>
                            {isExpanded ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="bg-light p-3">
                            <div className="table-responsive">
                              <table className="table table-sm mb-0 bg-white rounded">
                                <thead className="table-light">
                                  <tr>
                                    <th>Product</th>
                                    <th className="text-center">Qty</th>
                                    <th className="text-end">Price</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.items.map((item) => (
                                    <tr key={item.id}>
                                      <td>{item.product.name}</td>
                                      <td className="text-center">{item.quantity}</td>
                                      <td className="text-end">{formatPrice(item.price)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot className="table-light">
                                  <tr>
                                    <td colSpan={2} className="text-end fw-semibold">Total</td>
                                    <td className="text-end fw-bold">{formatPrice(order.total)}</td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                            <div className="mt-2 small text-muted">
                              Shipping to: {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB: Settings */}
          {activeTab === 'settings' && (
            <div className="d-flex flex-column gap-4">
              {/* Change Password */}
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white border-0">
                  <h5 className="fw-bold mb-0">Change Password</h5>
                </div>
                <div className="card-body">
                  {pwError && <div className="alert alert-danger py-2">{pwError}</div>}
                  {pwSuccess && <div className="alert alert-success py-2">Password updated successfully!</div>}
                  <form onSubmit={handlePasswordChange}>
                    {([
                      { id: 'old', label: 'Current Password', field: 'oldPassword' as const },
                      { id: 'new', label: 'New Password', field: 'newPassword' as const },
                      { id: 'confirm', label: 'Confirm New Password', field: 'confirmPassword' as const },
                    ] as const).map(({ id, label, field }) => (
                      <div className="mb-3" key={id}>
                        <label className="form-label fw-semibold">{label}</label>
                        <div className="input-group">
                          <input
                            type={showPw[id] ? 'text' : 'password'}
                            className="form-control border-end-0"
                            value={pwForm[field]}
                            onChange={(e) => setPwForm(prev => ({ ...prev, [field]: e.target.value }))}
                            autoComplete={id === 'old' ? 'current-password' : 'new-password'}
                          />
                          <button
                            type="button"
                            className="input-group-text bg-light border-start-0"
                            onClick={() => setShowPw(prev => ({ ...prev, [id]: !prev[id] }))}
                          >
                            {showPw[id] ? <EyeOff size={16} className="text-muted" /> : <Eye size={16} className="text-muted" />}
                          </button>
                        </div>
                      </div>
                    ))}
                    <button type="submit" className="btn btn-primary">Update Password</button>
                  </form>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white border-0">
                  <h5 className="fw-bold mb-0">Notification Preferences</h5>
                </div>
                <div className="card-body">
                  {([
                    { key: 'orderUpdates' as const, label: 'Order updates', desc: 'Shipping and delivery notifications' },
                    { key: 'promotions' as const, label: 'Promotions', desc: 'Sales, discounts and special offers' },
                    { key: 'newsletter' as const, label: 'Newsletter', desc: 'Weekly digest and new arrivals' },
                  ]).map(({ key, label, desc }) => (
                    <div className="form-check form-switch mb-3" key={key}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`notif-${key}`}
                        checked={notifications[key]}
                        onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                      />
                      <label className="form-check-label" htmlFor={`notif-${key}`}>
                        <span className="fw-semibold">{label}</span>
                        <br />
                        <small className="text-muted">{desc}</small>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger zone */}
              <div className="card shadow-sm border-0 border-danger">
                <div className="card-header bg-white border-0">
                  <h5 className="fw-bold text-danger mb-0">Danger Zone</h5>
                </div>
                <div className="card-body">
                  <p className="text-muted small">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button
                    className="btn btn-danger d-flex align-items-center gap-2"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 size={16} />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <>
          <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold text-danger">Delete Account</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)} />
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete your account? This will permanently erase all your data, orders, and preferences.</p>
                  <p className="fw-semibold text-danger mb-0">This action cannot be undone.</p>
                </div>
                <div className="modal-footer border-0">
                  <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger d-flex align-items-center gap-2"
                    onClick={() => { logout(); setShowDeleteModal(false); }}
                  >
                    <Trash2 size={16} />
                    Yes, Delete My Account
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setShowDeleteModal(false)} />
        </>
      )}
    </div>
  );
};

export default AccountPage;
