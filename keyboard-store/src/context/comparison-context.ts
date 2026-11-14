import { createContext, useContext } from 'react'
export const COMPARISON_KEY='onyx-comparison'
export const COMPARISON_LIMIT=3
export interface Comparison { ids:string[]; toggle:(id:string)=>void; clear:()=>void }
export const ComparisonContext=createContext<Comparison|null>(null)
export function useComparison(){const value=useContext(ComparisonContext);if(!value)throw new Error('ComparisonProvider is required');return value}
