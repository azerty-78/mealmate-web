import React, { useState } from 'react';
import { Close, Add, Edit, Delete, Save, Cancel } from '@mui/icons-material';

interface Medication {
  id?: number;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  isActive: boolean;
}

interface MedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  medications: Medication[];
  onSave: (medications: Medication[]) => void;
}

const MedicationModal: React.FC<MedicationModalProps> = ({ isOpen, onClose, medications, onSave }) => {
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [formData, setFormData] = useState<Medication>({
    name: '',
    dosage: '',
    frequency: '',
    times: [],
    isActive: true
  });

  const handleAdd = () => {
    setEditingMed({ ...formData, id: Date.now() });
    setFormData({
      name: '',
      dosage: '',
      frequency: '',
      times: [],
      isActive: true
    });
  };

  const handleEdit = (med: Medication) => {
    setEditingMed(med);
    setFormData(med);
  };

  const handleDelete = (id: number) => {
    const updated = medications.filter(med => med.id !== id);
    onSave(updated);
  };

  const handleSave = () => {
    if (!editingMed) return;
    
    const updated = editingMed.id 
      ? medications.map(med => med.id === editingMed.id ? editingMed : med)
      : [...medications, editingMed];
    
    onSave(updated);
    setEditingMed(null);
    setFormData({
      name: '',
      dosage: '',
      frequency: '',
      times: [],
      isActive: true
    });
  };

  const handleCancel = () => {
    setEditingMed(null);
    setFormData({
      name: '',
      dosage: '',
      frequency: '',
      times: [],
      isActive: true
    });
  };

  const addTime = () => {
    setFormData(prev => ({
      ...prev,
      times: [...prev.times, '08:00']
    }));
  };

  const updateTime = (index: number, time: string) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.map((t, i) => i === index ? time : t)
    }));
  };

  const removeTime = (index: number) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Gestion des Médicaments</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Close className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Liste des médicaments */}
          <div className="space-y-3">
            {medications.map((med) => (
              <div key={med.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${med.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <div>
                      <p className="font-medium text-gray-800">{med.name}</p>
                      <p className="text-sm text-gray-600">{med.dosage} • {med.frequency}</p>
                      <p className="text-xs text-gray-500">Heures: {med.times.join(', ')}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(med)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => med.id && handleDelete(med.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Delete className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Formulaire d'ajout/modification */}
          {editingMed && (
            <div className="p-4 bg-blue-50 rounded-xl">
              <h3 className="font-medium text-gray-800 mb-4">
                {editingMed.id ? 'Modifier le médicament' : 'Nouveau médicament'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du médicament
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Metformine"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dosage
                    </label>
                    <input
                      type="text"
                      value={formData.dosage}
                      onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 500mg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fréquence
                    </label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner</option>
                      <option value="1 fois par jour">1 fois par jour</option>
                      <option value="2 fois par jour">2 fois par jour</option>
                      <option value="3 fois par jour">3 fois par jour</option>
                      <option value="Avant repas">Avant repas</option>
                      <option value="Après repas">Après repas</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heures de prise
                  </label>
                  <div className="space-y-2">
                    {formData.times.map((time, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => updateTime(index, e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => removeTime(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Delete className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addTime}
                      className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Add className="w-4 h-4" />
                      <span>Ajouter une heure</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Médicament actif
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Cancel className="w-4 h-4" />
                  <span>Annuler</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </button>
              </div>
            </div>
          )}

          {/* Bouton d'ajout */}
          {!editingMed && (
            <button
              onClick={handleAdd}
              className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <Add className="w-5 h-5" />
              <span>Ajouter un médicament</span>
            </button>
          )}
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

export default MedicationModal;
