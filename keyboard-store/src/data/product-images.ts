export type ImageMode = 'provided' | 'placeholders'
// Change this one setting to 'placeholders' to restore the original artwork site-wide.
export const PRODUCT_IMAGE_MODE: ImageMode = 'provided'
export interface ProductImageAsset { src: string; label: string; kind: 'provided' | 'placeholder' }
const supplied = (file: string, label: string): ProductImageAsset => ({src:`/images/provided/${file}.png`,label,kind:'provided'})
const atlasVariants=supplied('atlas-variants','Variant overview')
const arcVariants=supplied('arc-variants','Variant overview')
export const providedGalleries: Record<string, Record<string, ProductImageAsset[]>> = {
 atlas: {
  sage: [supplied('atlas-sage-overview','Overview'),supplied('atlas-sage-alternate','Alternate view'),supplied('atlas-sage-detail','Detail view'),atlasVariants],
  sand: [supplied('atlas-sand-overview','Overview'),supplied('atlas-sand-detail','Detail view'),supplied('atlas-sand-detail-2','Detail view'),supplied('atlas-sand-detail-3','Detail view'),atlasVariants],
 },
 slate: {
  graphite: [supplied('slate-graphite-overview','Overview')],
  silver: [supplied('slate-silver-overview','Overview')],
 },
 arc: {
  olive: [supplied('arc-olive-overview','Overview'),supplied('arc-olive-alternate','Alternate view'),supplied('arc-olive-alternate-2','Alternate view'),arcVariants],
  stone: [supplied('arc-stone-overview','Overview'),supplied('arc-stone-top','Top view'),supplied('arc-stone-alternate','Alternate view'),arcVariants],
 },
}
export const placeholderImageOf = (productId: string, variantId: string, view=0) => `/images/${productId}-${variantId}-${view===1?1:0}.svg`
export function galleryOf(productId: string, variantId: string, mode:ImageMode=PRODUCT_IMAGE_MODE):ProductImageAsset[]{
 const provided=providedGalleries[productId]?.[variantId]
 if(mode==='provided'&&provided?.length)return provided
 return [0,1].map(view=>({src:placeholderImageOf(productId,variantId,view),label:view?'Top view':'Angled view',kind:'placeholder'}))
}
