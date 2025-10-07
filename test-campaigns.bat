@echo off
echo 🧪 Test de synchronisation des campagnes MealMate
echo ================================================
echo.

echo 1️⃣ Vérification du serveur JSON...
curl -s http://localhost:3001/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Serveur JSON non accessible. Démarrez-le avec: npm run db
    pause
    exit /b 1
)
echo ✅ Serveur JSON accessible

echo.
echo 2️⃣ Test de l'API des campagnes...
node test-campaign-sync.js
if %errorlevel% neq 0 (
    echo ❌ Test de l'API échoué
    pause
    exit /b 1
)

echo.
echo 3️⃣ Ouverture de l'interface de test...
start test-campaign-ui.html

echo.
echo ✅ Tests terminés !
echo.
echo 📋 Instructions pour tester manuellement:
echo    1. Ouvrez l'admin dashboard (http://localhost:5173)
echo    2. Créez ou modifiez une campagne
echo    3. Vérifiez qu'elle apparaît dans la page d'accueil
echo    4. Utilisez l'interface de test ouverte pour vérifier l'API
echo.
pause
