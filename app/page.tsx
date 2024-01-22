'use client';

import { NextSeo } from "next-seo";
import { GoogleAnalytics, sendGTMEvent } from '@next/third-parties/google'
import styles from "./page.module.scss";
import JSConfetti from "js-confetti";
import { motion, AnimatePresence } from "framer-motion";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  AiFillLinkedin,
  AiFillFacebook,
  AiOutlineWhatsApp,
  AiFillTwitterCircle,
  AiOutlineClose,
  AiOutlineQuestionCircle,
} from "react-icons/ai";
import { useEffect, useState } from "react";

const taxNumbers2022 = {
  taxBrackets: [
    { upperLimit: 6450, rate: 0.1 },
    { upperLimit: 9240, rate: 0.14 },
    { upperLimit: 14840, rate: 0.2 },
    { upperLimit: 20620, rate: 0.31 },
    { upperLimit: 42910, rate: 0.35 },
    { upperLimit: 55270, rate: 0.47 },
  ],
  creditsValue: 223,
};

const taxNumbers2023 = {
  taxBrackets: [
    { upperLimit: 6790, rate: 0.1 },
    { upperLimit: 9730, rate: 0.14 },
    { upperLimit: 15620, rate: 0.2 },
    { upperLimit: 21710, rate: 0.31 },
    { upperLimit: 45180, rate: 0.35 },
    { upperLimit: 58190, rate: 0.47 },
  ],
  creditsValue: 235,
};

function calculateTax(income: number, credits?: number) {
  let taxInfo2022 = calculateTaxForBracket(2022, income, credits);
  let taxInfo2023 = calculateTaxForBracket(2023, income, credits);
  let tax2022 = roundHalf(taxInfo2022.tax);
  let tax2023 = roundHalf(taxInfo2023.tax);
  return {
    monthlyTax2022: tax2022,
    annualTax2022: tax2022 * 12,
    monthlyTax2023: tax2023,
    annualTax2023: tax2023 * 12,
    monthlyDifference: tax2022 - tax2023,
    annualDifference: tax2022 * 12 - tax2023 * 12,
    actions: taxInfo2023.actions,
  };
}

function roundHalf(num: number) {
  if (num % 1 >= 0.5) {
    return Math.ceil(num);
  } else if (num % 1 == 0.5) {
    return num;
  } else {
    return Math.floor(num);
  }
}

function calculateTaxForBracket(
  year: number,
  income: number,
  credits?: number
) {
  let tax = 0;
  const { taxBrackets, creditsValue } =
    year === 2022 ? taxNumbers2022 : taxNumbers2023;
  const actions: string[] = [];
  for (let i = 0; i < taxBrackets.length; i++) {
    if (income <= taxBrackets[i].upperLimit) {
      let incomeInRange =
        income - (taxBrackets[i - 1] ? taxBrackets[i - 1].upperLimit + 1 : 0);
      tax += incomeInRange * taxBrackets[i].rate;
      actions.push(
        `${incomeInRange} X ${taxBrackets[i].rate} = ${roundHalf(
          incomeInRange * taxBrackets[i].rate
        )} `
      );
      break;
    }
    tax +=
      (taxBrackets[i].upperLimit -
        (taxBrackets[i - 1] ? taxBrackets[i - 1].upperLimit + 1 : 0)) *
      taxBrackets[i].rate;
    actions.push(
      `${taxBrackets[i].upperLimit -
      (taxBrackets[i - 1] ? taxBrackets[i - 1].upperLimit + 1 : 0)
      } X ${taxBrackets[i].rate} = ${roundHalf(
        (taxBrackets[i].upperLimit -
          (taxBrackets[i - 1] ? taxBrackets[i - 1].upperLimit + 1 : 0)) *
        taxBrackets[i].rate
      )}`
    );
  }
  if (income > taxBrackets[taxBrackets.length - 1].upperLimit + 1) {
    tax += (income - taxBrackets[taxBrackets.length - 1].upperLimit + 1) * 0.5;
    actions.push(
      `${income - taxBrackets[taxBrackets.length - 1].upperLimit + 1
      } X 0.5 = ${roundHalf(tax)}`
    );
  }
  if (credits && credits > 0) {
    actions.push(
      `${credits} X ${taxNumbers2023.creditsValue} = ${roundHalf(
        credits * taxNumbers2023.creditsValue
      )} (נקודות זיכוי)`,
      `${roundHalf(tax)} - ${roundHalf(
        credits * taxNumbers2023.creditsValue
      )} = ${roundHalf(tax - credits * creditsValue)}`
    );
    tax = tax - credits * creditsValue;
    if (tax < 0) {
      tax = 0;
    }
  }
  return { tax: tax, actions: actions };
}

export default function Home() {
  const [confetti, setConfetti] = useState<any>(undefined);
  useEffect(() => {
    const jsConfetti = new JSConfetti();
    setConfetti(jsConfetti);
  }, []);

  const [income, setIncome] = useState<any>(undefined);
  const [isSet, setIsSet] = useState(false);
  const [points, setPoints] = useState<any>(undefined);
  const [calculation, setCalculation] = useState({
    monthlyTax2022: 0,
    annualTax2022: 0,
    monthlyTax2023: 0,
    annualTax2023: 0,
    monthlyDifference: 0,
    annualDifference: 0,
    actions: [] as string[],
  });
  const [popup, setPopup] = useState(false);
  function parseNumber(number: number) {
    return new Intl.NumberFormat("en-US").format(number) + " שקלים";
  }
  function parseUpperLimit(number: number) {
    if (number < taxNumbers2023.taxBrackets[0].upperLimit) {
      return "הראשונה";
    } else if (number < taxNumbers2023.taxBrackets[1].upperLimit) {
      return "השנייה";
    } else if (number < taxNumbers2023.taxBrackets[2].upperLimit) {
      return "השלישית";
    } else if (number < taxNumbers2023.taxBrackets[3].upperLimit) {
      return "הרביעית";
    } else if (number < taxNumbers2023.taxBrackets[4].upperLimit) {
      return "החמישית";
    } else if (number < taxNumbers2023.taxBrackets[5].upperLimit) {
      return "השישית";
    }
    return "האחרונה";
  }

  return (
    <div className={styles.container}>
      <motion.div className={styles.shareSection}>
        <motion.p>אהבתם?</motion.p>
        <div className={styles.shareIcons}>
          <FacebookShareButton
            title="מחשבון מס 2023"
            quote="בדקו עכשיו כמה מס תחסכו השנה בהתאם להורדת המיסים בחוק"
            url="https://nvdvrts.com/itay-meitav/tax-difference-calculator"
          >
            <AiFillFacebook size={"24px"} />
          </FacebookShareButton>
          <LinkedinShareButton
            title="מחשבון מס 2023"
            summary="בדקו עכשיו כמה מס תחסכו השנה בהתאם להורדת המיסים בחוק"
            url="https://nvdvrts.com/itay-meitav/tax-difference-calculator"
            source="מחשבון מס לשנת 2023"
          >
            <AiFillLinkedin size={"24px"} />
          </LinkedinShareButton>
          <TwitterShareButton
            title="מחשבון מס 2023"
            via="בדקו עכשיו כמה מס תחסכו השנה בהתאם להורדת המיסים בחוק"
            url="https://nvdvrts.com/itay-meitav/tax-difference-calculator"
          >
            <AiFillTwitterCircle size={"24px"} />
          </TwitterShareButton>
          <WhatsappShareButton
            title="מחשבון מס 2023"
            url="https://nvdvrts.com/itay-meitav/tax-difference-calculator"
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
                אתם הזנתם את הסכום <span>{parseNumber(income)}</span> מה שמעמיד
                אתכם במדרגה <span>{parseUpperLimit(income)}.</span>
                <br />
                <br />
                <div>
                  {calculation.actions.map((x, i) => (
                    <p key={i}>{x}</p>
                  ))}
                </div>
                <br />
                תושב ישראל זכאי ל-2.25 נקודות זיכוי וערכה החודשי נכון להיום הוא
                235 שקלים (2,820 ₪ בשנה).
                <br />
                כאמור קיבלנו מס חודשי של{" "}
                <span>{parseNumber(calculation.monthlyTax2023)}</span> ומס שנתי
                של <span>{parseNumber(calculation.annualTax2023)}</span>.
                {/* {income * 0.06 > 658} */}
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
                {taxNumbers2023.taxBrackets.map((x, i) => (
                  <tr key={i}>
                    <td>{parseNumber(x.upperLimit)}</td>
                    <td>
                      {i !== taxNumbers2023.taxBrackets.length - 1
                        ? parseNumber(
                          taxNumbers2023.taxBrackets[i + 1].upperLimit -
                          (x.upperLimit + 1)
                        )
                        : "כל שקל נוסף"}
                    </td>
                    <td>{x.rate}</td>
                  </tr>
                ))}
                <tr>
                  <td>
                    מעל{" "}
                    {parseNumber(
                      taxNumbers2023.taxBrackets[
                        taxNumbers2023.taxBrackets.length - 1
                      ].upperLimit
                    )}
                  </td>
                  <td>כל שקל נוסף</td>
                  <td>0.5</td>
                </tr>
              </motion.table>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={styles.main}>
        <NextSeo title="מחשבון הפרשי מס 2022 - 2023" />
        <h1>מחשבון מס</h1>
        <form
          className={styles.formSection}
          onSubmit={(e) => {
            e.preventDefault();
            setIsSet(true);
            const calculated = calculateTax(income, points);
            if (calculated.monthlyTax2022 !== calculation.monthlyTax2022) {
              // google.event({ action: "calculate", data: { income, points } });
            }
            setCalculation(calculated);
            confetti.addConfetti({
              emojis: ["💸", "💶", "💷", "💵", "⚡️", "🤩", "✨", "💰"],
            });
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
              <h1>2022</h1>
              <p>
                מס בחודש: <span>{parseNumber(calculation.monthlyTax2022)}</span>
              </p>
              <p>
                מס בשנה: <span>{parseNumber(calculation.annualTax2022)}</span>
              </p>
            </div>
            <div>
              <h1>2023</h1>
              <p>
                מס בחודש: <span>{parseNumber(calculation.monthlyTax2023)}</span>
              </p>
              <p>
                מס בשנה: <span>{parseNumber(calculation.annualTax2023)}</span>
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