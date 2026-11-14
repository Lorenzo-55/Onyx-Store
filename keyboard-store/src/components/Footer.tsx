import { usePreferences } from '../context/preferences-context'
import { Link } from 'react-router-dom'
import { BRAND } from '../lib/format'
export default function Footer(){
 const {t}=usePreferences()
return <footer><div><Link className="logo" to="/">{BRAND}<sup>®</sup></Link><p>{t("A little more intention.")}<br/>{t("In every keystroke.")}</p></div><div><p className="eyebrow">{t("EXPLORE")}</p><Link to="/products">{t("The collection")}</Link><a href="/#philosophy">{t("Our philosophy")}</a><Link to="/cart">{t("Your bag")}</Link></div><div className="footer-note"><span>{t("DESIGNED FOR THE EVERYDAY ENTHUSIAST.")}</span><p>{t("Portfolio concept · Sample products & prices.")}<br/>{t("Concept product imagery. No real orders or payments.")}</p></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {BRAND} {t("— Concept storefront.")}</span><span>{t("Built with intention.")} <b>●</b></span></div></footer>}
