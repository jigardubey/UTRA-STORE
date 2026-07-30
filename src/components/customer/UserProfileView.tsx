import React, { useState } from 'react';
import { User, MapPin, ArrowLeft, Shield, Plus, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Address } from '../../types';

interface UserProfileViewProps {
  onBack: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ onBack }) => {
  const { userProfile, isAdmin, deleteAccount } = useAuth();
  const [savedAddresses, setSavedAddresses] = useState<Address[]>(userProfile?.addresses || [
    {
      id: 'addr-1',
      fullName: userProfile?.displayName || 'Customer',
      phone: '9876543210',
      street: '42 MG Road, Sector 14',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560001',
      isDefault: true,
    }
  ]);

  const [newAddr, setNewAddr] = useState({ fullName: '', phone: '', street: '', city: '', state: '', zipCode: '' });
  const [showAddAddr, setShowAddAddr] = useState(false);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Address = {
      ...newAddr,
      id: 'addr-' + Date.now(),
      isDefault: savedAddresses.length === 0,
    };
    setSavedAddresses([...savedAddresses, created]);
    setShowAddAddr(false);
    setNewAddr({ fullName: '', phone: '', street: '', city: '', state: '', zipCode: '' });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 animate-fade-in">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </button>

        <h1 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" /> My Account & Saved Addresses
        </h1>
      </div>

      {/* Account Info Card */}
      <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-black text-xl flex items-center justify-center shadow-md">
          {userProfile?.displayName.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <h2 className="font-bold text-gray-900 text-base">{userProfile?.displayName}</h2>
          <p className="text-gray-500 text-xs">{userProfile?.email}</p>
          {isAdmin && (
            <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-200">
              <Shield className="w-3 h-3" /> Certified Store Admin
            </span>
          )}
        </div>
      </div>

      {/* Addresses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-600" /> Saved Delivery Addresses
          </h3>
          <button
            onClick={() => setShowAddAddr(!showAddAddr)}
            className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold rounded-xl flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add New Address
          </button>
        </div>

        {showAddAddr && (
          <form onSubmit={handleAddAddress} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 text-xs">
            <h4 className="font-bold text-gray-900">New Address Details</h4>
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                placeholder="Full Name"
                value={newAddr.fullName}
                onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                className="p-2.5 bg-white border border-gray-200 rounded-xl"
              />
              <input
                required
                placeholder="Phone Number"
                value={newAddr.phone}
                onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                className="p-2.5 bg-white border border-gray-200 rounded-xl"
              />
              <input
                required
                placeholder="Street Address"
                value={newAddr.street}
                onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                className="col-span-2 p-2.5 bg-white border border-gray-200 rounded-xl"
              />
              <input
                required
                placeholder="City"
                value={newAddr.city}
                onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                className="p-2.5 bg-white border border-gray-200 rounded-xl"
              />
              <input
                required
                placeholder="State"
                value={newAddr.state}
                onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                className="p-2.5 bg-white border border-gray-200 rounded-xl"
              />
            </div>
            <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl">
              Save Address
            </button>
          </form>
        )}

        <div className="space-y-3">
          {savedAddresses.map((addr) => (
            <div key={addr.id} className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-gray-900">{addr.fullName} <span className="text-gray-400 font-normal">({addr.phone})</span></p>
                <p className="text-gray-600 mt-0.5">{addr.street}, {addr.city}, {addr.state} - {addr.zipCode}</p>
              </div>
              {addr.isDefault && (
                <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full text-[10px] flex items-center gap-1">
                  <Check className="w-3 h-3" /> Default
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Account & Data Privacy Deletion Section */}
      <div className="p-5 bg-red-50/60 border border-red-100 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-red-900 text-xs flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-red-600" /> Account Privacy & Data Deletion
            </h4>
            <p className="text-[11px] text-red-700 mt-0.5">
              Permanently remove your account profile, delivery addresses, and personal store activity data from UTRA STORE servers.
            </p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to permanently delete your account and personal data? This action cannot be undone.')) {
                deleteAccount();
                onBack();
              }
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors shrink-0"
          >
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
};
