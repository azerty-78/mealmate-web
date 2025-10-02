import React, { useState } from 'react';
import { Close, Add, TrendingUp, TrendingDown } from '@mui/icons-material';
import { type GlucoseReading } from '../services/api';

interface GlucoseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  readings: GlucoseReading[];
  onAddReading: (reading: Omit<GlucoseReading, 'id'>) => void | Promise<void>;
}

const GlucoseDetailsModal: React.FC<GlucoseDetailsModalProps> = ({ isOpen, onClose, readings, onAddReading }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    value: '',
    type: 'fasting' as GlucoseReading['type'],
    notes: ''
  });

  const getTypeLabel = (type: GlucoseReading['type']) => {
    switch (type) {
      case 'fasting': return 'À jeun';
      case 'before_meal': return 'Avant repas';
      case 'after_meal': return 'Après repas';
      case 'random': return 'Aléatoire';
      default: return type;
    }
  };

  const getValueColor = (value: number) => {
    if (value < 70) return 'text-red-600';
    if (value <= 140) return 'text-green-600';
    if (value <= 180) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getValueStatus = (value: number) => {
    if (value < 70) return 'Hypoglycémie';
    if (value <= 140) return 'Normal';
    if (value <= 180) return 'Élevé';
    return 'Très élevé';
  };

  const handleAdd = () => {
    if (!formData.value) return;
    
    onAddReading({
      userId: 0, // Sera remplacé par l'ID utilisateur dans le composant parent
      value: Number(formData.value),
      type: formData.type,
      timestamp: new Date().toISOString(),
      notes: formData.notes || undefined
    });
    
    setFormData({
      value: '',
      type: 'fasting',
      notes: ''
    });
    setShowAddForm(false);
  };

  const calculateAverage = (type?: GlucoseReading['type']) => {
    const filtered = type ? readings.filter(r => r.type === type) : readings;
    if (filtered.length === 0) return 0;
    return filtered.reduce((sum, r) => sum + r.value, 0) / filtered.length;
  };

  const getTrend = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Détails de la Glycémie</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Close className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl text-center">
              <p className="text-sm text-gray-600">Moyenne générale</p>
              <p className="text-2xl font-bold text-blue-600">{Math.round(calculateAverage())} mg/dL</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl text-center">
              <p className="text-sm text-gray-600">À jeun</p>
              <p className="text-2xl font-bold text-green-600">{Math.round(calculateAverage('fasting'))} mg/dL</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-xl text-center">
              <p className="text-sm text-gray-600">Avant repas</p>
              <p className="text-2xl font-bold text-yellow-600">{Math.round(calculateAverage('before_meal'))} mg/dL</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl text-center">
              <p className="text-sm text-gray-600">Après repas</p>
              <p className="text-2xl font-bold text-orange-600">{Math.round(calculateAverage('after_meal'))} mg/dL</p>
            </div>
          </div>

          {/* Graphique simple */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-medium text-gray-800 mb-4">Évolution sur 7 jours</h3>
            <div className="flex items-end justify-between space-x-2 h-32">
              {readings.slice(-7).map((reading) => {
                const height = Math.min((reading.value / 200) * 100, 100);
                return (
                  <div key={reading.id} className="flex flex-col items-center flex-1">
                    <div 
                      className={`w-full rounded-t-lg mb-2 ${
                        reading.value > 140 ? 'bg-orange-400' : 'bg-green-400'
                      }`}
                      style={{ height: `${height}px` }}
                    />
                    <div className="text-xs text-gray-600">{reading.value}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(reading.timestamp).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Liste des lectures */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-800">Historique des lectures</h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Add className="w-4 h-4" />
                <span>Ajouter</span>
              </button>
            </div>

            {/* Formulaire d'ajout */}
            {showAddForm && (
              <div className="p-4 bg-blue-50 rounded-xl">
                <h4 className="font-medium text-gray-800 mb-4">Nouvelle lecture</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valeur (mg/dL)
                    </label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as GlucoseReading['type'] }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="fasting">À jeun</option>
                      <option value="before_meal">Avant repas</option>
                      <option value="after_meal">Après repas</option>
                      <option value="random">Aléatoire</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Après exercice"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-3 mt-4">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            )}

            {/* Liste des lectures */}
            <div className="space-y-2">
              {readings.map((reading, index) => (
                <div key={reading.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      reading.value < 70 ? 'bg-red-500' :
                      reading.value <= 140 ? 'bg-green-500' :
                      reading.value <= 180 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-800">
                        {getTypeLabel(reading.type)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(reading.timestamp).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {reading.notes && (
                        <p className="text-xs text-gray-500">{reading.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getValueColor(reading.value)}`}>
                        {reading.value} mg/dL
                      </p>
                      <p className="text-xs text-gray-500">{getValueStatus(reading.value)}</p>
                    </div>
                    {index > 0 && (
                      <div className="flex items-center">
                        {getTrend(reading.value, readings[index - 1].value)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlucoseDetailsModal;
