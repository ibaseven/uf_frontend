'use client'

import { User } from "@/lib/types";
import { Badge } from "@/components/ui/badge";


type Props = {
  user: User;
};

export default function Profile({ user }: Props) {

 

  return (
    <div className="w-full mx-auto px-4 overflow-hidden">
      <h1 className="text-xl md:text-3xl font-bold text-indigo-900 mb-6 text-center">Profil utilisateur</h1>
      <div className=" bg-white rounded-lg w-[70vw] flex flex-col justify-center items-center py-4">
    
        <div className="flex w-full flex-col md:flex-row gap-8 p-4">
          {/* Section 1 */}
          <div className="flex-1 bg-slate-50 p-6 rounded-lg shadow-lg">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-orange-500">Information du Compte</h2>
            </div>
            <div className="space-y-3 text-lg">
              <div>Nom: <span className="font-semibold"> {`${user?.firstName} ${user?.lastName}`} </span></div>
              <div>Téléphone: <span className="font-semibold"> {user?.telephone} </span></div>
              <div>Role: <Badge variant="secondary">  <span className="font-semibold"> {user?.role} </span> </Badge></div>
              <div>Permissions: 
                <div className="flex flex-wrap gap-1 mt-1">
                  {user?.permissions?.map((permission, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>Statut: 
                <Badge variant={user?.status === 'active' ? 'default' : 'destructive'} className="ml-2">
                  {user?.status}
                </Badge>
              </div>
              <div>Compte bloqué: 
                <Badge variant={user?.isBlocked ? 'destructive' : 'default'} className="ml-2">
                  {user?.isBlocked ? 'Oui' : 'Non'}
                </Badge>
              </div>
              <div>Date de création: 
                <span className="font-semibold">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'Non définie'}
                </span>
              </div>
            </div>
          </div>
          


        </div>
      </div>
    </div>
  );
}