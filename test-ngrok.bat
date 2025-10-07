@echo off
echo 🌍 Test de configuration ngrok pour MealMate
echo ============================================
echo.

echo 1️⃣ Vérification de ngrok...
ngrok version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ngrok non installé
    echo.
    echo 📦 Installation automatique...
    npm run ngrok:setup
    if %errorlevel% neq 0 (
        echo ❌ Installation échouée
        echo 📖 Installez manuellement: https://ngrok.com/download
        pause
        exit /b 1
    )
) else (
    echo ✅ Ngrok installé
)

echo.
echo 2️⃣ Vérification de la configuration...
if not exist "ngrok.yml" (
    echo ❌ Fichier ngrok.yml manquant
    echo 🔧 Création de la configuration...
    npm run ngrok:setup
) else (
    echo ✅ Configuration ngrok.yml trouvée
)

echo.
echo 3️⃣ Test de démarrage...
echo 🚀 Démarrage de l'application avec ngrok...
echo.
echo 📋 Instructions:
echo    - L'application va démarrer automatiquement
echo    - Des URLs ngrok seront générées
echo    - Partagez ces URLs pour accéder à l'application
echo    - Appuyez sur Ctrl+C pour arrêter
echo.

pause
npm run ngrok
