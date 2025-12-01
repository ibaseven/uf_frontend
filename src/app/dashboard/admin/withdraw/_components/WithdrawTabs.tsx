"use client";

import React, { useState } from 'react';
import { Wallet, MinusCircle } from 'lucide-react';
import WithdrawForm from './WithdrawForm';
import DeductFeesForm from './DeductFeesForm';

interface WithdrawTabsProps {
  currentBalance: number;
  ownerBalance: number;
  adminId: string;
  isTheSuperAdmin: boolean;
}

const WithdrawTabs: React.FC<WithdrawTabsProps> = ({ 
  currentBalance,
  ownerBalance,
  adminId,
  isTheSuperAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'withdraw' | 'deduct'>('withdraw');

  // Si pas super admin, afficher uniquement le formulaire de retrait
  if (!isTheSuperAdmin) {
    return (
      <WithdrawForm 
        currentBalance={currentBalance}
        adminId={adminId}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Onglets */}
      <div className="bg-white rounded-t-lg shadow-sm border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'withdraw'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Wallet className="w-5 h-5" />
            Retirer mes dividendes
            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {currentBalance.toLocaleString()} FCFA
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('deduct')}
            className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'deduct'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <MinusCircle className="w-5 h-5" />
            Déduire frais Owner
            <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              {ownerBalance.toLocaleString()} FCFA
            </span>
          </button>
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="bg-white rounded-b-lg shadow-lg p-6">
        {activeTab === 'withdraw' ? (
          <WithdrawForm 
            currentBalance={currentBalance}
            adminId={adminId}
          />
        ) : (
          <DeductFeesForm 
            ownerBalance={ownerBalance}
          />
        )}
      </div>
    </div>
  );
};

export default WithdrawTabs;