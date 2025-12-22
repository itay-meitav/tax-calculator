'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BiMessageDetail } from 'react-icons/bi';
import FeedbackForm from '../FeedbackForm';
import styles from './styles.module.scss';

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        className={styles.feedbackButton}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.3 }}
        aria-label="שלח משוב"
      >
        <BiMessageDetail size={22} />
        <span>משוב</span>
      </motion.button>

      <FeedbackForm isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}


