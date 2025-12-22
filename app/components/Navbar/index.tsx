'use client';

import ThemeSwitcher from '../ThemeSwitcher';
import styles from './styles.module.scss';

export default function Navbar() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.navLinks}>
          <button 
            className={styles.navLink} 
            onClick={() => scrollToSection('calculator')}
          >
            מחשבון
          </button>
          <button 
            className={styles.navLink} 
            onClick={() => scrollToSection('reservist-info')}
          >
            מילואים
          </button>
          <button 
            className={styles.navLink} 
            onClick={() => scrollToSection('useful-links')}
          >
            קישורים
          </button>
          <button 
            className={styles.navLink} 
            onClick={() => scrollToSection('credit-scheme')}
          >
            מדרגות
          </button>
          <button 
            className={styles.navLink} 
            onClick={() => scrollToSection('tax-data')}
          >
            נתונים
          </button>
        </div>
        
        <div className={styles.themeSwitcherWrapper}>
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}

