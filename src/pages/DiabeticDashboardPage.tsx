import React, { memo, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { diabeticApi, glucoseApi, mealApi, medicationLogApi, type DiabeticRecord, type GlucoseReading, type Meal, type MedicationLog } from '../services/api';
import { 
  Favorite, 
  Info, 
  Warning, 
  CheckCircle, 
  Schedule
} from '@mui/icons-material';

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
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | '7days' | '30days'>('today');
  
  // États pour les données réelles
  const [diabeticRecord, setDiabeticRecord] = useState<DiabeticRecord | null>(null);
  const [glucoseReadings, setGlucoseReadings] = useState<GlucoseReading[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);

  // Données calculées
  const currentGlucose = glucoseReadings.length > 0 ? glucoseReadings[glucoseReadings.length - 1].value : 0;
  const hba1c = diabeticRecord?.lastHbA1c || 0;
  const glucoseChange = 0; // À calculer selon les données
  const hba1cChange = 0; // À calculer selon les données

  // Alertes générées dynamiquement
  const alerts = [
    ...(currentGlucose > 180 ? [{ type: 'warning', message: 'Glycémie élevée détectée', time: new Date().toLocaleTimeString() }] : []),
    ...(medicationLogs.filter(log => !log.taken && new Date(log.scheduledTime) <= new Date()).length > 0 ? 
      [{ type: 'info', message: 'Médicament en retard', time: new Date().toLocaleTimeString() }] : []),
    ...(currentGlucose >= 80 && currentGlucose <= 130 ? 
      [{ type: 'success', message: 'Glycémie dans la normale', time: new Date().toLocaleTimeString() }] : [])
  ];

  const recommendedMeals = [
    { name: 'Ndolé aux légumes', type: 'Plat principal', carbs: '25g', portion: '150g', calories: 320, ig: 'IG' },
    { name: 'Salade de haricots verts', type: 'Accompagnement', carbs: '12g', portion: '200g', calories: 120 }
  ];

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Charger les données en parallèle
        const [diabeticData, glucoseData, mealsData, medicationData] = await Promise.all([
          diabeticApi.getByUserId(user.id),
          glucoseApi.getByUserId(user.id),
          mealApi.getByUserId(user.id),
          medicationLogApi.getByUserId(user.id)
        ]);

        setDiabeticRecord(diabeticData);
        setGlucoseReadings(glucoseData);
        setMeals(mealsData);
        setMedicationLogs(medicationData);
        
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (!user || user.profileType !== 'diabetic_person') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600">Cette page est réservée aux personnes diabétiques.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-6 space-y-6">
        {/* Titre principal */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
            Tableau de Bord Diabète
          </h1>
          <p className="text-gray-600 text-sm">Suivi personnalisé avec plats camerounais</p>
        </div>

        {/* Filtres de période */}
        <div className="flex justify-center space-x-2">
          {[
            { key: 'today', label: 'Aujourd\'hui' },
            { key: '7days', label: '7 jours' },
            { key: '30days', label: '30 jours' }
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedPeriod === period.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-300'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Cartes de métriques principales */}
        <div className="grid grid-cols-2 gap-4">
          {/* Glycémie actuelle */}
          <div className="bg-green-50 rounded-2xl p-4 relative">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-gray-700">Glycémie Actuelle</h3>
              <Favorite className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
              {currentGlucose} mg/dL
            </div>
            <div className="text-sm text-green-600 font-medium">
              {glucoseChange > 0 ? '+' : ''}{glucoseChange}%
            </div>
          </div>

          {/* HbA1c */}
          <div className="bg-purple-50 rounded-2xl p-4 relative">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-gray-700">HbA1c</h3>
              <Info className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
              {hba1c} %
            </div>
            <div className="text-sm text-green-600 font-medium">
              {hba1cChange > 0 ? '+' : ''}{hba1cChange}%
            </div>
          </div>
        </div>

        {/* Évolution de la glycémie */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
              Évolution Glycémie
            </h3>
            <button className="text-blue-600 text-sm font-medium" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
              Détails
            </button>
          </div>
          
          {/* Graphique en barres */}
          <div className="flex items-end justify-between space-x-2 h-32">
            {glucoseReadings.slice(-5).map((reading, index) => {
              const isHigh = reading.value > 140;
              const time = new Date(reading.timestamp).toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              });
              return (
                <div key={reading.id} className="flex flex-col items-center flex-1">
                  <div 
                    className={`w-full rounded-t-lg mb-2 ${
                      isHigh ? 'bg-orange-400' : 'bg-green-400'
                    }`}
                    style={{ height: `${Math.min((reading.value / 200) * 100, 100)}px` }}
                  />
                  <div className="text-xs text-gray-600">{reading.value}</div>
                  <div className="text-xs text-gray-500">{time}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Repas du jour */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
            Repas du Jour
          </h3>
          <div className="space-y-3">
            {meals.slice(-3).map((meal) => {
              const time = new Date(meal.timestamp).toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              });
              const glucoseAfter = meal.glucoseAfter || 0;
              return (
                <div key={meal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{meal.carbs}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
                        {meal.name}
                      </p>
                      <p className="text-sm text-gray-600">{time} • {meal.calories} kcal</p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    glucoseAfter > 140 ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {glucoseAfter} mg/dL
                  </div>
                </div>
              );
            })}
          </div>
        </div>


        {/* Médicaments */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
            Médicaments
          </h3>
          <div className="space-y-3">
            {medicationLogs.slice(-3).map((med) => {
              const time = new Date(med.scheduledTime).toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              });
              return (
                <div key={med.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      med.taken ? 'bg-green-500' : 'bg-orange-100'
                    }`}>
                      {med.taken ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <Schedule className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{med.medicationName}</p>
                      <p className="text-sm text-gray-600">{med.dosage} • {time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alertes */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
            Alertes
          </h3>
          <div className="space-y-3">
            {alerts.length > 0 ? alerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  alert.type === 'warning' ? 'bg-orange-100' :
                  alert.type === 'info' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {alert.type === 'warning' ? (
                    <Warning className="w-4 h-4 text-orange-600" />
                  ) : alert.type === 'info' ? (
                    <Info className="w-4 h-4 text-blue-600" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">Aucune alerte pour le moment</p>
            )}
          </div>
        </div>

        {/* Plats recommandés */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
            Plats Recommandés (Cuisine Camerounaise)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {recommendedMeals.map((meal, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600">{meal.type}</span>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{meal.ig}</span>
                  </div>
                </div>
                <p className="font-medium text-gray-800 text-sm mb-1" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
                  {meal.name}
                </p>
                <p className="text-xs text-gray-600 mb-1">{meal.carbs} glucides</p>
                <p className="text-xs text-gray-600 mb-1">Portion: {meal.portion}</p>
                <p className="text-xs font-medium text-gray-800">{meal.calories} kcal</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

DiabeticDashboardPage.displayName = 'DiabeticDashboardPage';

export default DiabeticDashboardPage;
