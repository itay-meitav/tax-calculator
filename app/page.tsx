'use client';

import { NextSeo, SocialProfileJsonLd } from "next-seo";
import { sendGAEvent } from '@next/third-parties/google'
import styles from "./page.module.scss";
import JSConfetti from "js-confetti";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from 'react-countup';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import { AiFillLinkedin, AiFillFacebook, AiOutlineWhatsApp, AiFillTwitterCircle, AiOutlineClose, AiOutlineQuestionCircle } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import { TAXES_2024 } from './enums'
import { calculateTax, google, parseNumber, parseUpperLimit } from "./functions";
import Link from "next/link";
import Image from "next/image";

const initialCalculationState = {
  monthlyTax2023: 0,
  annualTax2023: 0,
  monthlyTax2024: 0,
  annualTax2024: 0,
  monthlyDifference: 0,
  annualDifference: 0,
  actions: [] as string[],
}

export default function Home() {
  const confettiRef = useRef<JSConfetti | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const [income, setIncome] = useState<any>("");
  const [isSet, setIsSet] = useState<boolean>(false);
  const [points, setPoints] = useState<any>(2.25);
  const [popup, setPopup] = useState<boolean>(false);
  const [calculation, setCalculation] = useState(initialCalculationState);
  const [prevCalculation, setPrevCalculation] = useState(initialCalculationState);

  useEffect(() => {
    confettiRef.current = new JSConfetti();
  }, []);

  const triggerConfetti = () => {
    if (confettiRef.current) {
      confettiRef.current.addConfetti({
        emojis: ["💸", "💶", "💷", "💵", "⚡️", "🤩", "✨", "💰"],
      });
    }
  };

  return (
    <div className={styles.container}>
      <motion.div className={styles.shareSection}>
        <motion.p>אהבתם?</motion.p>
        <div className={styles.shareIcons}>
          <Link target="_blank" style={{ paddingTop: 2 }} href={"https://www.clubhub.co.il?ref=taxCalc"}>
            <Image alt="clubhub.co.il" width={28} height={25} src={"coupon.svg"} />
          </Link>
          <FacebookShareButton
            title="מחשבון הפרשי מס 2023 - 2024"
            quote="בדקו עכשיו כמה מס תחסכו השנה בהתאם להורדת המיסים בחוק"
            url="http://tax-calculator.us.to/"
          >
            <AiFillFacebook size={"24px"} />
          </FacebookShareButton>
          <LinkedinShareButton
            title="מחשבון הפרשי מס 2023 - 2024"
            summary="בדקו עכשיו כמה מס תחסכו השנה בהתאם להורדת המיסים בחוק"
            url="http://tax-calculator.us.to/"
            source="מחשבון מס לשנת 2023"
          >
            <AiFillLinkedin size={"24px"} />
          </LinkedinShareButton>
          <TwitterShareButton
            title="מחשבון הפרשי מס 2023 - 2024"
            via="בדקו עכשיו כמה מס תחסכו השנה בהתאם להורדת המיסים בחוק"
            url="http://tax-calculator.us.to/"
          >
            <AiFillTwitterCircle size={"24px"} />
          </TwitterShareButton>
          <WhatsappShareButton
            title="מחשבון הפרשי מס 2023 - 2024"
            url="http://tax-calculator.us.to/"
          >
            <AiOutlineWhatsApp size={"24px"} />
          </WhatsappShareButton>
        </div>
      </motion.div>
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.modalOverlay}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={styles.modal}
            >
              <motion.svg
                className={styles.closeButton}
                onClick={() => setPopup(false)}
                whileHover={{ scale: 1.1 }}
              >
                <AiOutlineClose size={"24px"} />
              </motion.svg>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.5 }}
                className={styles.modalText}
              >
                <h3>?אז איך ביצענו את החישוב</h3>
                <br />
                אתם הזנתם את הסכום <span>{income ? parseNumber(income) : ''}</span> מה שמעמיד
                אתכם במדרגה <b>{income ? parseUpperLimit(income) : ''}</b>
                <br />
                <br />
                <div>
                  {calculation.actions.map((x, i) => (
                    <p key={i}>{x}</p>
                  ))}
                </div>
                <br />
                כאמור קיבלנו מס חודשי של{" "}
                <span>{parseNumber(calculation.monthlyTax2024)}</span> ומס שנתי
                של <span>{parseNumber(calculation.annualTax2024)}</span>
              </motion.div>
              <motion.table
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.2 }}
                className={styles.gridTable}
              >
                <thead>
                  <tr>
                    <th>הכנסה חודשית מצטברת</th>
                    <th>הכנסה חודשית למדרגה</th>
                    <th>שיעור המס</th>
                  </tr>
                </thead>
                <tr style={{ height: '10px' }}>
                  <td colSpan={3}></td>
                </tr>
                <tbody>
                  {TAXES_2024.taxBrackets.map((x, i) => (
                    <tr key={i}>
                      <td>{parseNumber(x.upperLimit)}</td>
                      <td>
                        {i !== TAXES_2024.taxBrackets.length - 1
                          ? parseNumber(
                            TAXES_2024.taxBrackets[i + 1].upperLimit -
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
                        TAXES_2024.taxBrackets[
                          TAXES_2024.taxBrackets.length - 1
                        ].upperLimit
                      )}
                    </td>
                    <td>כל שקל נוסף</td>
                    <td>50%</td>
                  </tr>
                </tbody>
              </motion.table>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={styles.main}>
        <NextSeo
          title="מחשבון הפרשי מס 2023 - 2024"
          description="השתמשו במחשבון הפרשי המס לשנים 2023-2024 לחישוב מס מדויק ועדכני. אידיאלי לחישוב מס הכנסה, הבנת מדרגות המס החדשות וניצול של נקודות זיכוי ממס הכנסה."
        />
        <SocialProfileJsonLd
          type="Person"
          name="Itay Meitav"
          url="https://github.com/itay-meitav/"
          sameAs={['https://www.linkedin.com/in/itay-meitav/']}
        />
        <h1>מחשבון מס</h1>
        <form
          className={styles.formSection}
          onSubmit={(e) => {
            e.preventDefault();

            setPrevCalculation(calculation);
            const calculated = calculateTax(income, points);
            setCalculation(calculated);

            if (calculation.monthlyTax2024! == prevCalculation.monthlyTax2024) {
              google.event({ action: 'calculate', data: { income } });
            }

            setIsSet(true);

            setTimeout(() => {
              if (resultsRef.current) {
                resultsRef.current.scrollIntoView({
                  behavior: 'smooth'
                });
              }
            }, 0);

            triggerConfetti();
          }}
        >
          <div className={styles.inputGroup}>
            <label htmlFor="income">משכורת ברוטו חודשית</label>
            <input
              id="income"
              value={income}
              onChange={(e) => setIncome(e.currentTarget.value)}
              placeholder="משכורת ברוטו חודשית"
              required
              type="number"
              min={0}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="points">נקודות זיכוי</label>
            <input
              id="points"
              value={points}
              onChange={(e) => setPoints(e.currentTarget.value)}
              placeholder="נקודות זיכוי"
              type="number"
              step="0.25"
              min={0}
            />
          </div>
          <motion.button whileHover={{ scale: 1.1 }} type="submit">
            חישוב
          </motion.button>
        </form>
        <div
          style={{ display: !isSet || popup ? "none" : "" }}
          className={styles.taxInfo}
          ref={resultsRef}
        >
          <motion.svg
            className={styles.icon}
            onClick={() => setPopup(true)}
            whileHover={{ scale: 1.1 }}
          >
            <AiOutlineQuestionCircle size={"24px"} />
          </motion.svg>
          <div>
            <h1>הבדלים</h1>
            <p>
              חודשי:
              {" "}
              <CountUp
                start={prevCalculation.monthlyDifference}
                end={calculation.monthlyDifference}
                suffix="₪"
              />
            </p>
            <p>
              שנתי:
              {" "}
              <CountUp
                start={prevCalculation.annualDifference}
                end={calculation.annualDifference}
                suffix="₪"
              />
            </p>
          </div>
          <div className={styles.years}>
            <div>
              <h1>2023</h1>

              <p>
                מס בחודש:
                {" "}
                <CountUp
                  start={prevCalculation.monthlyTax2023}
                  end={calculation.monthlyTax2023}
                  suffix="₪"
                />
              </p>
              <p>
                מס בשנה:
                {" "}
                <CountUp
                  start={prevCalculation.annualTax2023}
                  end={calculation.annualTax2023}
                  suffix="₪"
                />
              </p>
            </div>
            <div>
              <h1>2024</h1>
              <p>
                מס בחודש:
                {" "}
                <CountUp
                  start={prevCalculation.monthlyTax2024}
                  end={calculation.monthlyTax2024}
                  suffix="₪"
                />
              </p>
              <p>
                מס בשנה:
                {" "}
                <CountUp
                  start={prevCalculation.annualTax2024}
                  end={calculation.annualTax2024}
                  suffix="₪"
                />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div style={{ paddingTop: 50 }} className={styles.credit}>
        <p>
          תושב ישראל זכאי ל-2.25 נקודות זיכוי וערכה החודשי נכון להיום הוא
          242 שקלים (2,904 ₪ בשנה).
        </p>
        <p>
          עלולה להופיע סטיה במספר שקלים בגלל טכניקת עיגול מספרים.
        </p>
        <p>
          הנתונים מבוססים על השינויים שנעשו, ויש להתייחס אליהם בערבון מוגבל בלבד.
          אין לראות בנתונים המוצגים תחליף להתייעצות עם איש מקצוע (חשב, רואה
          חשבון).
        </p>
        <p>הוכן על ידי{" "}
          <a
            style={{ order: 2 }}
            target={"_blank"}
            href="https://www.linkedin.com/in/itay-meitav/"
          >
            Itay Meitav
          </a>
          <br />
          © {new Date().getFullYear()}
        </p>
      </div>
    </div >
  );
};