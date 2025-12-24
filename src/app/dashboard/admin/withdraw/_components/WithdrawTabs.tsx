"use client";

import React, { useState } from 'react';
import { Wallet, MinusCircle, TrendingUp, Briefcase } from 'lucide-react';
import WithdrawForm from './WithdrawForm';
import DeductFeesForm from './DeductFeesForm';

interface WithdrawTabsProps {
  dividendeActions: number;
  dividendeProject: number;
  ownerBalanceActions: number;
  ownerBalanceProject: number;
  adminId: string;
  isTheSuperAdmin: boolean;
}

const WithdrawTabs: React.FC<WithdrawTabsProps> = ({ 
  dividendeActions,
  dividendeProject,
  ownerBalanceActions,
  ownerBalanceProject,
  adminId,
  isTheSuperAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'withdraw' | 'deduct'>('withdraw');

  // Si pas super admin, afficher uniquement le formulaire de retrait
  if (!isTheSuperAdmin) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Affichage des soldes disponibles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm opacity-90">Dividendes Actions</p>
              <Briefcase className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-3xl font-bold">{dividendeActions.toLocaleString()} FCFA</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm opacity-90">Dividendes Projets</p>
              <TrendingUp className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-3xl font-bold">{dividendeProject.toLocaleString()} FCFA</p>
          </div>
        </div>

        <WithdrawForm 
          dividendeActions={dividendeActions}
          dividendeProject={dividendeProject}
          adminId={adminId}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Onglets */}
      <div className="bg-white rounded-t-lg shadow-sm border-b">
        <div className="flex">
          
          
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
          </button>
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="bg-white rounded-b-lg shadow-lg p-6">
        {activeTab === 'withdraw' ? (
          <>
            {/* Affichage des soldes disponibles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm opacity-90">Dividendes Actions</p>
                  <Briefcase className="w-5 h-5 opacity-80" />
                </div>
                <p className="text-3xl font-bold">{dividendeActions.toLocaleString()} FCFA</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm opacity-90">Dividendes Projets</p>
                  <TrendingUp className="w-5 h-5 opacity-80" />
                </div>
                <p className="text-3xl font-bold">{dividendeProject.toLocaleString()} FCFA</p>
              </div>
            </div>

            <WithdrawForm 
              dividendeActions={dividendeActions}
              dividendeProject={dividendeProject}
              adminId={adminId}
            />
          </>
        ) : (
          <>
            {/* Affichage des soldes Owner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm opacity-90">Owner - Actions</p>
                  <Briefcase className="w-5 h-5 opacity-80" />
                </div>
                <p className="text-3xl font-bold">{ownerBalanceActions.toLocaleString()} FCFA</p>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm opacity-90">Owner - Projets</p>
                  <TrendingUp className="w-5 h-5 opacity-80" />
                </div>
                <p className="text-3xl font-bold">{ownerBalanceProject.toLocaleString()} FCFA</p>
              </div>
            </div>

            <DeductFeesForm 
              ownerBalanceActions={ownerBalanceActions}
              ownerBalanceProject={ownerBalanceProject}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default WithdrawTabs;