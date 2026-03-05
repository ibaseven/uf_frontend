"use client";

import React, { useState, useTransition } from "react";
import {
  Plus, Search, FileText, Edit2, Send, Ban, CheckCircle,
  AlertCircle, Loader2, X, TrendingUp, Users,
  Eye, RotateCcw, Banknote, UserSearch
} from "lucide-react";
import {
  createMoratoireEngagement,
  updateVersementMontant,
  updateMoratoireStatus,
  resendMoratoireContract,
  addVersementManuel,
} from "@/actions/moratoire";

interface Versement {
  _id: string;
  amount: number;
  type: "paydunya" | "manuel";
  note?: string;
  status: "pending" | "confirmed" | "failed";
  createdAt: string;
}

interface Moratoire {
  _id: string;
  userId: { _id: string; firstName: string; lastName: string; telephone: string; actionsNumber: number };
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

interface Actionnaire {
  _id: string;
  firstName: string;
  lastName: string;
  telephone: string;
  actionsNumber: number;
}

interface Props {
  moratoires: Moratoire[];
  actionnaires: Actionnaire[];
}

const formatAmount = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { label: string; className: string }> = {
    active: { label: "Actif", className: "bg-green-100 text-green-800" },
    completed: { label: "Complété", className: "bg-blue-100 text-blue-800" },
    suspended: { label: "Suspendu", className: "bg-yellow-100 text-yellow-800" },
    cancelled: { label: "Annulé", className: "bg-red-100 text-red-800" },
  };
  const { label, className } = config[status] || { label: status, className: "bg-gray-100 text-gray-800" };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>{label}</span>
  );
};

export default function MoratoireAdminView({ moratoires: initial, actionnaires }: Props) {
  const [moratoires, setMoratoires] = useState<Moratoire[]>(initial);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [detailMoratoire, setDetailMoratoire] = useState<Moratoire | null>(null);

  // Modals state
  const [showCreate, setShowCreate] = useState(false);
  const [showEditVersement, setShowEditVersement] = useState<Moratoire | null>(null);
  const [showVersementManuel, setShowVersementManuel] = useState<Moratoire | null>(null);

  const filtered = moratoires.filter((m) => {
    const user = m.userId;
    const nameMatch = `${user?.firstName} ${user?.lastName} ${user?.telephone}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const statusMatch = selectedStatus === "all" || m.status === selectedStatus;
    return nameMatch && statusMatch;
  });

  const stats = {
    total: moratoires.length,
    active: moratoires.filter((m) => m.status === "active").length,
    completed: moratoires.filter((m) => m.status === "completed").length,
    totalPaid: moratoires.reduce((s, m) => s + m.totalPaid, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Engagements Moratoires</h1>
          <p className="text-sm text-gray-500 mt-1">Gestion des paiements moratoires d&apos;acquisition d&apos;actions</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-[#165DFC] text-white px-4 py-2 rounded-lg hover:bg-[#1249cc] transition"
        >
          <Plus className="w-4 h-4" />
          Créer un engagement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total engagements", value: stats.total, icon: FileText, color: "blue" },
          { label: "Actifs", value: stats.active, icon: TrendingUp, color: "green" },
          { label: "Complétés", value: stats.completed, icon: CheckCircle, color: "purple" },
          { label: "Total collecté", value: formatAmount(stats.totalPaid), icon: Users, color: "orange" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center bg-${color}-100`}>
                <Icon className={`w-4 h-4 text-${color}-600`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-lg font-bold text-gray-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="completed">Complétés</option>
          <option value="suspended">Suspendus</option>
          <option value="cancelled">Annulés</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <FileText className="w-12 h-12 mb-4 text-gray-300" />
            <p className="font-medium">Aucun engagement trouvé</p>
            <p className="text-sm">Créez un premier engagement moratoire</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Actionnaire", "Actions", "Total", "Versement", "Payé", "Progression", "Statut", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((m) => {
                  const progress = m.totalAmount > 0 ? Math.min((m.totalPaid / m.totalAmount) * 100, 100) : 0;
                  return (
                    <tr key={m._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {m.userId?.firstName} {m.userId?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{m.userId?.telephone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{m.actionNumber}</td>
                      <td className="px-4 py-3 text-gray-600">{formatAmount(m.totalAmount)}</td>
                      <td className="px-4 py-3 text-gray-600">{formatAmount(m.versementMontant)}</td>
                      <td className="px-4 py-3 font-semibold text-green-700">{formatAmount(m.totalPaid)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-100 rounded-full h-2">
                            <div
                              className="bg-[#165DFC] h-2 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={m.status} />
                      </td>
                      <td className="px-4 py-3">
                        <MoratoireActions
                          moratoire={m}
                          onDetail={() => setDetailMoratoire(m)}
                          onEditVersement={() => setShowEditVersement(m)}
                          onVersementManuel={() => setShowVersementManuel(m)}
                          onRefresh={(updated) =>
                            setMoratoires((prev) => prev.map((x) => (x._id === updated._id ? updated : x)))
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <CreateMoratoireModal
          actionnaires={actionnaires}
          onClose={() => setShowCreate(false)}
          onCreated={(m) => setMoratoires((prev) => [m, ...prev])}
        />
      )}

      {/* Edit versement modal */}
      {showEditVersement && (
        <EditVersementModal
          moratoire={showEditVersement}
          onClose={() => setShowEditVersement(null)}
          onUpdated={(updated) => {
            setMoratoires((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
            setShowEditVersement(null);
          }}
        />
      )}

      {/* Versement manuel modal */}
      {showVersementManuel && (
        <VersementManuelModal
          moratoire={showVersementManuel}
          onClose={() => setShowVersementManuel(null)}
          onSuccess={(updated) => {
            setMoratoires((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
            setShowVersementManuel(null);
          }}
        />
      )}

      {/* Detail modal */}
      {detailMoratoire && (
        <DetailModal
          moratoire={detailMoratoire}
          onClose={() => setDetailMoratoire(null)}
        />
      )}
    </div>
  );
}

// ─── MoratoireActions ─────────────────────────────────────────────────────────
function MoratoireActions({
  moratoire,
  onDetail,
  onEditVersement,
  onVersementManuel,
  onRefresh,
}: {
  moratoire: Moratoire;
  onDetail: () => void;
  onEditVersement: () => void;
  onVersementManuel: () => void;
  onRefresh: (m: Moratoire) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ type: string; message: string } | null>(null);

  const handleResend = () => {
    startTransition(async () => {
      const res = await resendMoratoireContract(moratoire._id);
      setResult(res);
      setTimeout(() => setResult(null), 3000);
    });
  };

  const handleStatus = (status: string) => {
    startTransition(async () => {
      await updateMoratoireStatus(moratoire._id, status);
      onRefresh({ ...moratoire, status: status as Moratoire["status"] });
    });
  };

  return (
    <div className="relative">
      {result && (
        <p className={`text-xs mb-1 ${result.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {result.message}
        </p>
      )}
      <div className="flex items-center gap-1">
        <button
          onClick={onDetail}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition"
          title="Voir détails"
        >
          <Eye className="w-4 h-4 text-gray-600" />
        </button>
        {moratoire.status === "active" && (
          <button
            onClick={onEditVersement}
            className="p-1.5 hover:bg-blue-50 rounded-lg transition"
            title="Modifier versement"
          >
            <Edit2 className="w-4 h-4 text-[#165DFC]" />
          </button>
        )}
        {moratoire.status !== "cancelled" && moratoire.status !== "completed" && (
          <button
            onClick={onVersementManuel}
            className="p-1.5 hover:bg-emerald-50 rounded-lg transition"
            title="Enregistrer versement espèces"
          >
            <Banknote className="w-4 h-4 text-emerald-600" />
          </button>
        )}
        <button
          onClick={handleResend}
          disabled={isPending}
          className="p-1.5 hover:bg-green-50 rounded-lg transition"
          title="Renvoyer contrat WhatsApp"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin text-green-600" /> : <Send className="w-4 h-4 text-green-600" />}
        </button>
        {moratoire.status === "active" && (
          <button
            onClick={() => handleStatus("suspended")}
            disabled={isPending}
            className="p-1.5 hover:bg-yellow-50 rounded-lg transition"
            title="Suspendre"
          >
            <Ban className="w-4 h-4 text-yellow-600" />
          </button>
        )}
        {moratoire.status === "suspended" && (
          <button
            onClick={() => handleStatus("active")}
            disabled={isPending}
            className="p-1.5 hover:bg-green-50 rounded-lg transition"
            title="Réactiver"
          >
            <RotateCcw className="w-4 h-4 text-green-600" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── CreateMoratoireModal ─────────────────────────────────────────────────────
function CreateMoratoireModal({
  actionnaires,
  onClose,
  onCreated,
}: {
  actionnaires: Actionnaire[];
  onClose: () => void;
  onCreated: (m: Moratoire) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ type: string; message: string } | null>(null);
  const [form, setForm] = useState({
    userId: "",
    actionNumber: 1000,
    totalAmount: 2000000,
    versementMontant: 83000,
    startDate: "",
    endDate: "",
  });

  // Recherche actionnaire
  const [searchActionnaire, setSearchActionnaire] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedActionnaire, setSelectedActionnaire] = useState<Actionnaire | null>(null);

  const filteredActionnaires = actionnaires.filter((a) =>
    `${a.firstName} ${a.lastName} ${a.telephone}`
      .toLowerCase()
      .includes(searchActionnaire.toLowerCase())
  );

  const selectActionnaire = (a: Actionnaire) => {
    setSelectedActionnaire(a);
    setForm({ ...form, userId: a._id });
    setSearchActionnaire(`${a.firstName} ${a.lastName}`);
    setShowDropdown(false);
  };

  // Auto-calculer le montant total quand actionNumber change (2000 FCFA/action)
  const handleActionNumberChange = (val: number) => {
    setForm({ ...form, actionNumber: val, totalAmount: val * 2000 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.userId || !form.startDate || !form.endDate) {
      setResult({ type: "error", message: "Tous les champs sont requis." });
      return;
    }
    startTransition(async () => {
      const res = await createMoratoireEngagement({
        ...form,
        actionNumber: Number(form.actionNumber),
        totalAmount: Number(form.totalAmount),
        versementMontant: Number(form.versementMontant),
      });
      if (res.type === "success") {
        onCreated(res.data);
        onClose();
      } else {
        setResult({ type: "error", message: res.message });
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-[#165DFC] to-[#1e4fd6] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Nouvel Engagement Moratoire</h2>
                <p className="text-blue-100 text-sm">Le contrat sera envoyé automatiquement par WhatsApp</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white p-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Actionnaire — recherche */}
          <div>
            <label htmlFor="search-actionnaire" className="block text-sm font-medium text-gray-700 mb-1">
              Actionnaire
            </label>
            <div className="relative">
              <UserSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                id="search-actionnaire"
                type="text"
                autoComplete="off"
                placeholder="Rechercher par nom ou téléphone..."
                value={searchActionnaire}
                onChange={(e) => {
                  setSearchActionnaire(e.target.value);
                  setShowDropdown(true);
                  if (!e.target.value) {
                    setSelectedActionnaire(null);
                    setForm({ ...form, userId: "" });
                  }
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              {showDropdown && searchActionnaire && filteredActionnaires.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                  {filteredActionnaires.slice(0, 20).map((a) => (
                    <button
                      key={a._id}
                      type="button"
                      onMouseDown={() => selectActionnaire(a)}
                      className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition text-sm flex items-center justify-between gap-2"
                    >
                      <span className="font-medium text-gray-900">
                        {a.firstName} {a.lastName}
                      </span>
                      <span className="text-xs text-gray-500 shrink-0">{a.telephone}</span>
                    </button>
                  ))}
                  {filteredActionnaires.length === 0 && (
                    <p className="px-4 py-3 text-sm text-gray-400 text-center">Aucun résultat</p>
                  )}
                </div>
              )}
              {showDropdown && searchActionnaire && filteredActionnaires.length === 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg">
                  <p className="px-4 py-3 text-sm text-gray-400 text-center">Aucun actionnaire trouvé</p>
                </div>
              )}
            </div>
            {selectedActionnaire && (
              <div className="mt-2 flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 text-xs">
                <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="text-blue-800 font-medium">
                  {selectedActionnaire.firstName} {selectedActionnaire.lastName}
                </span>
                <span className="text-blue-600">— {selectedActionnaire.telephone}</span>
                <span className="text-blue-500">— {selectedActionnaire.actionsNumber} actions actuelles</span>
              </div>
            )}
          </div>

          {/* Nombre d'actions */}
          <div>
            <label htmlFor="action-number" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre d&apos;actions à acquérir
            </label>
            <input
              id="action-number"
              type="number"
              min={1}
              value={form.actionNumber}
              onChange={(e) => handleActionNumberChange(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
          </div>

          {/* Montant total */}
          <div>
            <label htmlFor="total-amount" className="block text-sm font-medium text-gray-700 mb-1">
              Montant total à acquérir (FCFA)
              <span className="ml-2 text-xs text-gray-400 font-normal">auto-calculé, modifiable</span>
            </label>
            <input
              id="total-amount"
              type="number"
              min={1}
              value={form.totalAmount}
              onChange={(e) => setForm({ ...form, totalAmount: Number(e.target.value) })}
              className="w-full px-3 py-2.5 border border-[#165DFC] rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-[#165DFC]"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Calcul auto : {form.actionNumber} × 2 000 FCFA = {formatAmount(form.actionNumber * 2000)}
            </p>
          </div>

          {/* Montant versement */}
          <div>
            <label htmlFor="versement-montant" className="block text-sm font-medium text-gray-700 mb-1">
              Montant du versement (FCFA)
            </label>
            <input
              id="versement-montant"
              type="number"
              min={1}
              value={form.versementMontant}
              onChange={(e) => setForm({ ...form, versementMontant: Number(e.target.value) })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <input
                id="start-date"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <input
                id="end-date"
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>
          </div>

          {/* Récap */}
          <div className="bg-blue-50 rounded-xl p-4 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Actions :</span>
              <span className="font-semibold">{form.actionNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Montant total :</span>
              <span className="font-semibold text-[#165DFC]">{formatAmount(form.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Versement :</span>
              <span className="font-semibold">{formatAmount(form.versementMontant)}</span>
            </div>
          </div>

          {result?.type === "error" && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {result.message}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-3 bg-[#165DFC] text-white font-semibold rounded-xl hover:bg-[#1249cc] transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer & Envoyer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── EditVersementModal ───────────────────────────────────────────────────────
function EditVersementModal({
  moratoire,
  onClose,
  onUpdated,
}: {
  moratoire: Moratoire;
  onClose: () => void;
  onUpdated: (m: Moratoire) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [amount, setAmount] = useState(moratoire.versementMontant);
  const [result, setResult] = useState<{ type: string; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateVersementMontant(moratoire._id, amount);
      if (res.type === "success") {
        onUpdated({ ...moratoire, versementMontant: amount });
      } else {
        setResult({ type: "error", message: res.message });
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">Modifier le versement</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Actionnaire : <span className="font-medium text-gray-800">
            {moratoire.userId?.firstName} {moratoire.userId?.lastName}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-versement-amount" className="block text-sm font-medium text-gray-700 mb-1">
              Nouveau montant du versement (FCFA)
            </label>
            <input
              id="edit-versement-amount"
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
          </div>

          {result?.type === "error" && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-sm text-red-700">
              <AlertCircle className="w-4 h-4" /> {result.message}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 bg-[#165DFC] text-white font-semibold rounded-xl hover:bg-[#1249cc] transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Mettre à jour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── VersementManuelModal ─────────────────────────────────────────────────────
function VersementManuelModal({
  moratoire,
  onClose,
  onSuccess,
}: {
  moratoire: Moratoire;
  onClose: () => void;
  onSuccess: (m: Moratoire) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [amount, setAmount] = useState(moratoire.versementMontant);
  const [note, setNote] = useState("");
  const [result, setResult] = useState<{ type: string; message: string } | null>(null);

  const remaining = Math.max(0, moratoire.totalAmount - moratoire.totalPaid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setResult({ type: "error", message: "Le montant doit être supérieur à 0." });
      return;
    }
    startTransition(async () => {
      const res = await addVersementManuel(moratoire._id, amount, note || undefined);
      if (res.type === "success" && res.data) {
        onSuccess(res.data as Moratoire);
      } else {
        setResult({ type: "error", message: res.message || "Erreur lors de l'enregistrement" });
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center">
              <Banknote className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Versement espèces</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm">
          <p className="text-gray-600">
            Actionnaire : <span className="font-semibold text-gray-900">{moratoire.userId?.firstName} {moratoire.userId?.lastName}</span>
          </p>
          <p className="text-gray-600 mt-1">
            Restant dû : <span className="font-semibold text-red-600">{formatAmount(remaining)}</span>
          </p>
          <p className="text-gray-600 mt-1">
            Déjà payé : <span className="font-semibold text-green-600">{formatAmount(moratoire.totalPaid)}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="manuel-amount" className="block text-sm font-medium text-gray-700 mb-1">
              Montant reçu (FCFA)
            </label>
            <input
              id="manuel-amount"
              type="number"
              min={1}
              max={remaining}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-semibold"
              required
            />
            {amount > remaining && (
              <p className="text-xs text-amber-600 mt-1">
                ⚠ Le montant dépasse le restant dû ({formatAmount(remaining)})
              </p>
            )}
          </div>

          <div>
            <label htmlFor="manuel-note" className="block text-sm font-medium text-gray-700 mb-1">
              Note (optionnel)
            </label>
            <input
              id="manuel-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex: Versement en espèces du 05/03/2026"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          {amount > 0 && amount <= remaining && (
            <div className="bg-emerald-50 rounded-xl p-3 text-xs text-emerald-700">
              Après ce versement : <span className="font-semibold">{formatAmount(moratoire.totalPaid + amount)}</span> payés sur <span className="font-semibold">{formatAmount(moratoire.totalAmount)}</span>
              {moratoire.totalPaid + amount >= moratoire.totalAmount && (
                <p className="mt-1 font-semibold">✓ Engagement soldé — le contrat d&apos;actions sera envoyé</p>
              )}
            </div>
          )}

          {result?.type === "error" && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-sm text-red-700">
              <AlertCircle className="w-4 h-4" /> {result.message}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending || amount <= 0}
              className="flex-1 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── DetailModal ──────────────────────────────────────────────────────────────
function DetailModal({ moratoire, onClose }: { moratoire: Moratoire; onClose: () => void }) {
  const progress = moratoire.totalAmount > 0
    ? Math.min((moratoire.totalPaid / moratoire.totalAmount) * 100, 100)
    : 0;

  const confirmedVersements = moratoire.versements.filter((v) => v.status === "confirmed");

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-[#165DFC] to-[#1e4fd6] p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Détails de l&apos;engagement</h2>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Actionnaire info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Actionnaire</p>
            <p className="font-bold text-gray-900">{moratoire.userId?.firstName} {moratoire.userId?.lastName}</p>
            <p className="text-sm text-gray-600">{moratoire.userId?.telephone}</p>
          </div>

          {/* Progression */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progression</span>
              <span className="font-semibold text-[#165DFC]">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className="bg-[#165DFC] h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Payé : {formatAmount(moratoire.totalPaid)}</span>
              <span>Total : {formatAmount(moratoire.totalAmount)}</span>
            </div>
          </div>

          {/* Infos clés */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: "Actions", value: moratoire.actionNumber },
              { label: "Versement", value: formatAmount(moratoire.versementMontant) },
              { label: "Début", value: formatDate(moratoire.startDate) },
              { label: "Fin prévue", value: formatDate(moratoire.endDate) },
              { label: "Statut", value: <StatusBadge status={moratoire.status} /> },
              {
                label: "Contrat actions",
                value: moratoire.actionContractSent
                  ? <span className="text-green-600 font-medium">Envoyé ✓</span>
                  : <span className="text-gray-400">En attente</span>
              },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <div className="font-semibold text-gray-900">{value}</div>
              </div>
            ))}
          </div>

          {/* Historique versements */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Versements confirmés ({confirmedVersements.length})
            </p>
            {confirmedVersements.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Aucun versement confirmé</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {confirmedVersements.map((v) => (
                  <div key={v._id} className="flex justify-between items-center bg-green-50 rounded-lg px-3 py-2">
                    <div>
                      <span className="text-sm text-gray-700">{formatDate(v.createdAt)}</span>
                      <span className={`ml-2 text-xs px-1.5 py-0.5 rounded font-medium ${v.type === "manuel" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                        {v.type === "manuel" ? "Espèces" : "PayDunya"}
                      </span>
                      {v.note && <p className="text-xs text-gray-400 mt-0.5">{v.note}</p>}
                    </div>
                    <span className="text-sm font-semibold text-green-700">{formatAmount(v.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
