import React, { useState, useEffect } from 'react';
import { Close, Add, Delete, Edit, Save, Phone, Person } from '@mui/icons-material';

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

interface EmergencyContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: EmergencyContact[];
  onSave: (contacts: EmergencyContact[]) => void;
}

const EmergencyContactsModal: React.FC<EmergencyContactsModalProps> = ({ 
  isOpen, 
  onClose, 
  contacts, 
  onSave 
}) => {
  const [currentContacts, setCurrentContacts] = useState<EmergencyContact[]>([]);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [newContact, setNewContact] = useState<EmergencyContact>({
    name: '',
    phone: '',
    relationship: '',
    isPrimary: false
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setCurrentContacts(contacts);
  }, [contacts]);

  const handleAddContact = () => {
    if (newContact.name && newContact.phone && newContact.relationship) {
      // Si c'est le premier contact, le marquer comme principal
      if (currentContacts.length === 0) {
        newContact.isPrimary = true;
      }
      
      setCurrentContacts(prev => [...prev, newContact]);
      setNewContact({
        name: '',
        phone: '',
        relationship: '',
        isPrimary: false
      });
      setIsAdding(false);
    }
  };

  const handleEditContact = (index: number) => {
    setEditingContact({ ...currentContacts[index] });
  };

  const handleUpdateContact = () => {
    if (editingContact) {
      setCurrentContacts(prev => 
        prev.map((contact, index) => 
          index === prev.findIndex(c => c === editingContact) ? editingContact : contact
        )
      );
      setEditingContact(null);
    }
  };

  const handleDeleteContact = (index: number) => {
    const contactToDelete = currentContacts[index];
    setCurrentContacts(prev => prev.filter((_, i) => i !== index));
    
    // Si on supprime le contact principal, en marquer un autre comme principal
    if (contactToDelete.isPrimary && currentContacts.length > 1) {
      setCurrentContacts(prev => 
        prev.map((contact, i) => 
          i === 0 ? { ...contact, isPrimary: true } : contact
        )
      );
    }
  };

  const handleSetPrimary = (index: number) => {
    setCurrentContacts(prev => 
      prev.map((contact, i) => ({
        ...contact,
        isPrimary: i === index
      }))
    );
  };

  const handleSave = () => {
    onSave(currentContacts);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Contacts d'Urgence</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Add className="w-4 h-4" />
              <span>Ajouter</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Sauvegarder</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Close className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          {/* Formulaire d'ajout */}
          {isAdding && (
            <div className="p-4 bg-blue-50 rounded-xl">
              <h3 className="font-medium text-gray-800 mb-4">Nouveau contact d'urgence</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Jean Dupont"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+237 6XX XX XX XX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relation
                  </label>
                  <select
                    value={newContact.relationship}
                    onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner</option>
                    <option value="conjoint">Conjoint(e)</option>
                    <option value="parent">Parent</option>
                    <option value="enfant">Enfant</option>
                    <option value="frere_soeur">Frère/Sœur</option>
                    <option value="ami">Ami(e)</option>
                    <option value="voisin">Voisin(e)</option>
                    <option value="medecin">Médecin</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newContact.isPrimary}
                      onChange={(e) => setNewContact(prev => ({ ...prev, isPrimary: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Contact principal</span>
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-4">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddContact}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </div>
          )}

          {/* Liste des contacts */}
          <div className="space-y-3">
            {currentContacts.map((contact, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl">
                {editingContact && editingContact === contact ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={editingContact.name}
                        onChange={(e) => setEditingContact(prev => ({ ...prev, name: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nom complet"
                      />
                      <input
                        type="tel"
                        value={editingContact.phone}
                        onChange={(e) => setEditingContact(prev => ({ ...prev, phone: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Téléphone"
                      />
                      <select
                        value={editingContact.relationship}
                        onChange={(e) => setEditingContact(prev => ({ ...prev, relationship: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="conjoint">Conjoint(e)</option>
                        <option value="parent">Parent</option>
                        <option value="enfant">Enfant</option>
                        <option value="frere_soeur">Frère/Sœur</option>
                        <option value="ami">Ami(e)</option>
                        <option value="voisin">Voisin(e)</option>
                        <option value="medecin">Médecin</option>
                        <option value="autre">Autre</option>
                      </select>
                      <div className="flex items-center">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editingContact.isPrimary}
                            onChange={(e) => setEditingContact(prev => ({ ...prev, isPrimary: e.target.checked }))}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Principal</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setEditingContact(null)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleUpdateContact}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Sauvegarder
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <Person className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-800">{contact.name}</p>
                          {contact.isPrimary && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                              Principal
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{contact.phone}</span>
                          </div>
                          <span className="capitalize">{contact.relationship}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!contact.isPrimary && (
                        <button
                          onClick={() => handleSetPrimary(index)}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          Définir principal
                        </button>
                      )}
                      <button
                        onClick={() => handleEditContact(index)}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteContact(index)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Delete className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {currentContacts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Person className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Aucun contact d'urgence enregistré</p>
              <p className="text-sm">Ajoutez au moins un contact pour votre sécurité</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactsModal;
