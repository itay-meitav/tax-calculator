'use client';

import { FacebookShareButton, LinkedinShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import { AiFillLinkedin, AiFillFacebook, AiOutlineWhatsApp } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";
import { TAXES_2024 } from "../../enums";
import styles from "./styles.module.scss";

const SITE_URL = "https://tax-calculator-2026.vercel.app/";
const SHARE_TITLE = "מחשבון הפרשי מס 2023 - 2026";
const SHARE_DESCRIPTION = "השוו את המס שלכם בין השנים וגלו כמה תשלמו פחות";

const DISCLAIMER_ITEMS = [
  {
    id: 'credits',
    text: `תושב ישראל זכאי ל-2.25 נקודות זיכוי וערכה החודשי נכון להיום הוא ${TAXES_2024.creditsValue} שקלים (${(TAXES_2024.creditsValue * 12).toLocaleString('he-IL')} ₪ בשנה).`,
  },
  {
    id: '2026',
    text: 'מדרגות המס ושווי נקודת זיכוי צפויים להיות זהים ל-2025, אך עשויים להשתנות.',
  },
  {
    id: 'rounding',
    text: 'עלולה להופיע סטיה במספר שקלים בגלל טכניקת עיגול מספרים.',
  },
  {
    id: 'disclaimer',
    text: 'הנתונים מבוססים על השינויים שנעשו, ויש להתייחס אליהם בערבון מוגבל בלבד. אין לראות בנתונים המוצגים תחליף להתייעצות עם איש מקצוע (חשב, רואה חשבון).',
  },
];

const socialButtons = [
  {
    id: 'facebook',
    Button: FacebookShareButton,
    Icon: AiFillFacebook,
    props: { hashtag: "#מחשבון_מס", url: SITE_URL },
    label: 'שתף בפייסבוק',
    color: '#1877f2',
  },
  {
    id: 'linkedin',
    Button: LinkedinShareButton,
    Icon: AiFillLinkedin,
    props: { title: SHARE_TITLE, summary: SHARE_DESCRIPTION, url: SITE_URL, source: SHARE_TITLE },
    label: 'שתף בלינקדאין',
    color: '#0a66c2',
  },
  {
    id: 'twitter',
    Button: TwitterShareButton,
    Icon: FaXTwitter,
    props: { title: SHARE_TITLE, url: SITE_URL },
    label: 'שתף בטוויטר',
    color: '#000000',
  },
  {
    id: 'whatsapp',
    Button: WhatsappShareButton,
    Icon: AiOutlineWhatsApp,
    props: { title: SHARE_TITLE, url: SITE_URL },
    label: 'שתף בוואטסאפ',
    color: '#25d366',
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.shareSection}>
          <h3 className={styles.shareTitle}>אהבתם? שתפו!</h3>
          <div className={styles.shareButtons}>
            {socialButtons.map(({ id, Button, Icon, props, label }) => (
              <Button key={id} {...props} className={styles.shareButton} aria-label={label}>
                <Icon size={22} />
              </Button>
            ))}
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.disclaimerSection} id="disclaimers">
          <div className={styles.disclaimerGrid}>
            {DISCLAIMER_ITEMS.map((item, index) => (
              <div key={item.id} className={styles.disclaimerItem}>
                <span className={styles.disclaimerNumber}>{index + 1}</span>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.copyright}>
          <p>נוצר בהערכה ובהצדעה</p>
          <p>
            ע״י{' '}
            <a
              href="https://www.linkedin.com/in/itay-meitav/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.authorLink}
            >
              Itay Meitav
            </a>
          </p>
          <p className={styles.copyrightYear}>© {currentYear}</p>
        </div>
      </div>
    </footer>
  );
}


