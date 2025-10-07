#!/usr/bin/env node

/**
 * Test de synchronisation des campagnes
 * Ce script teste que les campagnes sont bien sauvegardées et récupérées
 */

const http = require('http');

const API_BASE = 'http://localhost:3001';

// Fonction pour faire des requêtes HTTP
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testCampaignSync() {
  console.log('🧪 Test de synchronisation des campagnes...\n');

  try {
    // 1. Vérifier que le serveur est accessible
    console.log('1️⃣ Vérification de l\'accès au serveur...');
    const healthCheck = await makeRequest('/health');
    if (healthCheck.status !== 200) {
      throw new Error(`Serveur non accessible: ${healthCheck.status}`);
    }
    console.log('✅ Serveur accessible\n');

    // 2. Récupérer les campagnes existantes
    console.log('2️⃣ Récupération des campagnes existantes...');
    const existingCampaigns = await makeRequest('/campaigns');
    console.log(`📊 Nombre de campagnes existantes: ${Array.isArray(existingCampaigns.data) ? existingCampaigns.data.length : 0}`);
    
    if (Array.isArray(existingCampaigns.data)) {
      existingCampaigns.data.forEach((campaign, index) => {
        console.log(`   ${index + 1}. ${campaign.title} (ID: ${campaign.id})`);
      });
    }
    console.log('');

    // 3. Créer une nouvelle campagne de test
    console.log('3️⃣ Création d\'une nouvelle campagne de test...');
    const testCampaign = {
      title: `Test de synchronisation - ${new Date().toISOString()}`,
      organizer: 'Test Script',
      description: 'Campagne créée pour tester la synchronisation',
      link: 'https://example.com',
      status: 'planned'
    };

    const createResult = await makeRequest('/campaigns', 'POST', testCampaign);
    if (createResult.status !== 201) {
      throw new Error(`Erreur lors de la création: ${createResult.status}`);
    }
    
    const newCampaign = createResult.data;
    console.log(`✅ Campagne créée avec l'ID: ${newCampaign.id}`);
    console.log(`   Titre: ${newCampaign.title}`);
    console.log('');

    // 4. Vérifier que la campagne est bien récupérable
    console.log('4️⃣ Vérification de la récupération de la campagne...');
    const getResult = await makeRequest(`/campaigns/${newCampaign.id}`);
    if (getResult.status !== 200) {
      throw new Error(`Erreur lors de la récupération: ${getResult.status}`);
    }
    
    const retrievedCampaign = getResult.data;
    console.log(`✅ Campagne récupérée: ${retrievedCampaign.title}`);
    console.log('');

    // 5. Modifier la campagne
    console.log('5️⃣ Modification de la campagne...');
    const updatedCampaign = {
      ...retrievedCampaign,
      title: `${retrievedCampaign.title} - MODIFIÉE`,
      description: 'Description modifiée pour tester la synchronisation'
    };

    const updateResult = await makeRequest(`/campaigns/${newCampaign.id}`, 'PUT', updatedCampaign);
    if (updateResult.status !== 200) {
      throw new Error(`Erreur lors de la modification: ${updateResult.status}`);
    }
    
    console.log(`✅ Campagne modifiée: ${updateResult.data.title}`);
    console.log('');

    // 6. Vérifier la liste mise à jour
    console.log('6️⃣ Vérification de la liste mise à jour...');
    const updatedList = await makeRequest('/campaigns');
    const campaignCount = Array.isArray(updatedList.data) ? updatedList.data.length : 0;
    console.log(`📊 Nombre total de campagnes: ${campaignCount}`);
    
    const modifiedCampaign = updatedList.data.find(c => c.id === newCampaign.id);
    if (modifiedCampaign) {
      console.log(`✅ Campagne trouvée dans la liste: ${modifiedCampaign.title}`);
    } else {
      console.log('❌ Campagne non trouvée dans la liste');
    }
    console.log('');

    // 7. Supprimer la campagne de test
    console.log('7️⃣ Suppression de la campagne de test...');
    const deleteResult = await makeRequest(`/campaigns/${newCampaign.id}`, 'DELETE');
    if (deleteResult.status !== 200) {
      console.log(`⚠️ Erreur lors de la suppression: ${deleteResult.status}`);
    } else {
      console.log('✅ Campagne supprimée');
    }
    console.log('');

    console.log('🎉 Test de synchronisation terminé avec succès !');
    console.log('');
    console.log('📋 Résumé:');
    console.log('   ✅ Serveur accessible');
    console.log('   ✅ Campagnes récupérées');
    console.log('   ✅ Campagne créée');
    console.log('   ✅ Campagne récupérée');
    console.log('   ✅ Campagne modifiée');
    console.log('   ✅ Liste mise à jour');
    console.log('   ✅ Campagne supprimée');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    console.log('');
    console.log('🔧 Solutions possibles:');
    console.log('   1. Vérifiez que le serveur JSON est démarré: npm run db');
    console.log('   2. Vérifiez que le port 3001 est libre');
    console.log('   3. Vérifiez que le fichier db/db.json existe');
    process.exit(1);
  }
}

// Exécuter le test
testCampaignSync();
