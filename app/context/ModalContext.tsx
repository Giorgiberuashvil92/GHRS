'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Modal from '../components/Modal';
import { useI18n } from './I18nContext';

interface ModalConfig {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
}

interface ModalContextType {
  showModal: (config: ModalConfig) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  showConfirm: (message: string, onConfirm: () => void, title?: string) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ModalConfig>({ message: '' });
  const { t } = useI18n();

  const showModal = (modalConfig: ModalConfig) => {
    setConfig(modalConfig);
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
    // Clear config after animation completes
    setTimeout(() => {
      setConfig({ message: '' });
    }, 300);
  };

  const showSuccess = (message: string, title?: string) => {
    showModal({
      message,
      title: title || t('modal.success') || 'Success!',
      type: 'success',
      confirmText: t('modal.ok') || 'OK'
    });
  };

  const showError = (message: string, title?: string) => {
    showModal({
      message,
      title: title || t('modal.error') || 'Error!',
      type: 'error',
      confirmText: t('modal.ok') || 'OK'
    });
  };

  const showWarning = (message: string, title?: string) => {
    showModal({
      message,
      title: title || t('modal.warning') || 'Warning!',
      type: 'warning',
      confirmText: t('modal.understood') || 'Understood'
    });
  };

  const showInfo = (message: string, title?: string) => {
    showModal({
      message,
      title: title || t('modal.info') || 'Information',
      type: 'info',
      confirmText: t('modal.ok') || 'OK'
    });
  };

  const showConfirm = (message: string, onConfirm: () => void, title?: string) => {
    showModal({
      message,
      title: title || t('modal.confirm') || 'Confirmation',
      type: 'warning',
      confirmText: t('modal.yes') || 'Yes',
      cancelText: t('modal.no') || 'No',
      onConfirm,
      showCancel: true
    });
  };

  return (
    <ModalContext.Provider
      value={{
        showModal,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showConfirm,
        hideModal,
      }}
    >
      {children}
      <Modal
        isOpen={isOpen}
        onClose={hideModal}
        title={config.title}
        message={config.message}
        type={config.type}
        confirmText={config.confirmText}
        cancelText={config.cancelText}
        onConfirm={config.onConfirm}
        showCancel={config.showCancel}
      />
    </ModalContext.Provider>
  );
}; 