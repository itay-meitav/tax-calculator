'use client';

import { sendGAEvent } from '@next/third-parties/google'
import styles from "./page.module.scss";
import JSConfetti from "js-confetti";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from 'react-countup';
import { AiOutlineClose, AiOutlineQuestionCircle } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import AnimatedContent from "./components/AnimatedContent";
import { TAXES_2025, calculateReservistPoints, MAX_RESERVIST_POINTS } from './enums'
import { calculateTax, google, parseNumber, parseUpperLimit } from "./functions";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import FeedbackButton from "./components/FeedbackButton";
import Image from "next/image";

const initialCalculationState = {
  monthlyTax2023: 0,
  annualTax2023: 0,
  monthlyTax2025: 0,
  annualTax2025: 0,
  monthlyTax2026: 0,
  annualTax2026: 0,
  monthlyDifference: 0,
  annualDifference: 0,
  actions: [] as string[],
  reservistPoints: 0,
  reservistDays: 0,
}

export default function Home() {
  const confettiRef = useRef<JSConfetti | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);
  const reservistInfoRef = useRef<HTMLDivElement>(null);

  const [income, setIncome] = useState<any>("");
  const [isSet, setIsSet] = useState<boolean>(false);
  const [points, setPoints] = useState<any>(2.25);
  const [reservistDays, setReservistDays] = useState<any>("");
  const [isReservist, setIsReservist] = useState<boolean>(false);
  const [popup, setPopup] = useState<boolean>(false);
  const [calculation, setCalculation] = useState(initialCalculationState);
  const [prevCalculation, setPrevCalculation] = useState(initialCalculationState);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    confettiRef.current = new JSConfetti();
  }, []);

  const triggerConfetti = () => {
    if (confettiRef.current) {
      confettiRef.current.addConfetti({
        emojis: ['🎉', '🎊', '💰', '💵', '🤑'],
        emojiSize: 50,
        confettiNumber: 30,
      });
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      
      <div className={styles.bgDecoration}>
        <div className={styles.bgCircle1} />
        <div className={styles.bgCircle2} />
        <div className={styles.bgCircle3} />
      </div>

      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => setPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                className={styles.closeButton}
                onClick={() => setPopup(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <AiOutlineClose size={20} />
              </motion.button>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className={styles.modalText}
              >
                <h3>איך ביצענו את החישוב?</h3>
                <div className={styles.modalContent}>
                  <p>
                    הזנתם את הסכום <span className={styles.highlight}>{income ? parseNumber(income) : ''}</span> מה שמעמיד
                    אתכם במדרגה <span className={styles.highlight}>{income ? parseUpperLimit(income) : ''}</span>
                  </p>
                  <p className={styles.taxNote}>
                    💡 שימו לב: לא משלמים את שיעור המס הגבוה על כל ה־{parseNumber(income)}. כל מדרגה ממוסה בנפרד לפי השיעור שלה.
                  </p>
                  <div className={styles.actionsList}>
                    {calculation.actions.map((x, i) => (
                      <p key={i}>{x}</p>
                    ))}
                  </div>
                  <p className={styles.summary}>
                    סה״כ מס חודשי: <span className={styles.highlight}>{parseNumber(calculation.monthlyTax2025)}</span>
                    {' | '}
                    מס שנתי: <span className={styles.highlight}>{parseNumber(calculation.annualTax2025)}</span>
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className={styles.tableWrapper}
              >
                <table className={styles.gridTable}>
                  <thead>
                    <tr>
                      <th>
                        <span className={styles.headerWithTooltip}>
                          <span className={styles.tooltip}>
                            <AiOutlineQuestionCircle size={14} />
                            <span className={styles.tooltipText}>
                              הסכום המצטבר של ההכנסה החודשית עד סוף אותה מדרגה.
                              זהו לא סכום שממוסים עליו בבת אחת, אלא גבול עליון מצטבר.
                            </span>
                          </span>
                          הכנסה חודשית מצטברת
                        </span>
                      </th>
                      <th>
                        <span className={styles.headerWithTooltip}>
                          <span className={styles.tooltip}>
                            <AiOutlineQuestionCircle size={14} />
                            <span className={styles.tooltipText}>
                              טווח ההכנסה החודשית שעליו חל אותו שיעור מס.
                              <br /><br />
                              לדוגמה:<br />
                              עד 3,049 ₪ → מס 10%<br />
                              בין 3,050–6,089 ₪ → מס 14%<br />
                              וכן הלאה.
                            </span>
                          </span>
                          הכנסה חודשית למדרגה
                        </span>
                      </th>
                      <th>שיעור המס</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TAXES_2025.taxBrackets.map((x, i) => (
                      <tr key={i}>
                        <td>{parseNumber(x.upperLimit)}</td>
                        <td>
                          {i !== TAXES_2025.taxBrackets.length - 1
                            ? parseNumber(
                              TAXES_2025.taxBrackets[i + 1].upperLimit -
                              (x.upperLimit + 1)
                            )
                            : "כל שקל נוסף"}
                        </td>
                        <td>{Math.floor(x.rate * 100) + '%'}</td>
                      </tr>
                    ))}
                    <tr>
                      <td>
                        מעל{" "}
                        {parseNumber(
                          TAXES_2025.taxBrackets[
                            TAXES_2025.taxBrackets.length - 1
                          ].upperLimit
                        )}
                      </td>
                      <td>כל שקל נוסף</td>
                      <td>50%</td>
                    </tr>
                  </tbody>
                </table>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={styles.main} ref={calculatorRef} id="calculator">
        <motion.div 
          className={styles.heroSection}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.badge}>2023-2026</span>
          <h1>מחשבון הפרשי מס</h1>
          <p className={styles.subtitle}>השוו את המס שלכם בין השנים וגלו כמה תשלמו פחות</p>
        </motion.div>

        <motion.form
          className={styles.formSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={(e) => {
            e.preventDefault();

            setPrevCalculation(calculation);
            const reservistDaysValue = isReservist ? parseInt(reservistDays) || 0 : 0;
            const incomeValue = parseFloat(income) || 0;
            const creditsValue = parseFloat(points) || 0;
            const calculated = calculateTax(incomeValue, creditsValue, reservistDaysValue);
            setCalculation(calculated);

            if (calculation.monthlyTax2026 !== prevCalculation.monthlyTax2026) {
              google.event({ action: 'calculate', data: { income, reservistDays: reservistDaysValue } });
            }

            setIsSet(true);

            setTimeout(() => {
              if (resultsRef.current) {
                resultsRef.current.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center'
                });
              }
            }, 0);

            triggerConfetti();
          }}
        >
          <div className={styles.formCard}>
            <div className={styles.inputGroup}>
              <label htmlFor="income">
                משכורת ברוטו חודשית
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="income"
                  value={income}
                  onChange={(e) => setIncome(e.currentTarget.value)}
                  placeholder="לדוגמה: 15,000"
                  required
                  type="number"
                  min={0}
                />
                <span className={styles.inputSuffix}>₪</span>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="points">
                נקודות זיכוי רגילות
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="points"
                  value={points}
                  onChange={(e) => setPoints(e.currentTarget.value)}
                  placeholder="2.25"
                  type="number"
                  step="0.25"
                  min={0}
                />
              </div>
            </div>
            
            <div className={styles.reservistSection}>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={isReservist}
                    onChange={(e) => setIsReservist(e.target.checked)}
                  />
                  אני משרת/ת מילואים כלוחם/ת
                </label>
                <button
                  type="button"
                  className={styles.infoButtonSmall}
                  onClick={() => scrollToSection(reservistInfoRef)}
                  aria-label="מידע על נקודות זיכוי למילואים"
                >
                  <AiOutlineQuestionCircle size={18} />
                </button>
              </div>
              
              {isReservist && (
                <motion.div
                  className={styles.inputGroup}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label htmlFor="reservistDays">
                    ימי מילואים מזכים בשנת 2025
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="reservistDays"
                      value={reservistDays}
                      onChange={(e) => setReservistDays(e.currentTarget.value)}
                      placeholder="לדוגמה: 45"
                      type="number"
                      min={0}
                      max={365}
                    />
                    <span className={styles.inputSuffix}>ימים</span>
                  </div>
                  <span className={styles.inputHint}>
                    {reservistDays >= 30 
                      ? `זכאות: ${calculateReservistPoints(parseInt(reservistDays) || 0)} נקודות (${parseNumber(calculateReservistPoints(parseInt(reservistDays) || 0) * 242 * 12).replace(' שקלים', '')}₪ בשנה)`
                      : 'מינימום 30 ימים לזכאות'}
                  </span>
                </motion.div>
              )}
            </div>
            
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.02, boxShadow: "0 12px 32px rgba(13, 148, 136, 0.35)" }}
              whileTap={{ scale: 0.98 }}
            >
              <span>חשב עכשיו</span>
            </motion.button>
          </div>
        </motion.form>

        <AnimatePresence>
          {isSet && !popup && (
            <motion.div
              className={styles.taxInfo}
              ref={resultsRef}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <motion.button
                className={styles.infoButton}
                onClick={() => setPopup(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="מידע נוסף"
              >
                <AiOutlineQuestionCircle size={22} />
              </motion.button>

              <div className={styles.differenceSection}>
                <h2>החיסכון שלכם לעומת 2023</h2>
                <div className={styles.differenceCards}>
                  <div className={styles.differenceCard}>
                    <span className={styles.differenceLabel}>חודשי</span>
                    <span className={styles.differenceValue}>
                      <CountUp
                        start={prevCalculation.monthlyDifference}
                        end={calculation.monthlyDifference}
                        suffix=" ₪"
                        duration={1}
                      />
                    </span>
                  </div>
                  <div className={styles.differenceCard}>
                    <span className={styles.differenceLabel}>שנתי</span>
                    <span className={styles.differenceValue}>
                      <CountUp
                        start={prevCalculation.annualDifference}
                        end={calculation.annualDifference}
                        suffix=" ₪"
                        duration={1}
                      />
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.yearsComparison}>
                <motion.div 
                  className={styles.yearCard}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3>2023</h3>
                  <div className={styles.yearStats}>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>מס חודשי</span>
                      <span className={styles.statValue}>
                        <CountUp
                          start={prevCalculation.monthlyTax2023}
                          end={calculation.monthlyTax2023}
                          suffix=" ₪"
                          duration={1}
                        />
                      </span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>מס שנתי</span>
                      <span className={styles.statValue}>
                        <CountUp
                          start={prevCalculation.annualTax2023}
                          end={calculation.annualTax2023}
                          suffix=" ₪"
                          duration={1}
                        />
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className={`${styles.yearCard} ${styles.yearCardHighlight}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3>2024-2025</h3>
                  <div className={styles.yearStats}>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>מס חודשי</span>
                      <span className={styles.statValue}>
                        <CountUp
                          start={prevCalculation.monthlyTax2025}
                          end={calculation.monthlyTax2025}
                          suffix=" ₪"
                          duration={1}
                        />
                      </span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>מס שנתי</span>
                      <span className={styles.statValue}>
                        <CountUp
                          start={prevCalculation.annualTax2025}
                          end={calculation.annualTax2025}
                          suffix=" ₪"
                          duration={1}
                        />
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className={styles.yearCard}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3>2026</h3>
                  <div className={styles.yearStats}>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>מס חודשי</span>
                      <span className={styles.statValue}>
                        <CountUp
                          start={prevCalculation.monthlyTax2026}
                          end={calculation.monthlyTax2026}
                          suffix=" ₪"
                          duration={1}
                        />
                      </span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>מס שנתי</span>
                      <span className={styles.statValue}>
                        <CountUp
                          start={prevCalculation.annualTax2026}
                          end={calculation.annualTax2026}
                          suffix=" ₪"
                          duration={1}
                        />
                      </span>
                    </div>
                  </div>
                  {calculation.reservistPoints > 0 && (
                    <div className={styles.reservistNote}>
                      נקודות מילואים: {calculation.reservistPoints} נק׳ ({(calculation.reservistPoints * 242 * 12).toLocaleString('he-IL')} ₪)
                    </div>
                  )}
                  <div className={styles.year2026Disclaimer}>
                    המידע על 2026 עדיין מחושב לפי מדרגות המס ושווי נקודות הזיכוי של 2024 ו-2025 - נבצע עדכון למחשבון במידה ותתבצע חקיקה חדשה.
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <section className={styles.reservistInfoSection} ref={reservistInfoRef} id="reservist-info">
        <div className={styles.sectionContainer}>
          <AnimatedContent distance={30} duration={0.5}>
            <div className={styles.sectionHeader}>
              <h2>נקודות זיכוי למשרתי מילואים לוחמים</h2>
            </div>
          </AnimatedContent>
          
          <div className={styles.infoCards}>
            <AnimatedContent distance={40} delay={0.1} style={{ flex: 1, display: 'flex' }}>
              <div className={styles.infoCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.newBadge}>חדש!</span>
                  <h3>תיקון 283 לפקודת מס הכנסה</h3>
                </div>
                <p>
                  החל מינואר 2026 נכנס לתוקף תיקון 283 - נקודות זיכוי לחיילי מילואים לוחמים 
                  בהתאם לימי השירות בשנה הקודמת. המקסימום שאפשר לקבל הוא 4 נקודות 
                  בשווי <strong>11,616 ₪</strong> בשנה (<strong>968 ₪</strong> תשלום פחות מס בחודש).
                </p>
              </div>
            </AnimatedContent>

            <AnimatedContent distance={40} delay={0.2} style={{ flex: 1, display: 'flex' }}>
              <div className={styles.infoCard}>
                <h3>מי זכאי?</h3>
                <ul className={styles.eligibilityList}>
                  <li>
                    <span className={styles.bulletIcon}>•</span>
                    משרתי מילואים <strong>כלוחם</strong> (מערך לוחם)
                  </li>
                  <li>
                    <span className={styles.bulletIcon}>•</span>
                    נדרש אישור מצה״ל על ימי שירות מזכים
                  </li>
                  <li>
                    <span className={styles.bulletIcon}>•</span>
                    רק שירות <strong>בייעוד קדמי</strong> נחשב כמזכה
                  </li>
                  <li>
                    <span className={styles.bulletIcon}>•</span>
                    יחידות הגמ״ר מוחרגות מההטבה
                  </li>
                </ul>
              </div>
            </AnimatedContent>
          </div>

          <AnimatedContent distance={50} delay={0.1}>
            <div className={styles.pointsTableSection}>
              <h3>טבלת נקודות זיכוי (2026-2027)</h3>
              <div className={styles.tableContainer}>
                <table className={styles.pointsTable}>
                  <thead>
                    <tr>
                      <th>ימי מילואים בשנה הקודמת</th>
                      <th>נקודות זיכוי</th>
                      <th>שווי שנתי</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>30-39 ימים</td><td>0.5</td><td>1,452 ₪</td></tr>
                    <tr><td>40-49 ימים</td><td>0.75</td><td>2,178 ₪</td></tr>
                    <tr><td>50-54 ימים</td><td>1.0</td><td>2,904 ₪</td></tr>
                    <tr><td>55-59 ימים</td><td>1.25</td><td>3,630 ₪</td></tr>
                    <tr><td>60-64 ימים</td><td>1.5</td><td>4,356 ₪</td></tr>
                    <tr><td>65-69 ימים</td><td>1.75</td><td>5,082 ₪</td></tr>
                    <tr><td>70-74 ימים</td><td>2.0</td><td>5,808 ₪</td></tr>
                    <tr><td>75-79 ימים</td><td>2.25</td><td>6,534 ₪</td></tr>
                    <tr><td>80-84 ימים</td><td>2.5</td><td>7,260 ₪</td></tr>
                    <tr><td>85-89 ימים</td><td>2.75</td><td>7,986 ₪</td></tr>
                    <tr><td>90-94 ימים</td><td>3.0</td><td>8,712 ₪</td></tr>
                    <tr><td>95-99 ימים</td><td>3.25</td><td>9,438 ₪</td></tr>
                    <tr><td>100-104 ימים</td><td>3.5</td><td>10,164 ₪</td></tr>
                    <tr><td>105-109 ימים</td><td>3.75</td><td>10,890 ₪</td></tr>
                    <tr className={styles.maxRow}><td>110+ ימים</td><td>4.0 (מקסימום)</td><td>11,616 ₪</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </AnimatedContent>

          <div className={styles.howToSection}>
            <AnimatedContent distance={40} delay={0.1} style={{ flex: 1, display: 'flex' }}>
              <div className={styles.howToCard}>
                <h3>איך לממש את הזיכוי?</h3>
                <div className={styles.howToSteps}>
                  <div className={styles.step}>
                    <span className={styles.stepNumber}>1</span>
                    <div>
                      <strong>שכירים</strong>
                      <p>למלא טופס 101 (חלק ח׳, סעיף 16) בתחילת שנת המס + לצרף אישור מצה״ל</p>
                    </div>
                  </div>
                  <div className={styles.step}>
                    <span className={styles.stepNumber}>2</span>
                    <div>
                      <strong>עובדים ביותר ממקום אחד</strong>
                      <p>תיאום מס במערכת המקוונת לתיאומי מס</p>
                    </div>
                  </div>
                  <div className={styles.step}>
                    <span className={styles.stepNumber}>3</span>
                    <div>
                      <strong>עצמאים</strong>
                      <p>לצרף את האישור במסגרת הגשת הדוח השנתי</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedContent>

            <AnimatedContent distance={40} delay={0.2} style={{ flex: 1, display: 'flex' }}>
              <div className={styles.howToCard}>
                <h3>איך להנפיק אישור?</h3>
                <div className={styles.certificateSteps}>
                  <p>יש להיכנס ל<a href="https://www.miluim.idf.il/personalzone/milforms-lobby" target="_blank" rel="noopener noreferrer">אתר המילואים</a> ואז:</p>
                  <ol>
                    <li>לאזור ״האישורים שלי״</li>
                    <li>להנפיק ״<a href="https://www.miluim.idf.il/personalzone/milforms-lobby" target="_blank" rel="noopener noreferrer">טופס אישור מילואים מזכה</a>״</li>
                  </ol>
                  <p className={styles.note}>
                    <strong>שימו לב:</strong> בטופס לא כתוב שאתם במערך לוחם (אבטחת מידע) - הטופס עדיין עושה את העבודה.
                  </p>
                </div>
              </div>
            </AnimatedContent>
          </div>

          <AnimatedContent distance={30} delay={0.1}>
            <div className={styles.warningBanner}>
              <span className={styles.warningEmoji}>⚠️</span>
              <div>
                <strong>לא מילאתם טופס 101?</strong>
                <p>המעסיק לא יחשב לכם נקודות זיכוי, ואתם עלולים לשלם מס מיותר ולהסתבך בהחזר מס. אל תסמכו על המעסיק שיבדוק עבורכם את הזכאות!</p>
              </div>
            </div>
          </AnimatedContent>

          <AnimatedContent distance={40} delay={0.1}>
            <div className={styles.linksSection} id="useful-links">
              <h4>קישורים שימושיים:</h4>
              <div className={styles.linksGrid}>
                <a href="https://www.gov.il/he/pages/sa181225-2" target="_blank" rel="noopener noreferrer" className={styles.linkCard}>
                  רשות המסים - הודעה רשמית
                </a>
                <a href="https://www.gov.il/BlobFolder/service/itc101/he/Service_Pages_Income_tax_annual-report-2024_itc101.pdf" target="_blank" rel="noopener noreferrer" className={styles.linkCard}>
                  טופס 101 מעודכן
                </a>
                <a href="https://greenbook.co.il/content/booking/file60998.pdf" target="_blank" rel="noopener noreferrer" className={styles.linkCard}>
                  מכתב להצגה למעסיקים
                </a>
                <a href="https://www.miluim.idf.il/personalzone/milforms-lobby" target="_blank" rel="noopener noreferrer" className={styles.linkCard}>
                  הנפקת טופס אישור מילואים מזכה
                </a>
                <a href="https://secapp.taxes.gov.il/srsimulatorNZ/#/simulator" target="_blank" rel="noopener noreferrer" className={styles.linkCard}>
                  סימולטור לחישוב נקודות זיכוי (מצב משפחתי)
                </a>
                <a href="https://secapp.taxes.gov.il/srsimulatorNZ/#/simulatorMasHachnasah" target="_blank" rel="noopener noreferrer" className={styles.linkCard}>
                  סימולטור לחישוב המס לפי נקודות זיכוי
                </a>
                <a href="https://www.gov.il/BlobFolder/guide/specialbenefits/he/pr_נספח אישור סיכום ימי שירות מילואים פעיל מזכה.pdf" target="_blank" rel="noopener noreferrer" className={styles.linkCard}>
                  טופס אישור סיכום ימי שירות מזכה (לדוגמה)
                </a>
              </div>
            </div>
          </AnimatedContent>

          <div className={styles.schemeSection} id="credit-scheme">
            <AnimatedContent distance={30}>
              <h3>מדרגות נקודות הזיכוי</h3>
            </AnimatedContent>
            
            <AnimatedContent distance={40} delay={0.1}>
              <div className={styles.schemeImageWrapper}>
                <Image 
                  src="/reservist-credit-scheme.jpg" 
                  alt="מדרגות נקודות זיכוי למילואימניק לוחם" 
                  width={800}
                  height={600}
                  className={styles.schemeImage}
                />
              </div>
            </AnimatedContent>

            <div className={styles.schemeDetails}>
              <AnimatedContent distance={40} delay={0.15}>
                <div className={styles.schemeCard}>
                  <h4>תחולה מ-1.1.2026 ועד ליום 31.12.2027</h4>
                  <p>במסגרת הטבת המס שתחול החל מינואר 2026 ועד ליום 31.12.2027, על בסיס שירות המילואים בשנת 2025, תינתן הטבת המס בנקודות זיכוי לפי מדרגות:</p>
                  <ul>
                    <li><strong>30-39 ימים:</strong> ½ נקודת זיכוי</li>
                    <li><strong>40-49 ימים:</strong> ¾ נקודת זיכוי</li>
                    <li><strong>50+ ימים:</strong> נקודת זיכוי אחת</li>
                  </ul>
                  <p>בנוסף, תינתן תוספת של ¼ נקודת זיכוי בעד כל 5 ימים נוספים מעבר ל-50 ימים.</p>
                </div>
              </AnimatedContent>

              <AnimatedContent distance={40} delay={0.2}>
                <div className={styles.schemeCard}>
                  <h4>תחולה החל משנת 2028</h4>
                  <p>החל משנת 2028, תהיה חלוקה ל-2 מדרגות בלבד:</p>
                  <ul>
                    <li><strong>20+ ימים:</strong> ¾ נקודות זיכוי</li>
                    <li><strong>תוספת:</strong> ¼ נקודת זיכוי בעד כל 5 ימים נוספים מעל 20 יום</li>
                  </ul>
                </div>
              </AnimatedContent>

              <AnimatedContent distance={30} delay={0.25}>
                <div className={styles.schemeNote}>
                  <strong>ההטבה מוגבלת לעד 4 נקודות זיכוי בסך הכל, בשתי התקופות.</strong>
                </div>
              </AnimatedContent>
            </div>
          </div>

          <div className={styles.taxDataSection} id="tax-data">
            <AnimatedContent distance={30}>
              <h3>נתוני מס לפי שנים</h3>
              <p className={styles.taxDataIntro}>
                הטבלה הבאה מציגה את מדרגות המס ושווי נקודת זיכוי בהם משתמש המחשבון:
              </p>
            </AnimatedContent>
            
            <div className={styles.taxDataTables}>
              <AnimatedContent distance={40} delay={0.1}>
                <div className={styles.taxDataCard}>
                  <h4>שווי נקודת זיכוי</h4>
                  <table className={styles.comparisonTable}>
                    <thead>
                      <tr>
                        <th>שנה</th>
                        <th>שווי חודשי</th>
                        <th>שווי שנתי</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>2023</td>
                        <td>235 ₪</td>
                        <td>2,820 ₪</td>
                      </tr>
                      <tr className={styles.highlightRow}>
                        <td>2024-2026</td>
                        <td>242 ₪</td>
                        <td>2,904 ₪</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </AnimatedContent>

              <AnimatedContent distance={40} delay={0.2}>
                <div className={styles.taxDataCard}>
                  <h4>מדרגות מס</h4>
                  <table className={styles.comparisonTable}>
                    <thead>
                      <tr>
                        <th>מדרגה</th>
                        <th>שיעור</th>
                        <th>2023</th>
                        <th>2024-2026</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>ראשונה</td>
                        <td>10%</td>
                        <td>עד 6,790 ₪</td>
                        <td>עד 7,010 ₪</td>
                      </tr>
                      <tr>
                        <td>שנייה</td>
                        <td>14%</td>
                        <td>עד 9,730 ₪</td>
                        <td>עד 10,060 ₪</td>
                      </tr>
                      <tr>
                        <td>שלישית</td>
                        <td>20%</td>
                        <td>עד 15,620 ₪</td>
                        <td>עד 16,150 ₪</td>
                      </tr>
                      <tr>
                        <td>רביעית</td>
                        <td>31%</td>
                        <td>עד 21,710 ₪</td>
                        <td>עד 22,440 ₪</td>
                      </tr>
                      <tr>
                        <td>חמישית</td>
                        <td>35%</td>
                        <td>עד 45,180 ₪</td>
                        <td>עד 46,690 ₪</td>
                      </tr>
                      <tr>
                        <td>שישית</td>
                        <td>47%</td>
                        <td>עד 58,190 ₪</td>
                        <td>עד 60,130 ₪</td>
                      </tr>
                      <tr>
                        <td>שביעית</td>
                        <td>50%</td>
                        <td colSpan={2}>מעל התקרה</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </AnimatedContent>

              <AnimatedContent distance={40} delay={0.3}>
                <div className={styles.taxDataCard}>
                  <h4>הבדלים עיקריים</h4>
                  <ul className={styles.differencesList}>
                    <li>
                      <strong>2023 ➡️ 2024:</strong> עדכון מדרגות מס ושווי נקודת זיכוי (235 ₪ ➡️ 242 ₪)
                    </li>
                    <li>
                      <strong>2024 = 2025:</strong> אין שינוי במדרגות או בשווי נקודת זיכוי
                    </li>
                    <li>
                      <strong>2026:</strong> תוספת נקודות זיכוי למשרתי מילואים לוחמים (תיקון 283)
                    </li>
                  </ul>
                </div>
              </AnimatedContent>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FeedbackButton />
    </div>
  );
}
