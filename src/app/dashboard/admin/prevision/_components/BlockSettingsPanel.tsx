"use client";
import React, { useState, useTransition } from 'react';
import { ShieldOff, Shield, Loader2, AlertTriangle } from 'lucide-react';
import { toggleActionsBlock, toggleProjectsBlock } from '@/actions/actions';

interface BlockSettingsPanelProps {
  initialActionsBlocked: boolean;
  initialProjectsBlocked: boolean;
}

const BlockSettingsPanel: React.FC<BlockSettingsPanelProps> = ({
  initialActionsBlocked,
  initialProjectsBlocked
}) => {
  const [actionsBlocked, setActionsBlocked] = useState(initialActionsBlocked);
  const [projectsBlocked, setProjectsBlocked] = useState(initialProjectsBlocked);
  const [actionMessage, setActionMessage] = useState('');
  const [projectMessage, setProjectMessage] = useState('');
  const [isPendingActions, startActionsTransition] = useTransition();
  const [isPendingProjects, startProjectsTransition] = useTransition();

  const handleToggleActions = () => {
    startActionsTransition(async () => {
      setActionMessage('');
      const result = await toggleActionsBlock();
      if (result.type === 'success') {
        setActionsBlocked(result.actionsBlocked);
        setActionMessage(result.message);
      } else {
        setActionMessage(result.message || 'Erreur');
      }
    });
  };

  const handleToggleProjects = () => {
    startProjectsTransition(async () => {
      setProjectMessage('');
      const result = await toggleProjectsBlock();
      if (result.type === 'success') {
        setProjectsBlocked(result.projectsBlocked);
        setProjectMessage(result.message);
      } else {
        setProjectMessage(result.message || 'Erreur');
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-orange-500">
      <div className="flex items-center mb-4">
        <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
        <h3 className="text-lg font-bold text-gray-800">Contrôle des transactions</h3>
        <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-medium">Propriétaire uniquement</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bloc actions */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-gray-700">Achat d'actions</p>
              <p className="text-sm text-gray-500">
                Statut actuel:{' '}
                <span className={actionsBlocked ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                  {actionsBlocked ? 'Bloqué' : 'Actif'}
                </span>
              </p>
            </div>
            {actionsBlocked
              ? <ShieldOff className="w-6 h-6 text-red-500" />
              : <Shield className="w-6 h-6 text-green-500" />
            }
          </div>
          <button
            onClick={handleToggleActions}
            disabled={isPendingActions}
            className={`w-full py-2 rounded-lg font-medium text-white flex items-center justify-center transition-colors ${
              actionsBlocked
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isPendingActions ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> En cours...</>
            ) : (
              actionsBlocked ? 'Débloquer' : 'Bloquer'
            )}
          </button>
          {actionMessage && (
            <p className="text-xs mt-2 text-center text-gray-600">{actionMessage}</p>
          )}
        </div>

        {/* Bloc projets */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-gray-700">Paiements projets</p>
              <p className="text-sm text-gray-500">
                Statut actuel:{' '}
                <span className={projectsBlocked ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                  {projectsBlocked ? 'Bloqué' : 'Actif'}
                </span>
              </p>
            </div>
            {projectsBlocked
              ? <ShieldOff className="w-6 h-6 text-red-500" />
              : <Shield className="w-6 h-6 text-green-500" />
            }
          </div>
          <button
            onClick={handleToggleProjects}
            disabled={isPendingProjects}
            className={`w-full py-2 rounded-lg font-medium text-white flex items-center justify-center transition-colors ${
              projectsBlocked
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isPendingProjects ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> En cours...</>
            ) : (
              projectsBlocked ? 'Débloquer' : 'Bloquer'
            )}
          </button>
          {projectMessage && (
            <p className="text-xs mt-2 text-center text-gray-600">{projectMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockSettingsPanel;
