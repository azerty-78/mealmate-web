import React, { memo, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { diabeticApi, glucoseApi, mealApi, mealTemplateApi, medicationLogApi, type DiabeticRecord, type GlucoseReading, type Meal, type MealTemplate, type MedicationLog } from '../services/api';
import { 
  Favorite, 
  Info, 
  Warning, 
  CheckCircle, 
  Schedule
} from '@mui/icons-material';
import MedicationModal from '../components/MedicationModal';
import GlucoseDetailsModal from '../components/GlucoseDetailsModal';
import MealDetailsModal from '../components/MealDetailsModal';


const DiabeticDashboardPage: React.FC = memo(() => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | '7days' | '30days'>('today');
  
  // États pour les données réelles
  const [diabeticRecord, setDiabeticRecord] = useState<DiabeticRecord | null>(null);
  const [glucoseReadings, setGlucoseReadings] = useState<GlucoseReading[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [recommendedMeals, setRecommendedMeals] = useState<MealTemplate[]>([]);

  // États pour les modaux
  const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);
  const [isGlucoseModalOpen, setIsGlucoseModalOpen] = useState(false);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<MealTemplate | null>(null);

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

  // Fonction pour charger les repas recommandés
  const loadRecommendedMeals = async () => {
    try {
      const allMeals = await mealTemplateApi.getDiabeticFriendly();
      // Afficher tous les repas diabète-friendly actifs
      setRecommendedMeals((allMeals || []).filter(m => m.isActive !== false));
    } catch (error) {
      console.error('Erreur lors du chargement des repas recommandés:', error);
    }
  };

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
        
        // Charger les repas recommandés
        await loadRecommendedMeals();
        
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Fonctions pour gérer les médicaments
  const handleMedicationSave = async (medications: any[]) => {
    if (!diabeticRecord) return;
    
    try {
      const updated = await diabeticApi.update(diabeticRecord.id, {
        ...diabeticRecord,
        currentMedications: medications
      });
      setDiabeticRecord(updated);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des médicaments:', error);
    }
  };

  // Marquer une prise de médicament (création d'un log)
  const handleMarkMedicationTaken = async (medication: { name: string; dosage: string }) => {
    try {
      if (!user) return;
      const nowIso = new Date().toISOString();
      const created = await medicationLogApi.create({
        userId: user.id,
        medicationName: medication.name,
        dosage: medication.dosage,
        scheduledTime: nowIso,
        takenTime: nowIso,
        taken: true,
        notes: 'Marqué comme pris depuis le tableau de bord'
      } as any);
      // Rafraîchir la liste des logs localement
      setMedicationLogs(prev => [...prev, created]);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la prise de médicament:', error);
    }
  };

  // Fonction pour ajouter une lecture de glycémie
  const handleAddGlucoseReading = async (reading: Omit<GlucoseReading, 'id'>) => {
    try {
      const newReading = await glucoseApi.create({
        ...reading,
        userId: user!.id
      });
      setGlucoseReadings(prev => [...prev, newReading]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la lecture:', error);
    }
  };

  // Fonction pour sélectionner un repas
  const handleSelectMeal = (meal: MealTemplate) => {
    // Ici vous pouvez ajouter la logique pour enregistrer le repas sélectionné
    console.log('Repas sélectionné:', meal);
  };

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
            <button 
              onClick={() => setIsGlucoseModalOpen(true)}
              className="text-blue-600 text-sm font-medium" 
              style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}
            >
              Détails
            </button>
          </div>
          
          {/* Graphique en barres */}
          <div className="flex items-end justify-between space-x-2 h-32">
            {glucoseReadings.slice(-5).map((reading) => {
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
              Médicaments
            </h3>
            <button 
              onClick={() => setIsMedicationModalOpen(true)}
              className="text-blue-600 text-sm font-medium"
            >
              Gérer
            </button>
          </div>
          <div className="space-y-3">
            {diabeticRecord?.currentMedications?.slice(0, 3).map((med, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    med.isActive ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    {med.isActive ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <Schedule className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{med.name}</p>
                    <p className="text-sm text-gray-600">{med.dosage} • {med.frequency}</p>
                    <p className="text-xs text-gray-500">Heures: {med.times.join(', ')}</p>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => handleMarkMedicationTaken({ name: med.name, dosage: med.dosage })}
                    className="px-3 py-1.5 text-sm rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                  >
                    Marquer pris
                  </button>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-4">Aucun médicament enregistré</p>
            )}
          </div>
        </div>

        {/* Alertes */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
            Alertes
          </h3>
          <div className="space-y-3">
            {alerts.length > 0 ? alerts.map((alert, index) => (
              <div 
                key={index} 
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => {
                  // Ici vous pouvez ajouter une logique pour afficher plus de détails sur l'alerte
                  console.log('Alerte cliquée:', alert);
                }}
              >
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
                <div className="text-xs text-gray-400">Cliquer pour plus de détails</div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">Aucune alerte pour le moment</p>
            )}
          </div>
        </div>

        {/* Dernières prises de médicaments */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
            Dernières prises de médicaments
          </h3>
          <div className="space-y-3">
            {(medicationLogs || []).slice(-5).map((log) => {
              const time = new Date(log.takenTime || log.scheduledTime).toLocaleString('fr-FR', {
                hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
              });
              return (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${log.taken ? 'bg-green-500' : 'bg-gray-400'}`}>
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{log.medicationName} — {log.dosage}</p>
                      <p className="text-xs text-gray-600">{time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {(!medicationLogs || medicationLogs.length === 0) && (
              <p className="text-gray-500 text-center py-4">Aucune prise enregistrée</p>
            )}
          </div>
        </div>

        {/* Plats recommandés */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
              Plats Recommandés (Cuisine Camerounaise)
            </h3>
            <button 
              onClick={() => {
                // Charger tous les repas recommandés et ouvrir une vue étendue
                loadRecommendedMeals();
              }}
              className="text-blue-600 text-sm font-medium"
            >
              Voir tous
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {recommendedMeals.map((meal) => (
              <div 
                key={meal.id} 
                className="p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setSelectedMeal(meal);
                  setIsMealModalOpen(true);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600 capitalize">{meal.category.replace('_', ' ')}</span>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">IG</span>
                  </div>
                </div>
                <p className="font-medium text-gray-800 text-sm mb-1" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
                  {meal.name}
                </p>
                <p className="text-xs text-gray-600 mb-1">{meal.nutritionalValues.carbs}g glucides</p>
                <p className="text-xs text-gray-600 mb-1">Portion: {meal.servings} personnes</p>
                <p className="text-xs font-medium text-gray-800">{meal.nutritionalValues.calories} kcal</p>
                <p className="text-xs text-blue-600 mt-2">Cliquer pour plus de détails</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>
            Actions Rapides
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setIsGlucoseModalOpen(true)}
              className="p-4 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📊</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-800">Ajouter Glycémie</p>
              <p className="text-xs text-gray-600">Enregistrer une mesure</p>
            </button>
            
            <button 
              onClick={() => {/* TODO: Ouvrir modal ajout repas */}}
              className="p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🍽️</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-800">Ajouter Repas</p>
              <p className="text-xs text-gray-600">Enregistrer un repas</p>
            </button>
            
            <button 
              onClick={() => setIsMedicationModalOpen(true)}
              className="p-4 bg-purple-50 rounded-xl border border-purple-200 hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">💊</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-800">Médicament</p>
              <p className="text-xs text-gray-600">Marquer comme pris</p>
            </button>
            
            <button 
              onClick={() => {/* TODO: Ouvrir modal paramètres */}}
              className="p-4 bg-orange-50 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors"
            >
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">⚙️</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-800">Paramètres</p>
              <p className="text-xs text-gray-600">Modifier profil</p>
            </button>
          </div>
        </div>
      </div>

      {/* Modaux */}
      <MedicationModal
        isOpen={isMedicationModalOpen}
        onClose={() => setIsMedicationModalOpen(false)}
        medications={diabeticRecord?.currentMedications || []}
        onSave={handleMedicationSave}
      />

      <GlucoseDetailsModal
        isOpen={isGlucoseModalOpen}
        onClose={() => setIsGlucoseModalOpen(false)}
        readings={glucoseReadings}
        onAddReading={handleAddGlucoseReading}
      />

      <MealDetailsModal
        isOpen={isMealModalOpen}
        onClose={() => setIsMealModalOpen(false)}
        meal={selectedMeal}
        onSelectMeal={handleSelectMeal}
      />
    </div>
  );
});

DiabeticDashboardPage.displayName = 'DiabeticDashboardPage';

export default DiabeticDashboardPage;
