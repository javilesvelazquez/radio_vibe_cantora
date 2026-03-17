import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <button 
              onClick={onCancel}
              className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                type === 'danger' ? 'bg-red-500/20 text-red-500' :
                type === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                'bg-emerald-500/20 text-emerald-500'
              }`}>
                <AlertTriangle size={32} />
              </div>

              <h3 className="text-2xl font-bold mb-2">{title}</h3>
              <p className="text-white/60 mb-8 leading-relaxed">{message}</p>

              <div className="flex gap-4 w-full">
                <button
                  onClick={onCancel}
                  className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onCancel();
                  }}
                  className={`flex-1 px-6 py-4 font-bold rounded-2xl transition-all ${
                    type === 'danger' ? 'bg-red-500 hover:bg-red-600 text-white' :
                    type === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600 text-black' :
                    'bg-emerald-500 hover:bg-emerald-600 text-black'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
