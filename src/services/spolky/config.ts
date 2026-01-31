export type AssociationProfile = {
  id: string;
  name: string;
  websiteUrl: string;
  facultyIds: string[];
};

export const ASSOCIATION_PROFILES: Record<string, AssociationProfile> = {
  supef: {
    id: 'supef',
    name: 'SUPEF',
    websiteUrl: 'https://supef.cz',
    facultyIds: ['PEF'],
  },
  esn: {
    id: 'esn',
    name: 'ESN Mendelu',
    websiteUrl: 'https://esn.mendelu.cz',
    facultyIds: [], 
  },
  au_frrms: {
    id: 'au_frrms',
    name: 'AU FRRMS',
    websiteUrl: 'https://au.mendelu.cz',
    facultyIds: ['FRRMS'],
  },
  af: {
    id: 'af',
    name: 'AF Spolek',
    websiteUrl: 'https://af.mendelu.cz',
    facultyIds: ['AF'],
  },
  zf: {
    id: 'zf',
    name: 'ZF Spolek',
    websiteUrl: 'https://zf.mendelu.cz',
    facultyIds: ['ZF'],
  },
  ldf: {
    id: 'ldf',
    name: 'LDF Spolek',
    websiteUrl: 'https://ldf.mendelu.cz',
    facultyIds: ['LDF'],
  },
};
