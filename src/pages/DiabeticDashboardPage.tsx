import React, { memo, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { appointmentApi, diabeticApi, type Appointment, type DiabeticRecord } from '../services/api';
import { useToast } from '../components/ToastProvider';

const Card: React.FC<{ title: string; subtitle?: string; className?: string; children?: React.ReactNode }> = ({ title, subtitle, className, children }) => (
  <div className={`rounded-2xl p-4 sm:p-5 shadow border border-black/5 ${className || ''}`}>
    <div className="mb-3">
      <h3 className="text-xl font-semibold" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>{title}</h3>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const StatTile: React.FC<{ color: string; icon: React.ReactNode; label: string; value: string }> = ({ color, icon, label, value }) => (
  <div className={`rounded-2xl p-4 text-white`} style={{ background: color }}>
    <div className="flex items-center justify-between">
      <div className="text-2xl">{icon}</div>
      <div className="text-2xl font-semibold" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>{value}</div>
    </div>
    <div className="mt-2 text-white/90" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>{label}</div>
  </div>
);

const CircularProgress: React.FC<{ percent: number }> = ({ percent }) => (
  <div className="relative w-40 h-40 mx-auto">
    <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" stroke="#f1f5f9" strokeWidth="10" fill="none" />
      <circle cx="50" cy="50" r="45" stroke="#ec4899" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={`${Math.PI * 2 * 45}`} strokeDashoffset={`${Math.PI * 2 * 45 * (1 - percent/100)}`} />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>{Math.round(percent)}%</span>
    </div>
  </div>
);

const DiabeticDashboardPage: React.FC = memo(() => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [diabeticRecord, setDiabeticRecord] = useState<DiabeticRecord | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showApptForm, setShowApptForm] = useState(false);
  const [apptForm, setApptForm] = useState({
    date: '',
    time: '',
    type: 'consultation',
    notes: ''
  });

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [pr, appts] = await Promise.all([
          diabeticApi.getByUserId(user.id),
          appointmentApi.getByUserId(user.id),
        ]);
        if (!pr && user.profileType === 'diabetic_person') {
          // créer un dossier diabétique par défaut si manquant
          const defaultRecord: Omit<DiabeticRecord, 'id'> = {
            userId: user.id,
            diabetesType: 'type1',
            diagnosisDate: new Date().toISOString(),
            currentMedications: [],
            bloodGlucoseTargets: {
              fasting: { min: 80, max: 130 },
              beforeMeals: { min: 80, max: 130 },
              afterMeals: { min: 80, max: 180 }
            },
            hba1cTarget: 7.0,
            lastHbA1c: null,
            lastHbA1cDate: null,
            emergencyContacts: [],
            notes: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          const created = await diabeticApi.create(defaultRecord);
          setDiabeticRecord(created);
        } else {
          setDiabeticRecord(pr);
        }
        setAppointments(appts || []);
      } catch (e) {
        console.error('Erreur chargement données diabète:', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const handleApptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const apptData = {
        userId: user.id,
        date: apptForm.date,
        time: apptForm.time,
        type: apptForm.type,
        notes: apptForm.notes,
        status: 'scheduled'
      };
      await appointmentApi.create(apptData);
      showToast('Rendez-vous programmé avec succès', 'success');
      setShowApptForm(false);
      setApptForm({ date: '', time: '', type: 'consultation', notes: '' });
      // Recharger les rendez-vous
      const appts = await appointmentApi.getByUserId(user.id);
      setAppointments(appts || []);
    } catch (e) {
      showToast('Erreur lors de la programmation', 'error');
    }
  };

  const upcomingAppts = useMemo(() => {
    const now = new Date();
    return appointments
      .filter(a => new Date(`${a.date}T${a.time}`) > now)
      .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
      .slice(0, 3);
  }, [appointments]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (!user || user.profileType !== 'diabetic_person') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600">Cette page est réservée aux personnes diabétiques.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
            Tableau de Bord Diabétique
          </h1>
          <p className="text-gray-600">Bienvenue, {user.username} ! Suivez votre gestion du diabète</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatTile
            color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            icon="📊"
            label="Dernière HbA1c"
            value={diabeticRecord?.lastHbA1c ? `${diabeticRecord.lastHbA1c}%` : 'N/A'}
          />
          <StatTile
            color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            icon="💊"
            label="Médicaments"
            value={diabeticRecord?.currentMedications?.length || 0}
          />
          <StatTile
            color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            icon="📅"
            label="Rendez-vous"
            value={upcomingAppts.length}
          />
          <StatTile
            color="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
            icon="🎯"
            label="Objectif HbA1c"
            value={diabeticRecord?.hba1cTarget ? `${diabeticRecord.hba1cTarget}%` : '7.0%'}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dossier Diabétique */}
          <Card title="Mon Dossier Diabétique" className="lg:col-span-1">
            {diabeticRecord ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Type de diabète</label>
                    <p className="font-medium">{diabeticRecord.diabetesType === 'type1' ? 'Type 1' : 'Type 2'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Diagnostiqué le</label>
                    <p className="font-medium">{new Date(diabeticRecord.diagnosisDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {diabeticRecord.currentMedications.length > 0 && (
                  <div>
                    <label className="text-sm text-gray-600">Médicaments actuels</label>
                    <div className="mt-1 space-y-1">
                      {diabeticRecord.currentMedications.map((med, idx) => (
                        <div key={idx} className="text-sm bg-blue-50 px-2 py-1 rounded">
                          {med.name} - {med.dosage}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm text-gray-600">Objectifs glycémiques</label>
                  <div className="mt-1 grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-green-50 p-2 rounded text-center">
                      <div className="font-medium">À jeun</div>
                      <div>{diabeticRecord.bloodGlucoseTargets.fasting.min}-{diabeticRecord.bloodGlucoseTargets.fasting.max} mg/dL</div>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded text-center">
                      <div className="font-medium">Avant repas</div>
                      <div>{diabeticRecord.bloodGlucoseTargets.beforeMeals.min}-{diabeticRecord.bloodGlucoseTargets.beforeMeals.max} mg/dL</div>
                    </div>
                    <div className="bg-orange-50 p-2 rounded text-center">
                      <div className="font-medium">Après repas</div>
                      <div>{diabeticRecord.bloodGlucoseTargets.afterMeals.min}-{diabeticRecord.bloodGlucoseTargets.afterMeals.max} mg/dL</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Aucun dossier diabétique trouvé</p>
            )}
          </Card>

          {/* Rendez-vous */}
          <Card title="Mes Rendez-vous" className="lg:col-span-1">
            <div className="space-y-4">
              {upcomingAppts.length > 0 ? (
                upcomingAppts.map(appt => (
                  <div key={appt.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium">{appt.type}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(`${appt.date}T${appt.time}`).toLocaleDateString()} à {appt.time}
                      </div>
                    </div>
                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {appt.status}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Aucun rendez-vous programmé</p>
              )}
              
              <button
                onClick={() => setShowApptForm(true)}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Programmer un rendez-vous
              </button>
            </div>
          </Card>
        </div>

        {/* Formulaire de rendez-vous */}
        {showApptForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Programmer un rendez-vous</h3>
              <form onSubmit={handleApptSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={apptForm.date}
                    onChange={e => setApptForm({ ...apptForm, date: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Heure</label>
                  <input
                    type="time"
                    value={apptForm.time}
                    onChange={e => setApptForm({ ...apptForm, time: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Type</label>
                  <select
                    value={apptForm.type}
                    onChange={e => setApptForm({ ...apptForm, type: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 p-2"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="suivi">Suivi</option>
                    <option value="urgence">Urgence</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={apptForm.notes}
                    onChange={e => setApptForm({ ...apptForm, notes: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 p-2"
                    rows={3}
                    placeholder="Préparez vos questions, carnet de glycémie, symptômes…"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowApptForm(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Programmer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

DiabeticDashboardPage.displayName = 'DiabeticDashboardPage';

export default DiabeticDashboardPage;
