import React, { useState } from 'react';
import { Close, Star, AccessTime, LocalDining, Restaurant } from '@mui/icons-material';
import { type MealTemplate } from '../services/api';

interface MealDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: MealTemplate | null;
  onSelectMeal: (meal: MealTemplate) => void;
}

const MealDetailsModal: React.FC<MealDetailsModalProps> = ({ isOpen, onClose, meal, onSelectMeal }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ingredients' | 'instructions' | 'nutrition'>('overview');

  if (!isOpen || !meal) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'bg-green-100 text-green-800';
      case 'moyen': return 'bg-yellow-100 text-yellow-800';
      case 'difficile': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'plat_principal': return '🍽️';
      case 'accompagnement': return '🥗';
      case 'soupe': return '🍲';
      case 'boisson': return '🥤';
      default: return '🍽️';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getCategoryIcon(meal.category)}</span>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{meal.name}</h2>
              <p className="text-sm text-gray-600">{meal.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Close className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Onglets */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'overview', label: 'Aperçu', icon: Star },
              { key: 'ingredients', label: 'Ingrédients', icon: LocalDining },
              { key: 'instructions', label: 'Instructions', icon: AccessTime },
              { key: 'nutrition', label: 'Nutrition', icon: Restaurant }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Contenu des onglets */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Informations de base */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <AccessTime className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Préparation</p>
                  <p className="font-bold text-blue-600">{meal.prepTime} min</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl text-center">
                  <AccessTime className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Cuisson</p>
                  <p className="font-bold text-green-600">{meal.cookTime} min</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl text-center">
                  <LocalDining className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Portions</p>
                  <p className="font-bold text-purple-600">{meal.servings}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl text-center">
                  <Star className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Difficulté</p>
                  <p className="font-bold text-orange-600 capitalize">{meal.difficulty}</p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Caractéristiques</h3>
                <div className="flex flex-wrap gap-2">
                  {meal.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Compatibilité diabète */}
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <h3 className="font-medium text-gray-800">Compatible diabète</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Ce plat est adapté pour les personnes diabétiques de type {meal.suitableFor.join(' et ')}.
                </p>
                <p className="text-sm text-gray-700 font-medium">💡 {meal.tips}</p>
              </div>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Ingrédients pour {meal.servings} portions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meal.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        ingredient.type === 'protéine' ? 'bg-red-500' :
                        ingredient.type === 'légume' ? 'bg-green-500' :
                        ingredient.type === 'céréale' ? 'bg-yellow-500' :
                        ingredient.type === 'lipide' ? 'bg-blue-500' :
                        'bg-gray-500'
                      }`} />
                      <span className="font-medium text-gray-800">{ingredient.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{ingredient.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Instructions de préparation</h3>
              <div className="space-y-3">
                {meal.instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="space-y-6">
              <h3 className="font-medium text-gray-800">Valeurs nutritionnelles par portion</h3>
              
              {/* Valeurs principales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-red-50 rounded-xl text-center">
                  <p className="text-sm text-gray-600">Calories</p>
                  <p className="text-2xl font-bold text-red-600">{meal.nutritionalValues.calories}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <p className="text-sm text-gray-600">Protéines</p>
                  <p className="text-2xl font-bold text-blue-600">{meal.nutritionalValues.proteins}g</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-xl text-center">
                  <p className="text-sm text-gray-600">Glucides</p>
                  <p className="text-2xl font-bold text-yellow-600">{meal.nutritionalValues.carbs}g</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl text-center">
                  <p className="text-sm text-gray-600">Fibres</p>
                  <p className="text-2xl font-bold text-green-600">{meal.nutritionalValues.fiber}g</p>
                </div>
              </div>

              {/* Valeurs secondaires */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Lipides</p>
                  <p className="font-bold text-gray-800">{meal.nutritionalValues.fats}g</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Sucres</p>
                  <p className="font-bold text-gray-800">{meal.nutritionalValues.sugar}g</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Sodium</p>
                  <p className="font-bold text-gray-800">{meal.nutritionalValues.sodium}mg</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Index glycémique</p>
                  <p className="font-bold text-gray-800">{meal.nutritionalValues.glycemicIndex}</p>
                </div>
              </div>

              {/* Indice glycémique */}
              <div className="p-4 bg-blue-50 rounded-xl">
                <h4 className="font-medium text-gray-800 mb-2">Index glycémique</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        meal.nutritionalValues.glycemicIndex <= 55 ? 'bg-green-500' :
                        meal.nutritionalValues.glycemicIndex <= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((meal.nutritionalValues.glycemicIndex / 100) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {meal.nutritionalValues.glycemicIndex <= 55 ? 'Faible' :
                     meal.nutritionalValues.glycemicIndex <= 70 ? 'Modéré' : 'Élevé'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Fermer
          </button>
          <button
            onClick={() => {
              onSelectMeal(meal);
              onClose();
            }}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sélectionner ce plat
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealDetailsModal;
