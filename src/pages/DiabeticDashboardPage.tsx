import React, { memo, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
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

  // Données simulées pour l'interface
  const currentGlucose = 118;
  const hba1c = 6.8;
  const glucoseChange = -2.5;
  const hba1cChange = -0.3;

  const glucoseReadings = [
    { time: '06:30', value: 95, status: 'normal' },
    { time: '08:30', value: 135, status: 'normal' },
    { time: '12:00', value: 110, status: 'normal' },
    { time: '14:00', value: 155, status: 'high' },
    { time: '18:00', value: 105, status: 'normal' }
  ];

  const meals = [
    { name: 'Eru aux légumes', time: '07:30', calories: 280, glucose: 135, carbs: 30 },
    { name: 'Ndolé aux légumes', time: '12:30', calories: 320, glucose: 155, carbs: 35 },
    { name: 'Poisson à la sauce tomate', time: '19:00', calories: 250, glucose: 145, carbs: 20 }
  ];

  const medications = [
    { name: 'Metformine', dosage: '500mg', time: '08:00', taken: true },
    { name: 'Insuline rapide', dosage: '8 UI', time: '12:00', taken: true },
    { name: 'Insuline lente', dosage: '20 UI', time: '22:00', taken: false }
  ];

  const alerts = [
    { type: 'warning', message: 'Glycémie élevée après le déjeuner', time: '14:15' },
    { type: 'info', message: 'Rappel: Prise de médicament dans 30min', time: '21:30' },
    { type: 'success', message: 'Objectif glycémique atteint ce matin', time: '08:30' }
  ];

  const weeklyTrends = [
    { day: 'Lun', value: 117, status: 'normal' },
    { day: 'Mar', value: 123, status: 'normal' },
    { day: 'Mer', value: 116, status: 'normal' },
    { day: 'Je', value: 113, status: 'normal' }
  ];

  const recommendedMeals = [
    { name: 'Ndolé aux légumes', type: 'Plat principal', carbs: '25g', portion: '150g', calories: 320, ig: 'IG' },
    { name: 'Salade de haricots verts', type: 'Accompagnement', carbs: '12g', portion: '200g', calories: 120 }
  ];

  useEffect(() => {
    // Simulation du chargement
    setTimeout(() => setLoading(false), 1000);
  }, []);

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
      {/* Header avec profil utilisateur */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Salut !</p>
              <p className="font-semibold text-gray-800" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
                {user.firstName} {user.lastName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-600">🔍</span>
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-600">🔔</span>
            </div>
          </div>
        </div>
      </div>

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
            {glucoseReadings.map((reading, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className={`w-full rounded-t-lg mb-2 ${
                    reading.status === 'high' ? 'bg-orange-400' : 'bg-green-400'
                  }`}
                  style={{ height: `${(reading.value / 200) * 100}px` }}
                />
                <div className="text-xs text-gray-600">{reading.value}</div>
                <div className="text-xs text-gray-500">{reading.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Repas du jour */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
            Repas du Jour
          </h3>
          <div className="space-y-3">
            {meals.map((meal, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{meal.carbs}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
                      {meal.name}
                    </p>
                    <p className="text-sm text-gray-600">{meal.time} • {meal.calories} kcal</p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${
                  meal.glucose > 140 ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {meal.glucose} mg/dL
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tendances hebdomadaires */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
            Tendances Hebdomadaires
          </h3>
          <div className="flex justify-between">
            {weeklyTrends.map((trend, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-t from-blue-200 via-green-200 to-purple-200 rounded-lg mb-2"></div>
                <div className="text-sm font-medium text-green-600">{trend.value}</div>
                <div className="text-xs text-gray-500">{trend.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Médicaments */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
            Médicaments
          </h3>
          <div className="space-y-3">
            {medications.map((med, index) => (
              <div key={index} className="flex items-center justify-between">
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
                    <p className="font-medium text-gray-800">{med.name}</p>
                    <p className="text-sm text-gray-600">{med.dosage} • {med.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertes */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
            Alertes
          </h3>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
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
            ))}
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
