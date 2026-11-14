import { describe, expect, it } from 'vitest'
import { validateReceipt } from '../src/lib/receipt'
const receipt={id:'DEMO-TEST',lines:[{name:'Atlas 75',variant:'Sand',quantity:2,unitPrice:194}],subtotal:388,shipping:0,total:388}
describe('receipt recovery',()=>{
 it('restores only a coherent receipt',()=>expect(validateReceipt(receipt)).toEqual(receipt))
 it.each([null,{},'bad',{...receipt,lines:[null]},{...receipt,lines:[{name:'Bad',variant:'Bad',quantity:Infinity,unitPrice:1}]},{...receipt,subtotal:1},{...receipt,total:-1},{...receipt,shipping:9}])('ignores malformed or inconsistent receipt data %#',value=>expect(validateReceipt(value)).toBeNull())
 it('retains no extra personal fields from stored data',()=>{expect(validateReceipt({...receipt,email:'demo@example.com',address:'12 Sample Street',lines:[{...receipt.lines[0],email:'demo@example.com'}]})).toEqual(receipt)})
})
