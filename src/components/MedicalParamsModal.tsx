import React, { useState, useEffect } from 'react';
import { Close, Save, Edit, Add, Delete } from '@mui/icons-material';
import { type DiabeticRecord } from '../services/api';

interface MedicalParamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  diabeticRecord: DiabeticRecord | null;
  onSave: (updatedRecord: Partial<DiabeticRecord>) => void;
}

const MedicalParamsModal: React.FC<MedicalParamsModalProps> = ({ 
  isOpen, 
  onClose, 
  diabeticRecord, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    diabetesType: 'type1' as 'type1' | 'type2' | 'gestational' | 'other',
    diagnosisDate: '',
    lastHbA1c: '',
    lastHbA1cDate: '',
    hba1cTarget: '',
    bloodGlucoseTargets: {
      fasting: { min: '', max: '' },
      beforeMeals: { min: '', max: '' },
      afterMeals: { min: '', max: '' }
    },
    notes: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (diabeticRecord) {
      setFormData({
        diabetesType: diabeticRecord.diabetesType,
        diagnosisDate: diabeticRecord.diagnosisDate.split('T')[0],
        lastHbA1c: diabeticRecord.lastHbA1c.toString(),
        lastHbA1cDate: diabeticRecord.lastHbA1cDate ? diabeticRecord.lastHbA1cDate.split('T')[0] : '',
        hba1cTarget: diabeticRecord.hba1cTarget.toString(),
        bloodGlucoseTargets: {
          fasting: {
            min: diabeticRecord.bloodGlucoseTargets.fasting.min.toString(),
            max: diabeticRecord.bloodGlucoseTargets.fasting.max.toString()
          },
          beforeMeals: {
            min: diabeticRecord.bloodGlucoseTargets.beforeMeals.min.toString(),
            max: diabeticRecord.bloodGlucoseTargets.beforeMeals.max.toString()
          },
          afterMeals: {
            min: diabeticRecord.bloodGlucoseTargets.afterMeals.min.toString(),
            max: diabeticRecord.bloodGlucoseTargets.afterMeals.max.toString()
          }
        },
        notes: diabeticRecord.notes || ''
      });
    }
  }, [diabeticRecord]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedData = {
        diabetesType: formData.diabetesType,
        diagnosisDate: formData.diagnosisDate,
        lastHbA1c: parseFloat(formData.lastHbA1c),
        lastHbA1cDate: formData.lastHbA1cDate,
        hba1cTarget: parseFloat(formData.hba1cTarget),
        bloodGlucoseTargets: {
          fasting: {
            min: parseInt(formData.bloodGlucoseTargets.fasting.min),
            max: parseInt(formData.bloodGlucoseTargets.fasting.max)
          },
          beforeMeals: {
            min: parseInt(formData.bloodGlucoseTargets.beforeMeals.min),
            max: parseInt(formData.bloodGlucoseTargets.beforeMeals.max)
          },
          afterMeals: {
            min: parseInt(formData.bloodGlucoseTargets.afterMeals.min),
            max: parseInt(formData.bloodGlucoseTargets.afterMeals.max)
          }
        },
        notes: formData.notes
      };

      await onSave(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Paramètres Médicaux</h2>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Modifier</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Close className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Type de diabète */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de diabète
              </label>
              <select
                name="diabetesType"
                value={formData.diabetesType}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="type1">Type 1</option>
                <option value="type2">Type 2</option>
                <option value="gestational">Gestationnel</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de diagnostic
              </label>
              <input
                type="date"
                name="diagnosisDate"
                value={formData.diagnosisDate}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* HbA1c */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HbA1c actuel (%)
              </label>
              <input
                type="number"
                step="0.1"
                name="lastHbA1c"
                value={formData.lastHbA1c}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="7.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date du dernier HbA1c
              </label>
              <input
                type="date"
                name="lastHbA1cDate"
                value={formData.lastHbA1cDate}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* HbA1c cible */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HbA1c cible (%)
            </label>
            <input
              type="number"
              step="0.1"
              name="hba1cTarget"
              value={formData.hba1cTarget}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="7.0"
            />
          </div>

          {/* Objectifs glycémiques */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Objectifs glycémiques (mg/dL)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  À jeun
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="bloodGlucoseTargets.fasting.min"
                    value={formData.bloodGlucoseTargets.fasting.min}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    name="bloodGlucoseTargets.fasting.max"
                    value={formData.bloodGlucoseTargets.fasting.max}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="Max"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avant repas
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="bloodGlucoseTargets.beforeMeals.min"
                    value={formData.bloodGlucoseTargets.beforeMeals.min}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    name="bloodGlucoseTargets.beforeMeals.max"
                    value={formData.bloodGlucoseTargets.beforeMeals.max}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="Max"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Après repas
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="bloodGlucoseTargets.afterMeals.min"
                    value={formData.bloodGlucoseTargets.afterMeals.min}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    name="bloodGlucoseTargets.afterMeals.max"
                    value={formData.bloodGlucoseTargets.afterMeals.max}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes médicales
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="Notes importantes sur votre diabète..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalParamsModal;
