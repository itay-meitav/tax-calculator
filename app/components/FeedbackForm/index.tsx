'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineClose, AiOutlineSend, AiOutlineCheckCircle } from 'react-icons/ai';
import { BiMessageDetail } from 'react-icons/bi';
import styles from './styles.module.scss';

type FeedbackType = 'bug' | 'suggestion' | 'question' | 'other';

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackForm({ isOpen, onClose }: FeedbackFormProps) {
  const [type, setType] = useState<FeedbackType>('other');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('נא להזין הודעה');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          message: message.trim(),
          email: email.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send feedback');
      }

      setIsSuccess(true);
      setMessage('');
      setEmail('');
      
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 2000);
    } catch (err) {
      setError('שליחת המשוב נכשלה. נסו שוב מאוחר יותר.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const feedbackTypes: { value: FeedbackType; label: string; emoji: string }[] = [
    { value: 'bug', label: 'באג', emoji: '🐛' },
    { value: 'suggestion', label: 'הצעה', emoji: '💡' },
    { value: 'question', label: 'שאלה', emoji: '❓' },
    { value: 'other', label: 'אחר', emoji: '📝' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            data-modal="true"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={onClose}>
              <AiOutlineClose size={20} />
            </button>

            <div className={styles.header}>
              <BiMessageDetail size={28} className={styles.headerIcon} />
              <h3>דעתכם חשובה לנו</h3>
              <p>מצאתם בעיה? יש לכם הצעה? נשמח לשמוע!</p>
            </div>

            {isSuccess ? (
              <motion.div
                className={styles.successMessage}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <AiOutlineCheckCircle size={48} />
                <p>תודה על המשוב!</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.typeSelector}>
                  {feedbackTypes.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      className={`${styles.typeButton} ${type === t.value ? styles.active : ''}`}
                      onClick={() => setType(t.value)}
                    >
                      <span className={styles.typeEmoji}>{t.emoji}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="feedback-message">הודעה *</label>
                  <textarea
                    id="feedback-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="ספרו לנו..."
                    rows={4}
                    maxLength={2000}
                    required
                  />
                  <span className={styles.charCount}>{message.length}/2000</span>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="feedback-email">אימייל (אופציונלי)</label>
                  <input
                    id="feedback-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="לקבלת מענה"
                  />
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting || !message.trim()}
                >
                  {isSubmitting ? (
                    <span className={styles.spinner} />
                  ) : (
                    <>
                      <AiOutlineSend size={18} />
                      <span>שלח משוב</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

