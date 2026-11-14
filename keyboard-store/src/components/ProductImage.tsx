import { useState, type ImgHTMLAttributes } from 'react'
interface Props extends ImgHTMLAttributes<HTMLImageElement> { fallbackSrc: string }
// A missing supplied file falls back to preserved artwork without a retry loop.
export default function ProductImage({src,fallbackSrc,alt,onLoad,...props}:Props){
 const [failedSrc,setFailedSrc]=useState<string>()
 const resolved=src===failedSrc?fallbackSrc:src
 return <img {...props} src={resolved} alt={alt} onLoad={event=>{
  const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches
  if(!reduced&&typeof event.currentTarget.animate==='function'){
   event.currentTarget.animate([{opacity:0.35},{opacity:1}],{duration:260,easing:'ease-out'})
  }
  onLoad?.(event)
 }} onError={()=>{if(resolved!==fallbackSrc)setFailedSrc(src)}}/>
}

