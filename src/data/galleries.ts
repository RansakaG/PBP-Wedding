import { GalleryImage, GalleryCategory } from '../types/gallery';
import { addThumbnailUrls } from '../utils/image-utils';

// Import cover images and their thumbnails
const dilushaPre = new URL('../assets/wedding/Dilusha-Ruwindi,Pre-Wedding Shoot/0 (10).webp', import.meta.url).href;
const dilushaPreThumb = new URL('../assets/wedding/Dilusha-Ruwindi,Pre-Wedding Shoot/0 (10)-thumb.webp', import.meta.url).href;

const dilushaWedding = new URL('../assets/wedding/Dilusha-Ruwindi,Wedding/P15.webp', import.meta.url).href;
const dilushaWeddingThumb = new URL('../assets/wedding/Dilusha-Ruwindi,Wedding/P15-thumb.webp', import.meta.url).href;

const kalpanaIsuru = new URL('../assets/wedding/Kalpana-Isuru/R6PB4326.webp', import.meta.url).href;
const kalpanaIsuruThumb = new URL('../assets/wedding/Kalpana-Isuru/R6PB4326-thumb.webp', import.meta.url).href;

const nishdiSahan = new URL('../assets/wedding/Nishdi-Sahan,Wedding/IMGL7034.webp', import.meta.url).href;
const nishdiSahanThumb = new URL('../assets/wedding/Nishdi-Sahan,Wedding/IMGL7034-thumb.webp', import.meta.url).href;

const sanjaMigara = new URL('../assets/wedding/Sanja-Migara,Wedding/A9.webp', import.meta.url).href;
const sanjaMigaraThumb = new URL('../assets/wedding/Sanja-Migara,Wedding/A9-thumb.webp', import.meta.url).href;

const sandaliChathuranga = new URL('../assets/wedding/Sandali & Chathuranga/0 (2).webp', import.meta.url).href;
const sandaliChathurangaThumb = new URL('../assets/wedding/Sandali & Chathuranga/0 (2)-thumb.webp', import.meta.url).href;

const categories: GalleryCategory[] = [
  {
    id: 'dilusha-pre',
    title: 'Dilusha & Ruwindi',
    description: 'Beautiful moments from their pre-wedding photoshoot',
    coverImage: dilushaPre,
    thumbnailUrl: dilushaPreThumb,
    path: '/gallery/dilusha-pre'
  },
  {
    id: 'dilusha-wedding',
    title: 'Dilusha & Ruwindi',
    description: 'Capturing the magic of their special day',
    coverImage: dilushaWedding,
    thumbnailUrl: dilushaWeddingThumb,
    path: '/gallery/dilusha-wedding'
  },
  {
    id: 'kalpana-isuru',
    title: 'Kalpana & Isuru',
    description: 'A celebration of love and joy',
    coverImage: kalpanaIsuru,
    thumbnailUrl: kalpanaIsuruThumb,
    path: '/gallery/kalpana-isuru'
  },
  {
    id: 'nishdi-sahan',
    title: 'Nishdi & Sahan',
    description: 'Elegant moments from their wedding celebration',
    coverImage: nishdiSahan,
    thumbnailUrl: nishdiSahanThumb,
    path: '/gallery/nishdi-sahan'
  },
  {
    id: 'sanja-migara',
    title: 'Sanja & Migara',
    description: 'Beautiful wedding day memories',
    coverImage: sanjaMigara,
    thumbnailUrl: sanjaMigaraThumb,
    path: '/gallery/sanja-migara'
  },
  {
    id: 'sandali-chathuranga',
    title: 'Sandali & Chathuranga',
    description: 'Beautiful model photoshoot showcasing their chemistry',
    coverImage: sandaliChathuranga,
    thumbnailUrl: sandaliChathurangaThumb,
    path: '/gallery/sandali-chathuranga'
  }
];

// Import gallery images
const rawGalleryImages: Record<string, GalleryImage[]> = {
  'dilusha-pre': [
    { id: 'dp1', url: new URL('../assets/wedding/Dilusha-Ruwindi,Pre-Wedding Shoot/0 (10).webp', import.meta.url).href, title: 'Pre-Wedding 1', category: 'pre-wedding' },
    { id: 'dp2', url: new URL('../assets/wedding/Dilusha-Ruwindi,Pre-Wedding Shoot/0 (11).webp', import.meta.url).href, title: 'Pre-Wedding 2', category: 'pre-wedding' },
    { id: 'dp3', url: new URL('../assets/wedding/Dilusha-Ruwindi,Pre-Wedding Shoot/0 (3).webp', import.meta.url).href, title: 'Pre-Wedding 3', category: 'pre-wedding' },
    { id: 'dp4', url: new URL('../assets/wedding/Dilusha-Ruwindi,Pre-Wedding Shoot/0 (15).webp', import.meta.url).href, title: 'Pre-Wedding 4', category: 'pre-wedding' },
    { id: 'dp5', url: new URL('../assets/wedding/Dilusha-Ruwindi,Pre-Wedding Shoot/0 (18).webp', import.meta.url).href, title: 'Pre-Wedding 5', category: 'pre-wedding' },
    { id: 'dp6', url: new URL('../assets/wedding/Dilusha-Ruwindi,Pre-Wedding Shoot/0 (2) (1).webp', import.meta.url).href, title: 'Pre-Wedding 6', category: 'pre-wedding' },
    { id: 'dp7', url: new URL('../assets/wedding/Dilusha-Ruwindi,Pre-Wedding Shoot/0 (5).webp', import.meta.url).href, title: 'Pre-Wedding 7', category: 'pre-wedding' },
    { id: 'dp8', url: new URL('../assets/wedding/Dilusha-Ruwindi,Pre-Wedding Shoot/0 (4).webp', import.meta.url).href, title: 'Pre-Wedding 8', category: 'pre-wedding' },
    { id: 'dp9', url: new URL('../assets/wedding/Dilusha-Ruwindi,Pre-Wedding Shoot/0 (14).webp', import.meta.url).href, title: 'Pre-Wedding 9', category: 'pre-wedding' },
    { id: 'dp10', url: new URL('../assets/wedding/Dilusha-Ruwindi,Pre-Wedding Shoot/0 (8).webp', import.meta.url).href, title: 'Pre-Wedding 10', category: 'pre-wedding' },
    { id: 'dp11', url: new URL('../assets/wedding/Dilusha-Ruwindi,Pre-Wedding Shoot/0 (9).webp', import.meta.url).href, title: 'Pre-Wedding 11', category: 'pre-wedding' }
  ],
  'dilusha-wedding': [
    { id: 'dw1', url: new URL('../assets/wedding/Dilusha-Ruwindi,Wedding/P1.webp', import.meta.url).href, title: 'Wedding 1', category: 'wedding' },
    { id: 'dw2', url: new URL('../assets/wedding/Dilusha-Ruwindi,Wedding/P2.webp', import.meta.url).href, title: 'Wedding 2', category: 'wedding' },
    { id: 'dw3', url: new URL('../assets/wedding/Dilusha-Ruwindi,Wedding/P3.webp', import.meta.url).href, title: 'Wedding 3', category: 'wedding' },
    { id: 'dw4', url: new URL('../assets/wedding/Dilusha-Ruwindi,Wedding/P4.webp', import.meta.url).href, title: 'Wedding 4', category: 'wedding' },
    { id: 'dw5', url: new URL('../assets/wedding/Dilusha-Ruwindi,Wedding/P5.webp', import.meta.url).href, title: 'Wedding 5', category: 'wedding' },
    { id: 'dw6', url: new URL('../assets/wedding/Dilusha-Ruwindi,Wedding/P6.webp', import.meta.url).href, title: 'Wedding 6', category: 'wedding' },
    { id: 'dw7', url: new URL('../assets/wedding/Dilusha-Ruwindi,Wedding/P7.webp', import.meta.url).href, title: 'Wedding 7', category: 'wedding' },
    { id: 'dw8', url: new URL('../assets/wedding/Dilusha-Ruwindi,Wedding/P8.webp', import.meta.url).href, title: 'Wedding 8', category: 'wedding' },
    { id: 'dw9', url: new URL('../assets/wedding/Dilusha-Ruwindi,Wedding/P9.webp', import.meta.url).href, title: 'Wedding 9', category: 'wedding' },
    { id: 'dw10', url: new URL('../assets/wedding/Dilusha-Ruwindi,Wedding/P10.webp', import.meta.url).href, title: 'Wedding 10', category: 'wedding' },
    { id: 'dw11', url: new URL('../assets/wedding/Dilusha-Ruwindi,Wedding/P15.webp', import.meta.url).href, title: 'Wedding 11', category: 'wedding' },
    { id: 'dw12', url: new URL('../assets/wedding/Dilusha-Ruwindi,Wedding/P12.webp', import.meta.url).href, title: 'Wedding 12', category: 'wedding' },
    { id: 'dw13', url: new URL('../assets/wedding/Dilusha-Ruwindi,Wedding/P13.webp', import.meta.url).href, title: 'Wedding 13', category: 'wedding' },
    { id: 'dw14', url: new URL('../assets/wedding/Dilusha-Ruwindi,Wedding/P14.webp', import.meta.url).href, title: 'Wedding 14', category: 'wedding' },
    { id: 'dw15', url: new URL('../assets/wedding/Dilusha-Ruwindi,Wedding/P11.webp', import.meta.url).href, title: 'Wedding 15', category: 'wedding' }
  ],
  'kalpana-isuru': [
    { id: 'ki1', url: new URL('../assets/wedding/Kalpana-Isuru/R6PB4043.webp', import.meta.url).href, title: 'Moment 1', category: 'wedding' },
    { id: 'ki2', url: new URL('../assets/wedding/Kalpana-Isuru/R6PB4533.webp', import.meta.url).href, title: 'Moment 2', category: 'wedding' },
    { id: 'ki3', url: new URL('../assets/wedding/Kalpana-Isuru/R6PB4056.webp', import.meta.url).href, title: 'Moment 3', category: 'wedding' },
    { id: 'ki4', url: new URL('../assets/wedding/Kalpana-Isuru/R6PB4326.webp', import.meta.url).href, title: 'Moment 4', category: 'wedding' },
    { id: 'ki5', url: new URL('../assets/wedding/Kalpana-Isuru/R6PB4377.webp', import.meta.url).href, title: 'Moment 5', category: 'wedding' },
    { id: 'ki6', url: new URL('../assets/wedding/Kalpana-Isuru/R6PB4195.webp', import.meta.url).href, title: 'Moment 6', category: 'wedding' },
    { id: 'ki7', url: new URL('../assets/wedding/Kalpana-Isuru/R6PB4268.webp', import.meta.url).href, title: 'Moment 7', category: 'wedding' },
    { id: 'ki8', url: new URL('../assets/wedding/Kalpana-Isuru/R6PB4313.webp', import.meta.url).href, title: 'Moment 8', category: 'wedding' },
    { id: 'ki9', url: new URL('../assets/wedding/Kalpana-Isuru/R6PB4073.webp', import.meta.url).href, title: 'Moment 9', category: 'wedding' },
    { id: 'ki10', url: new URL('../assets/wedding/Kalpana-Isuru/R6PB4332.webp', import.meta.url).href, title: 'Moment 10', category: 'wedding' },
    { id: 'ki11', url: new URL('../assets/wedding/Kalpana-Isuru/R6PB4354.webp', import.meta.url).href, title: 'Moment 11', category: 'wedding' },
    { id: 'ki12', url: new URL('../assets/wedding/Kalpana-Isuru/R6PB4371.webp', import.meta.url).href, title: 'Moment 12', category: 'wedding' },
    { id: 'ki13', url: new URL('../assets/wedding/Kalpana-Isuru/R6PB4078.webp', import.meta.url).href, title: 'Moment 13', category: 'wedding' },
    { id: 'ki14', url: new URL('../assets/wedding/Kalpana-Isuru/R6PB4389.webp', import.meta.url).href, title: 'Moment 14', category: 'wedding' },
    { id: 'ki15', url: new URL('../assets/wedding/Kalpana-Isuru/R6PB4048.webp', import.meta.url).href, title: 'Moment 15', category: 'wedding' }
  ],
  'nishdi-sahan': [
    { id: 'ns1', url: new URL('../assets/wedding/Nishdi-Sahan,Wedding/IMGL7023.webp', import.meta.url).href, title: 'Wedding 1', category: 'wedding' },
    { id: 'ns2', url: new URL('../assets/wedding/Nishdi-Sahan,Wedding/IMGL7029.webp', import.meta.url).href, title: 'Wedding 2', category: 'wedding' },
    { id: 'ns3', url: new URL('../assets/wedding/Nishdi-Sahan,Wedding/IMGL7034.webp', import.meta.url).href, title: 'Wedding 3', category: 'wedding' },
    { id: 'ns4', url: new URL('../assets/wedding/Nishdi-Sahan,Wedding/IMGL7044.webp', import.meta.url).href, title: 'Wedding 4', category: 'wedding' },
    { id: 'ns5', url: new URL('../assets/wedding/Nishdi-Sahan,Wedding/IMGL7051.webp', import.meta.url).href, title: 'Wedding 5', category: 'wedding' },
    { id: 'ns6', url: new URL('../assets/wedding/Nishdi-Sahan,Wedding/IMGL7063.webp', import.meta.url).href, title: 'Wedding 6', category: 'wedding' },
    { id: 'ns7', url: new URL('../assets/wedding/Nishdi-Sahan,Wedding/IMGL7100.webp', import.meta.url).href, title: 'Wedding 7', category: 'wedding' },
    { id: 'ns8', url: new URL('../assets/wedding/Nishdi-Sahan,Wedding/IMGL7110.webp', import.meta.url).href, title: 'Wedding 8', category: 'wedding' },
    { id: 'ns9', url: new URL('../assets/wedding/Nishdi-Sahan,Wedding/IMGL7112.webp', import.meta.url).href, title: 'Wedding 9', category: 'wedding' },
    { id: 'ns10', url: new URL('../assets/wedding/Nishdi-Sahan,Wedding/IMGL7124.webp', import.meta.url).href, title: 'Wedding 10', category: 'wedding' },
    { id: 'ns11', url: new URL('../assets/wedding/Nishdi-Sahan,Wedding/IMGL7165.webp', import.meta.url).href, title: 'Wedding 11', category: 'wedding' },
    { id: 'ns12', url: new URL('../assets/wedding/Nishdi-Sahan,Wedding/IMGL7183.webp', import.meta.url).href, title: 'Wedding 12', category: 'wedding' },
    { id: 'ns13', url: new URL('../assets/wedding/Nishdi-Sahan,Wedding/IMGL7192.webp', import.meta.url).href, title: 'Wedding 13', category: 'wedding' },
    { id: 'ns14', url: new URL('../assets/wedding/Nishdi-Sahan,Wedding/IMGL7202.webp', import.meta.url).href, title: 'Wedding 14', category: 'wedding' },
    
  ],
  'sanja-migara': [
    { id: 'sm1', url: new URL('../assets/wedding/Sanja-Migara,Wedding/A1.webp', import.meta.url).href, title: 'Wedding 1', category: 'wedding' },
    { id: 'sm2', url: new URL('../assets/wedding/Sanja-Migara,Wedding/A4.webp', import.meta.url).href, title: 'Wedding 2', category: 'wedding' },
    { id: 'sm3', url: new URL('../assets/wedding/Sanja-Migara,Wedding/A6.webp', import.meta.url).href, title: 'Wedding 3', category: 'wedding' },
    { id: 'sm4', url: new URL('../assets/wedding/Sanja-Migara,Wedding/A8.webp', import.meta.url).href, title: 'Wedding 4', category: 'wedding' },
    { id: 'sm5', url: new URL('../assets/wedding/Sanja-Migara,Wedding/A9.webp', import.meta.url).href, title: 'Wedding 5', category: 'wedding' },
    { id: 'sm6', url: new URL('../assets/wedding/Sanja-Migara,Wedding/A10.webp', import.meta.url).href, title: 'Wedding 6', category: 'wedding' },
    { id: 'sm7', url: new URL('../assets/wedding/Sanja-Migara,Wedding/A11.webp', import.meta.url).href, title: 'Wedding 7', category: 'wedding' },
    { id: 'sm8', url: new URL('../assets/wedding/Sanja-Migara,Wedding/A13.webp', import.meta.url).href, title: 'Wedding 8', category: 'wedding' },
    { id: 'sm9', url: new URL('../assets/wedding/Sanja-Migara,Wedding/A18.webp', import.meta.url).href, title: 'Wedding 9', category: 'wedding' },
    { id: 'sm10', url: new URL('../assets/wedding/Sanja-Migara,Wedding/B1.webp', import.meta.url).href, title: 'Wedding 10', category: 'wedding' },
    { id: 'sm11', url: new URL('../assets/wedding/Sanja-Migara,Wedding/B10.webp', import.meta.url).href, title: 'Wedding 11', category: 'wedding' },
    { id: 'sm12', url: new URL('../assets/wedding/Sanja-Migara,Wedding/B11.webp', import.meta.url).href, title: 'Wedding 12', category: 'wedding' },
    { id: 'sm13', url: new URL('../assets/wedding/Sanja-Migara,Wedding/B16.webp', import.meta.url).href, title: 'Wedding 13', category: 'wedding' }
  ],
  'sandali-chathuranga': [
    { id: 'sc1', url: new URL('../assets/wedding/Sandali & Chathuranga/0 (6).webp', import.meta.url).href, title: 'Model Shoot 1', category: 'model-shoot' },
    { id: 'sc2', url: new URL('../assets/wedding/Sandali & Chathuranga/0 (7).webp', import.meta.url).href, title: 'Model Shoot 2', category: 'model-shoot' },
    { id: 'sc3', url: new URL('../assets/wedding/Sandali & Chathuranga/0 (3).webp', import.meta.url).href, title: 'Model Shoot 3', category: 'model-shoot' },
    { id: 'sc4', url: new URL('../assets/wedding/Sandali & Chathuranga/0 (1).webp', import.meta.url).href, title: 'Model Shoot 4', category: 'model-shoot' },
    { id: 'sc5', url: new URL('../assets/wedding/Sandali & Chathuranga/0 (5).webp', import.meta.url).href, title: 'Model Shoot 5', category: 'model-shoot' },
    { id: 'sc6', url: new URL('../assets/wedding/Sandali & Chathuranga/0 (4).webp', import.meta.url).href, title: 'Model Shoot 6', category: 'model-shoot' },
    { id: 'sc7', url: new URL('../assets/wedding/Sandali & Chathuranga/0 (11).webp', import.meta.url).href, title: 'Model Shoot 7', category: 'model-shoot' },
    { id: 'sc8', url: new URL('../assets/wedding/Sandali & Chathuranga/0 (8).webp', import.meta.url).href, title: 'Model Shoot 8', category: 'model-shoot' },
    { id: 'sc9', url: new URL('../assets/wedding/Sandali & Chathuranga/0 (9).webp', import.meta.url).href, title: 'Model Shoot 9', category: 'model-shoot' },
    { id: 'sc10', url: new URL('../assets/wedding/Sandali & Chathuranga/0 (10).webp', import.meta.url).href, title: 'Model Shoot 10', category: 'model-shoot' },
    { id: 'sc11', url: new URL('../assets/wedding/Sandali & Chathuranga/0 (2).webp', import.meta.url).href, title: 'Model Shoot 11', category: 'model-shoot' }
  ]
};

// Process images to add thumbnail URLs
const galleryImages: Record<string, GalleryImage[]> = Object.fromEntries(
  Object.entries(rawGalleryImages).map(([key, images]) => [key, addThumbnailUrls(images)])
);

export { galleryImages };
export default categories;