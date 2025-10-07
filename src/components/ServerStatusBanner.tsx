import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, Button, Collapse, IconButton } from '@mui/material';
import { Close, Refresh, Storage, Warning } from '@mui/icons-material';

interface ServerStatusBannerProps {
  onRetry?: () => void;
}

export const ServerStatusBanner: React.FC<ServerStatusBannerProps> = ({ onRetry }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Vérifier le statut du serveur au chargement
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      setIsChecking(true);
      const response = await fetch('/api/health', {
        method: 'HEAD',
        signal: AbortSignal.timeout(3000)
      });
      
      if (response.status === 503) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    } catch (error) {
      // En cas d'erreur de connexion, afficher la bannière
      setIsVisible(true);
    } finally {
      setIsChecking(false);
    }
  };

  const handleRetry = () => {
    checkServerStatus();
    if (onRetry) {
      onRetry();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Collapse in={isVisible}>
      <Alert
        severity="warning"
        icon={<Storage />}
        action={
          <div className="flex items-center gap-2">
            <Button
              size="small"
              onClick={handleRetry}
              disabled={isChecking}
              startIcon={<Refresh />}
              className="text-white"
            >
              {isChecking ? 'Vérification...' : 'Réessayer'}
            </Button>
            <IconButton
              size="small"
              onClick={handleClose}
              className="text-white"
            >
              <Close />
            </IconButton>
          </div>
        }
        className="mb-4"
      >
        <AlertTitle className="flex items-center gap-2">
          <Warning className="text-yellow-600" />
          Serveur de base de données non disponible
        </AlertTitle>
        <div className="mt-2">
          <p className="text-sm mb-2">
            Le serveur de base de données n'est pas démarré. Certaines fonctionnalités peuvent être limitées.
          </p>
          <div className="text-xs space-y-1">
            <p><strong>Pour démarrer le serveur complet :</strong></p>
            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
              npm run dev:full
            </code>
            <p className="text-gray-600">
              Ou dans un terminal séparé : <code className="bg-gray-100 px-1 rounded">npm run db</code>
            </p>
          </div>
        </div>
      </Alert>
    </Collapse>
  );
};
