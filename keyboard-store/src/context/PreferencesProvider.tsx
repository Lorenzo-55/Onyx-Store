import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { LANGUAGE_KEY, LOCALES, PreferencesContext, THEME_KEY, translate, type Language, type Theme } from './preferences-context'
function readLanguage():Language {try{const saved=localStorage.getItem(LANGUAGE_KEY);if(saved==='it'||saved==='de')return saved}catch{/* Default remains available. */}return 'en'}
function readTheme():Theme {try{const saved=localStorage.getItem(THEME_KEY);if(saved==='light'||saved==='dark')return saved}catch{/* Use the system preference. */}return typeof matchMedia==='function'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):'dark'}
export default function PreferencesProvider({children}:{children:ReactNode}){
 const [language,setLanguage]=useState(readLanguage),[theme,setTheme]=useState(readTheme)
 useEffect(()=>{document.documentElement.lang=language;try{localStorage.setItem(LANGUAGE_KEY,language)}catch{/* In-memory preference still works. */}},[language])
 useEffect(()=>{document.documentElement.dataset.theme=theme;try{localStorage.setItem(THEME_KEY,theme)}catch{/* In-memory preference still works. */}},[theme])
 const t=useCallback((text:string,params?:Record<string,string|number>)=>translate(language,text,params),[language])
 const money=useCallback((n:number)=>new Intl.NumberFormat(LOCALES[language],{style:'currency',currency:'USD'}).format(n),[language])
 return <PreferencesContext.Provider value={{language,theme,setLanguage,setTheme,t,money}}>{children}</PreferencesContext.Provider>
}
