// Real project URLs supplied by Huzaifa.
// `category` is a neutral label inferred from each site's name; edit freely.
// Screenshots: drop a file at public/screenshots/<slug>.jpg to override the
// automatic preview (see README).
export const projects = [
  { slug: 'total-medical-az', title: 'Total Medical AZ', category: 'Healthcare website', url: 'https://totalmedicalaz.com/' },
  { slug: 'zced-dubai', title: 'ZCED Dubai', category: 'Business website', url: 'https://zcedubai.com/' },
  { slug: 'five-pearls', title: 'Five Pearls', category: 'Business website', url: 'https://fivepearls.com.au/' },
  { slug: 'ibg-middle-east', title: 'IBG Middle East', category: 'Corporate website', url: 'https://ibgme.co/' },
  { slug: 'orontes', title: 'Orontes', category: 'Staging preview', url: 'https://dev3.inserito.com/orontes' },
  { slug: 'manjaros-restaurant', title: 'Manjaros Restaurant', category: 'Restaurant website', url: 'https://manjarosrestaurant.com/' },
  { slug: 'bvf-builds', title: 'BVF Builds', category: 'Construction website', url: 'https://bvf-builds.com/' },
  { slug: 'wood-supply-uae', title: 'Wood Supply UAE', category: 'Supplier website', url: 'https://woodsupply.ae/' },
].map((p) => ({ ...p, host: new URL(p.url).host }))
