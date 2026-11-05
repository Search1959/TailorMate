import { GarmentCategory, MeasurementField } from '../types';

export interface GarmentTemplateDef {
  category: GarmentCategory;
  label: string;
  description: string;
  typicalMetersRequired: number;
  fields: MeasurementField[];
  styleOptions: {
    collars?: string[];
    cuffs?: string[];
    lapels?: string[];
    vents?: string[];
    pockets?: string[];
    linings?: string[];
    buttons?: string[];
  };
}

export const GARMENT_TEMPLATES: Record<GarmentCategory, GarmentTemplateDef> = {
  suit: {
    category: 'suit',
    label: 'Bespoke 2-Pc / 3-Pc Suit',
    description: 'Jacket, waistcoat and trousers with full bespoke anatomical balance',
    typicalMetersRequired: 3.25,
    fields: [
      { key: 'chest', label: 'Chest (Around fullest point)', hint: 'Measured under armpits over shoulder blades', defaultValue: 40, unit: 'inches' },
      { key: 'half_chest', label: 'Half Chest (Nipple to Nipple)', hint: 'Across front chest balance', defaultValue: 8.5, unit: 'inches' },
      { key: 'jacket_waist', label: 'Jacket Waist (At natural waist/button point)', hint: 'Typically 1-2" above navel', defaultValue: 34, unit: 'inches' },
      { key: 'jacket_hip', label: 'Jacket Hip (Seat level)', hint: 'Around fullest part of seat', defaultValue: 41, unit: 'inches' },
      { key: 'shoulder', label: 'Shoulder (Point to point across back)', hint: 'From bone edge to bone edge', defaultValue: 18.25, unit: 'inches' },
      { key: 'sleeve_length', label: 'Sleeve Length', hint: 'From shoulder bone to wrist bone + 0.5"', defaultValue: 25, unit: 'inches' },
      { key: 'bicep', label: 'Bicep', hint: 'Around fullest bicep muscle with arm relaxed', defaultValue: 14, unit: 'inches' },
      { key: 'jacket_length', label: 'Jacket Length (Back nape to hem)', hint: 'From base of collar down center back to thumb knuckle', defaultValue: 29.5, unit: 'inches' },
      { key: 'trouser_waist', label: 'Trouser Waist (Wearing height)', hint: 'Where customer normally wears pants', defaultValue: 33, unit: 'inches' },
      { key: 'trouser_hip', label: 'Trouser Hip/Seat', hint: 'Fullest circumference of seat', defaultValue: 40.5, unit: 'inches' },
      { key: 'inseam', label: 'Trouser Inseam', hint: 'From crotch fork down to shoe heel', defaultValue: 31, unit: 'inches' },
      { key: 'outseam', label: 'Trouser Outseam', hint: 'From waistband top to shoe top/break', defaultValue: 41.5, unit: 'inches' },
      { key: 'thigh', label: 'Thigh Circumference', hint: '1 inch below fork', defaultValue: 24, unit: 'inches' },
      { key: 'bottom_hem', label: 'Trouser Bottom Hem / Opening', hint: 'Cuff width opening at ankle', defaultValue: 15, unit: 'inches' },
    ],
    styleOptions: {
      lapels: ['Notch Lapel (Standard 3.25")', 'Peak Lapel (Power 3.75")', 'Shawl Collar (Tuxedo)', 'Slim Notch (2.5")'],
      vents: ['Double Side Vents (English)', 'Center Single Vent (American)', 'No Vent (Continental)'],
      pockets: ['Flap Pockets with Ticket Pocket', 'Flap Pockets (Classic)', 'Jetted / Besom (Formal)', 'Patch Pockets (Casual)'],
      linings: ['Full Bemberg Silk', 'Half-Lined (Summer)', 'Quarter-Lined Butterfly', 'Unconstructed Skeleton'],
      buttons: ['Corozo Nut (Matte)', 'Genuine Horn', 'Mother of Pearl', 'Antique Brass Crest'],
    },
  },
  blazer: {
    category: 'blazer',
    label: 'Tailored Blazer / Sport Coat',
    description: 'Single or double-breasted jacket for smart-casual & formal wear',
    typicalMetersRequired: 2.0,
    fields: [
      { key: 'chest', label: 'Chest', hint: 'Circumference at fullest point', defaultValue: 40, unit: 'inches' },
      { key: 'waist', label: 'Waist', hint: 'Natural waistline button stance', defaultValue: 34.5, unit: 'inches' },
      { key: 'shoulder', label: 'Shoulder Width', hint: 'Point to point across yoke', defaultValue: 18, unit: 'inches' },
      { key: 'sleeve', label: 'Sleeve Length', hint: 'Shoulder seam to cuff end', defaultValue: 24.75, unit: 'inches' },
      { key: 'jacket_length', label: 'Blazer Length', hint: 'Center back length', defaultValue: 29, unit: 'inches' },
      { key: 'armhole', label: 'Armhole Circumference', hint: 'Comfortable high armscye', defaultValue: 19.5, unit: 'inches' },
      { key: 'bicep', label: 'Bicep', hint: 'Fullest bicep girth', defaultValue: 14.25, unit: 'inches' },
    ],
    styleOptions: {
      lapels: ['Notch Lapel', 'Peak Lapel', 'Casual Casual Notch'],
      vents: ['Double Side Vents', 'Single Center Vent'],
      pockets: ['Patch Pockets (Neapolitan)', 'Flap Pockets', 'Slanted Hacking Pockets'],
      buttons: ['Horn Buttons', 'Mother of Pearl', 'Gilded Metal Blazer Buttons'],
    },
  },
  shirt: {
    category: 'shirt',
    label: 'Custom Tailored Shirt',
    description: 'Dress shirts, linen casuals, tuxedo wing-collars and band collars',
    typicalMetersRequired: 1.6,
    fields: [
      { key: 'collar_neck', label: 'Neck / Collar', hint: 'Around base of neck + 1 finger comfort', defaultValue: 15.75, unit: 'inches' },
      { key: 'chest', label: 'Chest', hint: 'Measured under armpits', defaultValue: 41, unit: 'inches' },
      { key: 'waist', label: 'Shirt Waist (Midsection)', hint: 'Over navel / belt level', defaultValue: 35.5, unit: 'inches' },
      { key: 'hip', label: 'Shirt Bottom / Hip', hint: 'Around hips where shirt ends', defaultValue: 40, unit: 'inches' },
      { key: 'shoulder', label: 'Shoulder (Yoke Width)', hint: 'Across shoulders bone to bone', defaultValue: 18.5, unit: 'inches' },
      { key: 'sleeve_length', label: 'Sleeve Length', hint: 'Center of neck across shoulder to wrist', defaultValue: 33.5, unit: 'inches' },
      { key: 'bicep', label: 'Bicep', hint: 'Upper arm width', defaultValue: 14.5, unit: 'inches' },
      { key: 'cuff_right', label: 'Right Cuff', hint: 'Snug wrist + 2 inches', defaultValue: 9.25, unit: 'inches' },
      { key: 'cuff_left', label: 'Left Cuff (Watch Allowance)', hint: 'Wrist + 2.75 inches for wristwatch', defaultValue: 9.75, unit: 'inches' },
      { key: 'shirt_length', label: 'Shirt Length', hint: 'Base of back collar to bottom curve', defaultValue: 31, unit: 'inches' },
    ],
    styleOptions: {
      collars: ['Cutaway / Semi-Spread (Classic)', 'Full English Spread', 'Button-Down Collar', 'Band / Mandarin Collar', 'Tuxedo Wingtip'],
      cuffs: ['Single Button Barrel (Rounded)', 'Double French Cuff (For Cufflinks)', 'Two-Button Mitred', 'Neapolitan Turnback'],
      pockets: ['No Pocket (Clean Formal)', 'Classic Left Breast Pocket', 'Flap Pocket with Button'],
      buttons: ['Mother of Pearl (Austrian)', 'Trocas Shell', 'High-Density Resin', 'Concealed Fly Front Placket'],
    },
  },
  trouser: {
    category: 'trouser',
    label: 'Custom Trousers & Chinos',
    description: 'Formal dress trousers, gurkha waistbands, pleated & flat fronts',
    typicalMetersRequired: 1.3,
    fields: [
      { key: 'waist', label: 'Waistband', hint: 'Actual wearing point', defaultValue: 34, unit: 'inches' },
      { key: 'hip', label: 'Seat / Hip', hint: 'Widest circumference around buttocks', defaultValue: 41, unit: 'inches' },
      { key: 'front_rise', label: 'Front Rise', hint: 'Crotch seam up to front waistband', defaultValue: 11, unit: 'inches' },
      { key: 'back_rise', label: 'Back Rise', hint: 'Crotch seam up to rear waistband', defaultValue: 15.5, unit: 'inches' },
      { key: 'inseam', label: 'Inseam Length', hint: 'Inner crotch to ankle break', defaultValue: 30.5, unit: 'inches' },
      { key: 'outseam', label: 'Total Outseam', hint: 'Waistband to cuff bottom', defaultValue: 41, unit: 'inches' },
      { key: 'thigh', label: 'Thigh (Fullest)', hint: 'Widest part of upper leg', defaultValue: 25, unit: 'inches' },
      { key: 'knee', label: 'Knee Width', hint: 'Circumference at midpoint of knee', defaultValue: 18.5, unit: 'inches' },
      { key: 'leg_opening', label: 'Leg Opening / Bottom', hint: 'Trouser hem width', defaultValue: 15, unit: 'inches' },
    ],
    styleOptions: {
      collars: [],
      pockets: ['Slanted Side Pockets', 'Vertical Seam Pockets', 'Frogmouth / Western Pockets'],
      vents: ['Double Forward Pleats', 'Single Reverse Pleat', 'Flat Front (No Pleat)', 'Gurkha Extended Tab Waistband'],
      linings: ['Lined to Knee', 'Unlined Lightweight', 'Lined Full Leg'],
      buttons: ['Horn Side Adjusters', 'Belt Loops', 'Braces / Suspender Buttons Inside'],
    },
  },
  kurta: {
    category: 'kurta',
    label: 'Bespoke Kurta & Sherwani',
    description: 'Traditional and festive ethnic attire with custom neckline embroidery',
    typicalMetersRequired: 2.75,
    fields: [
      { key: 'chest', label: 'Chest Circumference', hint: 'Comfortable over body', defaultValue: 41, unit: 'inches' },
      { key: 'waist', label: 'Stomach / Waist', hint: 'Around belly level', defaultValue: 36, unit: 'inches' },
      { key: 'hip', label: 'Hip / Chaak Opening', hint: 'Where side slit starts', defaultValue: 42, unit: 'inches' },
      { key: 'shoulder', label: 'Shoulder', hint: 'Shoulder tip to tip', defaultValue: 18.5, unit: 'inches' },
      { key: 'sleeve', label: 'Sleeve Length', hint: 'Down to wrist', defaultValue: 25.5, unit: 'inches' },
      { key: 'kurta_length', label: 'Kurta Total Length', hint: 'Nape to below knee or calf', defaultValue: 42, unit: 'inches' },
      { key: 'neck', label: 'Band Collar Neck', hint: 'Neck base comfort', defaultValue: 16, unit: 'inches' },
      { key: 'chaak_length', label: 'Side Slit (Chaak)', hint: 'Length from waist down to hem', defaultValue: 20, unit: 'inches' },
    ],
    styleOptions: {
      collars: ['Mandarin Band Collar', 'High Sherwani Collar', 'Nehru Collar with Slit'],
      pockets: ['Both Sides Internal Pockets', 'Right Side Pocket Only', 'Chest Welt Pocket'],
      buttons: ['Silver Thread Potli Buttons', 'Metal Buttons with Chain', 'Hidden Snap Buttons'],
    },
  },
  ladies_blouse: {
    category: 'ladies_blouse',
    label: 'Couture Saree Blouse',
    description: 'Princess cut, padded cups, boat neck, back dori and custom embroidered designs',
    typicalMetersRequired: 0.9,
    fields: [
      { key: 'bust', label: 'Full Bust', hint: 'Around fullest part of chest with brassiere', defaultValue: 36, unit: 'inches' },
      { key: 'high_bust', label: 'Upper Bust', hint: 'Above bust under armpits', defaultValue: 34.5, unit: 'inches' },
      { key: 'under_bust', label: 'Under Bust (Empire Waist)', hint: 'Directly under breast line', defaultValue: 30, unit: 'inches' },
      { key: 'blouse_waist', label: 'Blouse Hem Waist', hint: 'Where blouse ends on abdomen', defaultValue: 29.5, unit: 'inches' },
      { key: 'blouse_length', label: 'Blouse Length', hint: 'Shoulder nape down to desired hem', defaultValue: 14.5, unit: 'inches' },
      { key: 'shoulder', label: 'Shoulder Breadth', hint: 'Distance between shoulder joints', defaultValue: 14, unit: 'inches' },
      { key: 'apex_point', label: 'Shoulder to Apex Point', hint: 'Shoulder to center bust point', defaultValue: 10, unit: 'inches' },
      { key: 'armhole', label: 'Armhole', hint: 'Comfortable armhole circumference', defaultValue: 16.5, unit: 'inches' },
      { key: 'sleeve_length', label: 'Sleeve Length', hint: 'Cap, Elbow 10", or Full 21"', defaultValue: 10.5, unit: 'inches' },
      { key: 'sleeve_round', label: 'Sleeve Round / Bicep', hint: 'Circumference at sleeve hem', defaultValue: 11.5, unit: 'inches' },
      { key: 'front_neck_depth', label: 'Front Neck Depth', hint: 'Slanted depth from shoulder down', defaultValue: 7.5, unit: 'inches' },
      { key: 'back_neck_depth', label: 'Back Neck Depth', hint: 'Depth down spine line', defaultValue: 10.5, unit: 'inches' },
    ],
    styleOptions: {
      collars: ['Sweetheart Neck', 'Deep V-Neck', 'Boat Neck', 'Round High Neck', 'Halter Strap'],
      pockets: ['Padded Built-in Cups', 'Non-Padded Fabric Lining', 'Double Cotton Voile Lining'],
      vents: ['Back Hook & Eye', 'Front Hook & Eye', 'Side Concealed YKK Zipper', 'Back Tie Dori & Tassels'],
    },
  },
  ladies_lehenga: {
    category: 'ladies_lehenga',
    label: 'Bridal Lehenga & Gown',
    description: 'Flared bridal skirts, can-can net structure, choli and dupatta detailing',
    typicalMetersRequired: 6.5,
    fields: [
      { key: 'lehenga_waist', label: 'Lehenga Waistband', hint: 'Wearing level above or at navel', defaultValue: 30, unit: 'inches' },
      { key: 'lehenga_hip', label: 'Hip / Upper Thigh', hint: 'For mermaid or kalidar flare balance', defaultValue: 39, unit: 'inches' },
      { key: 'lehenga_length', label: 'Lehenga Length (With Heels)', hint: 'From waistband down to floor including planned heel height', defaultValue: 42.5, unit: 'inches' },
      { key: 'choli_bust', label: 'Choli Top Bust', hint: 'Around bust apex', defaultValue: 35.5, unit: 'inches' },
      { key: 'choli_length', label: 'Choli Top Length', hint: 'Shoulder to crop waist', defaultValue: 14, unit: 'inches' },
      { key: 'flair_circumference', label: 'Estimated Flair Girth', hint: 'Circle hem flare in meters/inches', defaultValue: 180, unit: 'inches' },
    ],
    styleOptions: {
      linings: ['Multi-layer Heavy Can-Can Net', 'Double Satin Lining', 'Soft Raw Silk Lining'],
      vents: ['Drawstring with Handcrafted Latkans', 'Side Zip with Hook', 'Structured Canvas Waistband'],
    },
  },
  ladies_dress: {
    category: 'ladies_dress',
    label: 'Bespoke Dress / Evening Gown',
    description: 'Custom cocktail dresses, formal gowns, and tailored jumpsuits',
    typicalMetersRequired: 3.5,
    fields: [
      { key: 'bust', label: 'Bust', hint: 'Widest bust measurement', defaultValue: 36, unit: 'inches' },
      { key: 'waist', label: 'Natural Waist', hint: 'Narrowest point of waist', defaultValue: 28, unit: 'inches' },
      { key: 'hip', label: 'Full Hip', hint: 'Fullest point around seat', defaultValue: 38.5, unit: 'inches' },
      { key: 'shoulder', label: 'Shoulder Width', hint: 'Across shoulders', defaultValue: 14.5, unit: 'inches' },
      { key: 'sleeve_length', label: 'Sleeve Length', hint: 'Shoulder to hem', defaultValue: 23, unit: 'inches' },
      { key: 'dress_length', label: 'Full Dress Length', hint: 'Shoulder down to floor or knee', defaultValue: 54, unit: 'inches' },
    ],
    styleOptions: {},
  },
  waistcoat: {
    category: 'waistcoat',
    label: 'Bespoke Waistcoat / Vest',
    description: 'Single or double-breasted vest with satin back adjuster',
    typicalMetersRequired: 0.9,
    fields: [
      { key: 'chest', label: 'Chest', hint: 'Snug over dress shirt', defaultValue: 40, unit: 'inches' },
      { key: 'waist', label: 'Vest Waist', hint: 'At natural waistline', defaultValue: 34, unit: 'inches' },
      { key: 'vest_front_length', label: 'Front Point Length', hint: 'Neck base down to longest front point', defaultValue: 24.5, unit: 'inches' },
      { key: 'vest_back_length', label: 'Back Center Length', hint: 'Nape down to trouser waistband', defaultValue: 21, unit: 'inches' },
    ],
    styleOptions: {},
  },
  alteration: {
    category: 'alteration',
    label: 'Alteration & Repair Spec',
    description: 'Length adjustments, waist taper, zip replacement, sleeve taking in',
    typicalMetersRequired: 0,
    fields: [
      { key: 'original_spec', label: 'Original Dimension', hint: 'Current garment measurement', defaultValue: 34, unit: 'inches' },
      { key: 'target_spec', label: 'Target Dimension', hint: 'Required fit measurement', defaultValue: 32, unit: 'inches' },
      { key: 'delta_adjustment', label: 'Net Take-In / Let-Out', hint: '+/- difference in inches', defaultValue: -2, unit: 'inches' },
    ],
    styleOptions: {},
  },
};
