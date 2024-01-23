'use client';

import { NextSeo, SocialProfileJsonLd } from "next-seo";
import { sendGAEvent } from '@next/third-parties/google'
import styles from "./page.module.scss";
import JSConfetti from "js-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import { AiFillLinkedin, AiFillFacebook, AiOutlineWhatsApp, AiFillTwitterCircle, AiOutlineClose, AiOutlineQuestionCircle } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import { TAXES_2024 } from './enums'
import { calculateTax, parseNumber, parseUpperLimit } from "./functions";

export default function Home() {
  const confettiRef = useRef<JSConfetti | null>(null);
  const [income, setIncome] = useState<any>(null);
  const [isSet, setIsSet] = useState<boolean>(false);
  const [points, setPoints] = useState<any>(2.25);
  const [popup, setPopup] = useState<boolean>(false);
  const [calculation, setCalculation] = useState({
    monthlyTax2023: 0,
    annualTax2023: 0,
    monthlyTax2024: 0,
    annualTax2024: 0,
    monthlyDifference: 0,
    annualDifference: 0,
    actions: [] as string[],
  });

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
              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.5 }}
                className={styles.modalText}
              >
                <h3>אז איך ביצענו את החישוב?</h3>
                <br />
                אתם הזנתם את הסכום <span>{income ? parseNumber(income) : ''}</span> מה שמעמיד
                אתכם במדרגה <span>{income ? parseUpperLimit(income) : ''}.</span>
                <br />
                <br />
                <div>
                  {calculation.actions.map((x, i) => (
                    <p key={i}>{x}</p>
                  ))}
                </div>
                <br />
                תושב ישראל זכאי ל-2.25 נקודות זיכוי וערכה החודשי נכון להיום הוא
                242 שקלים (2,904 ₪ בשנה).
                <br />
                כאמור קיבלנו מס חודשי של{" "}
                <span>{parseNumber(calculation.monthlyTax2024)}</span> ומס שנתי
                של <span>{parseNumber(calculation.annualTax2024)}</span>.
              </motion.p>
              <motion.table
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.2 }}
                className={styles.gridTable}
              >
                <tr>
                  <th>הכנסה חודשית מצטברת</th>
                  <th>הכנסה חודשית למדרגה</th>
                  <th>שיעור המס</th>
                </tr>
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
            setIsSet(true);
            const calculated = calculateTax(income, points);
            setCalculation(calculated);
            sendGAEvent({ event: 'calculateButtonClicked', income })
            triggerConfetti();
          }}
        >
          <input
            value={income}
            onChange={(e) => {
              setIncome(e.currentTarget.value);
            }}
            placeholder="משכורת ברוטו חודשית"
            required
            type={"number"}
            min={0}
          />
          <input
            value={points}
            onChange={(e) => setPoints(e.currentTarget.value)}
            placeholder="נקודות זיכוי"
            type="number"
            step={"0.25"}
            min={0}
          />
          <motion.button whileHover={{ scale: 1.1 }} type="submit">
            חישוב
          </motion.button>
        </form>
        <div
          style={{ display: !isSet || popup ? "none" : "" }}
          className={styles.taxInfo}
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
              חודשי: <span>{parseNumber(calculation.monthlyDifference)}</span>
            </p>
            <p>
              שנתי: <span>{parseNumber(calculation.annualDifference)}</span>
            </p>
          </div>
          <div className={styles.years}>
            <div>
              <h1>2023</h1>
              <p>
                מס בחודש: <span>{parseNumber(calculation.monthlyTax2023)}</span>
              </p>
              <p>
                מס בשנה: <span>{parseNumber(calculation.annualTax2023)}</span>
              </p>
            </div>
            <div>
              <h1>2024</h1>
              <p>
                מס בחודש: <span>{parseNumber(calculation.monthlyTax2024)}</span>
              </p>
              <p>
                מס בשנה: <span>{parseNumber(calculation.annualTax2024)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <p>
        הנתונים מבוססים על השינויים שנעשו, ויש להתייחס אליהם בערבון מוגבל בלבד.
        אין לראות בנתונים המוצגים תחליף להתייעצות עם איש מקצוע (חשב, רואה
        חשבון).
      </p>
      <div className="credit">
        <span>הוכן על ידי</span>{" "}
        <a
          style={{ order: 2 }}
          target={"_blank"}
          href="https://www.linkedin.com/in/itay-meitav/"
        >
          Itay Meitav
        </a>{" "}
        <div>{new Date().getFullYear()} ©</div>
      </div>
    </div>
  );
};