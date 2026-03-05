"use client";

import React, { useState, useTransition } from "react";
import {
  FileText, TrendingUp, AlertCircle, Loader2, X,
  Calendar, CheckCircle, Clock, CreditCard, Info
} from "lucide-react";
import { initiateMoratoireVersement } from "@/actions/moratoire";

interface Versement {
  _id: string;
  amount: number;
  status: "pending" | "confirmed" | "failed";
  createdAt: string;
}

interface Moratoire {
  _id: string;
  actionNumber: number;
  totalAmount: number;
  versementMontant: number;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "suspended" | "cancelled";
  totalPaid: number;
  contractPdfUrl: string | null;
  actionContractSent: boolean;
  versements: Versement[];
  createdAt: string;
}

const formatAmount = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; className: string }> = {
    active: { label: "Actif", className: "bg-green-100 text-green-800" },
    completed: { label: "Complété", className: "bg-blue-100 text-blue-800" },
    suspended: { label: "Suspendu", className: "bg-yellow-100 text-yellow-800" },
    cancelled: { label: "Annulé", className: "bg-red-100 text-red-800" },
  };
  const { label, className } = map[status] || { label: status, className: "bg-gray-100 text-gray-800" };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${className}`}>{label}</span>;
};

export default function MoratoireView({ moratoires: initial }: { moratoires: Moratoire[] }) {
  const [moratoires, setMoratoires] = useState<Moratoire[]>(initial);
  const [payingMoratoire, setPayingMoratoire] = useState<Moratoire | null>(null);

  if (moratoires.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <FileText className="w-16 h-16 mb-4 text-gray-200" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Aucun engagement moratoire</h2>
        <p className="text-sm text-center max-w-md">
          Vous n'avez pas encore d'engagement moratoire. Contactez l'administration pour en créer un.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mes Engagements Moratoires</h1>
        <p className="text-sm text-gray-500 mt-1">Suivez et effectuez vos versements d'acquisition d'actions</p>
      </div>

      <div className="grid gap-5">
        {moratoires.map((m) => (
          <MoratoireCard
            key={m._id}
            moratoire={m}
            onPay={() => setPayingMoratoire(m)}
          />
        ))}
      </div>

      {payingMoratoire && (
        <VersementModal
          moratoire={payingMoratoire}
          onClose={() => setPayingMoratoire(null)}
          onSuccess={(updatedId, paidAmount) => {
            setMoratoires((prev) =>
              prev.map((m) =>
                m._id === updatedId
                  ? { ...m, totalPaid: m.totalPaid + paidAmount }
                  : m
              )
            );
            setPayingMoratoire(null);
          }}
        />
      )}
    </div>
  );
}

// ─── MoratoireCard ────────────────────────────────────────────────────────────
function MoratoireCard({ moratoire: m, onPay }: { moratoire: Moratoire; onPay: () => void }) {
  const [showHistory, setShowHistory] = useState(false);
  const progress = m.totalAmount > 0 ? Math.min((m.totalPaid / m.totalAmount) * 100, 100) : 0;
  const remaining = m.totalAmount - m.totalPaid;
  const confirmedVersements = m.versements.filter((v) => v.status === "confirmed");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#165DFC] to-[#1e4fd6] p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Contrat Moratoire</h3>
              <p className="text-blue-100 text-sm">{m.actionNumber} actions · {formatAmount(m.totalAmount)}</p>
            </div>
          </div>
          <StatusBadge status={m.status} />
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Progression */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progression du paiement</span>
            <span className="text-sm font-bold text-[#165DFC]">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: progress >= 100
                  ? "linear-gradient(90deg, #16a34a, #22c55e)"
                  : "linear-gradient(90deg, #165DFC, #3b82f6)",
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1.5">
            <span>Payé : <span className="font-semibold text-green-700">{formatAmount(m.totalPaid)}</span></span>
            <span>Reste : <span className="font-semibold text-red-600">{formatAmount(remaining)}</span></span>
          </div>
        </div>

        {/* Infos grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <InfoCard icon={<TrendingUp className="w-4 h-4 text-[#165DFC]" />} label="Versement suggéré" value={formatAmount(m.versementMontant)} />
          <InfoCard icon={<Calendar className="w-4 h-4 text-purple-600" />} label="Début" value={formatDate(m.startDate)} />
          <InfoCard icon={<Calendar className="w-4 h-4 text-orange-500" />} label="Fin prévue" value={formatDate(m.endDate)} />
          <InfoCard
            icon={<CheckCircle className="w-4 h-4 text-green-600" />}
            label="Versements effectués"
            value={`${confirmedVersements.length}`}
          />
        </div>

        {/* Contrat actions reçu */}
        {m.actionContractSent && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-800 text-sm">Contrat d'actionnaire envoyé !</p>
              <p className="text-xs text-green-600">Vous avez reçu votre contrat d'achat d'actions sur WhatsApp.</p>
            </div>
          </div>
        )}

        {/* Avertissement si suspendu */}
        {m.status === "suspended" && (
          <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-700">Votre engagement est suspendu. Contactez l'administration.</p>
          </div>
        )}

        {/* Info paiement complet en attente */}
        {!m.actionContractSent && m.status === "active" && (
          <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-4">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              Votre contrat d'actionnaire vous sera envoyé par WhatsApp une fois le paiement intégral de{" "}
              <strong>{formatAmount(m.totalAmount)}</strong> effectué.
            </p>
          </div>
        )}

        {/* Boutons */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition text-sm flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4" />
            {showHistory ? "Masquer" : "Historique"}
          </button>

          {m.status === "active" && remaining > 0 && (
            <button
              onClick={onPay}
              className="flex-1 py-2.5 bg-[#165DFC] text-white font-semibold rounded-xl hover:bg-[#1249cc] transition text-sm flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Effectuer un versement
            </button>
          )}
        </div>

        {/* Historique */}
        {showHistory && (
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Historique des versements</p>
            {m.versements.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Aucun versement effectué</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {[...m.versements].reverse().map((v) => (
                  <div key={v._id} className="flex justify-between items-center py-2 px-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        v.status === "confirmed" ? "bg-green-500" :
                        v.status === "failed" ? "bg-red-500" : "bg-yellow-500"
                      }`} />
                      <span className="text-sm text-gray-600">{formatDate(v.createdAt)}</span>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        v.status === "confirmed" ? "text-green-700" :
                        v.status === "failed" ? "text-red-600" : "text-yellow-600"
                      }`}>
                        {formatAmount(v.amount)}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">{v.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
      <div className="flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 truncate">{label}</p>
        <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
}

// ─── VersementModal ───────────────────────────────────────────────────────────
function VersementModal({
  moratoire,
  onClose,
  onSuccess,
}: {
  moratoire: Moratoire;
  onClose: () => void;
  onSuccess: (id: string, amount: number) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [amount, setAmount] = useState(moratoire.versementMontant);
  const [result, setResult] = useState<{ type: string; message: string } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const remaining = moratoire.totalAmount - moratoire.totalPaid;
  const isValid = amount > 0 && amount <= remaining;

  const handlePay = () => {
    startTransition(async () => {
      const res = await initiateMoratoireVersement({
        moratoireId: moratoire._id,
        amount,
      });

      if (res.type === "success") {
        const paymentUrl = res.invoice?.response_text || res.invoice?.payment_url;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          setResult({ type: "error", message: "URL de paiement non disponible" });
        }
      } else {
        setResult({ type: "error", message: res.message });
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#165DFC] to-[#1e4fd6] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Effectuer un versement</h2>
                <p className="text-blue-100 text-sm">Paiement moratoire via mobile money</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Récap engagement */}
          <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Total à payer :</span>
              <span className="font-semibold">{formatAmount(moratoire.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Déjà payé :</span>
              <span className="font-semibold text-green-700">{formatAmount(moratoire.totalPaid)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
              <span className="font-medium text-gray-700">Reste à payer :</span>
              <span className="font-bold text-[#165DFC]">{formatAmount(remaining)}</span>
            </div>
          </div>

          {/* Montant */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant du versement (FCFA)
            </label>
            <input
              type="number"
              min={1}
              max={remaining}
              value={amount}
              onChange={(e) => {
                setAmount(Number(e.target.value));
                setResult(null);
                setShowConfirm(false);
              }}
              className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
            />
            <p className="text-xs text-gray-500 mt-1">
              Versement suggéré : <span className="font-semibold">{formatAmount(moratoire.versementMontant)}</span>
            </p>

            {/* Boutons montant rapide */}
            <div className="flex flex-wrap gap-2 mt-3">
              {[moratoire.versementMontant, remaining].filter((v, i, a) => a.indexOf(v) === i && v > 0).map((v) => (
                <button
                  key={v}
                  onClick={() => { setAmount(v); setResult(null); setShowConfirm(false); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    amount === v
                      ? "bg-[#165DFC] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {v === remaining ? `Tout payer (${formatAmount(v)})` : formatAmount(v)}
                </button>
              ))}
            </div>
          </div>

          {/* Résultat / erreur */}
          {result?.type === "error" && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {result.message}
            </div>
          )}

          {/* Info */}
          <div className="flex items-start gap-2 bg-blue-50 rounded-xl p-3">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              Vous serez redirigé vers la page de paiement PayDunya (Wave, Orange Money, etc.).
              {remaining - amount <= 0
                ? " Après ce versement, vous recevrez votre contrat d'actionnaire sur WhatsApp !"
                : ""}
            </p>
          </div>

          {/* Boutons */}
          {showConfirm ? (
            <div className="space-y-3">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
                <p className="text-yellow-800 text-sm">
                  Confirmer le versement de <span className="font-bold">{formatAmount(amount)}</span> ?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isPending}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
                >
                  Retour
                </button>
                <button
                  onClick={handlePay}
                  disabled={isPending || !isValid}
                  className="flex-1 py-3 bg-[#165DFC] text-white font-semibold rounded-xl hover:bg-[#1249cc] transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    "Confirmer & Payer"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
              >
                Annuler
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={!isValid}
                className="flex-1 py-3 bg-[#165DFC] text-white font-semibold rounded-xl hover:bg-[#1249cc] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Payer {formatAmount(amount)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
