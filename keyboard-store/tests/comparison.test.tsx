import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import { COMPARISON_KEY } from '../src/context/comparison-context'
function open(path:string){window.history.replaceState({},'',path);return render(<App/>)}
describe('product comparison',()=>{
 it('selects products, enforces the limit, compares differences and clears',async()=>{
  const user=userEvent.setup();open('/products')
  for(const name of ['Atlas 75','Slate TKL','Arc 98'])await user.click(screen.getByRole('button',{name:'Compare '+name,exact:true}))
  expect(screen.getByRole('button',{name:'Compare Drift 60',exact:true})).toBeDisabled()
  expect(screen.getByRole('button',{name:'Remove Atlas 75 from comparison'})).toHaveAttribute('aria-pressed','true')
  await user.click(screen.getByRole('link',{name:'Compare products (3)'}))
  const table=screen.getByRole('table');expect(within(table).getByText('$189.00')).toBeInTheDocument()
  expect(within(table).getByRole('rowheader',{name:'Layout'})).toBeInTheDocument()
  await user.click(screen.getByRole('checkbox',{name:'Show differences only'}))
  expect(within(table).queryByRole('rowheader',{name:'Category'})).not.toBeInTheDocument()
  expect(within(table).getByRole('rowheader',{name:'Layout'})).toBeInTheDocument()
  await user.click(screen.getByRole('button',{name:'Remove Slate TKL from comparison'}))
  expect(JSON.parse(localStorage.getItem(COMPARISON_KEY)!)).toEqual(['atlas','arc'])
  await user.click(screen.getByRole('button',{name:'Clear comparison'}))
  expect(screen.getByText('Your comparison is empty. Add products from the collection.')).toBeInTheDocument()
 })
 it('restores valid unique products and handles different categories',()=>{
  localStorage.setItem(COMPARISON_KEY,JSON.stringify(['atlas','atlas','missing',null,'chalk']))
  open('/compare');expect(screen.getAllByRole('columnheader')).toHaveLength(3)
  expect(screen.getAllByText('Not applicable').length).toBeGreaterThan(0)
  expect(JSON.parse(localStorage.getItem(COMPARISON_KEY)!)).toEqual(['atlas','chalk'])
 })
 it('selects on details, persists after remount and supports Italian',async()=>{
  const user=userEvent.setup();const app=open('/products/atlas')
  await user.click(screen.getByRole('button',{name:'Compare Atlas 75',exact:true}));app.unmount()
  open('/compare');expect(screen.getByRole('columnheader',{name:/Atlas 75/})).toBeInTheDocument()
  await user.selectOptions(screen.getByRole('combobox',{name:'Language'}),'it')
  expect(screen.getByRole('heading',{name:'Confronta prodotti'})).toBeInTheDocument()
 })
 it('recovers from invalid storage and continues when writes fail',async()=>{
  localStorage.setItem(COMPARISON_KEY,'broken')
  vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('Blocked')})
  try{const user=userEvent.setup();open('/products/atlas');await user.click(screen.getByRole('button',{name:'Compare Atlas 75',exact:true}));expect(screen.getByRole('link',{name:'Compare products (1)'})).toBeInTheDocument()}finally{vi.restoreAllMocks()}
 })
})
