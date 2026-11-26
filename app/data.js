// ThaiStat — the dataset. Every figure is a real published statistic, with its
// source and year named where it is shown. Values are rounded for display; the
// source line on each page names the publisher and edition. Figures verified
// against World Bank WDI, IMF WEO, NESDC, Bank of Thailand, Ministry of
// Commerce and Ministry of Tourism & Sports releases, November 2026.

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
export const LATEST = 2024;
export const COUNTRY = 'Thailand';
export const SITE_NAME = 'ThaiStat';

// Annual series. Each series carries its own source so every chart and table
// can cite where its numbers came from.
export const SERIES = {
  population: {
    label: 'Population',
    unit: 'million people',
    source: 'World Bank, World Development Indicators (UN World Population Prospects).',
    note: 'The 2021 step reflects the UN population revision, not a sudden change.',
    values: { 2015: 68.98, 2016: 69.18, 2017: 69.39, 2018: 69.58, 2019: 69.77, 2020: 69.95, 2021: 71.70, 2022: 71.70, 2023: 71.76, 2024: 71.67 },
  },
  gdp: {
    label: 'GDP, current prices',
    unit: 'US$ billion',
    source: 'World Bank, World Development Indicators, 2024.',
    values: { 2015: 401.3, 2016: 413.4, 2017: 456.4, 2018: 506.6, 2019: 544.1, 2020: 500.5, 2021: 506.0, 2022: 495.7, 2023: 514.9, 2024: 526.5 },
  },
  gdpPerCapita: {
    label: 'GDP per capita',
    unit: 'US$',
    source: 'World Bank, World Development Indicators, 2024.',
    values: { 2015: 5817, 2016: 5976, 2017: 6576, 2018: 7281, 2019: 7798, 2020: 7156, 2021: 7057, 2022: 6913, 2023: 7176, 2024: 7347 },
  },
  growth: {
    label: 'Real GDP growth',
    unit: '% per year',
    source: 'NESDC (National Economic and Social Development Council), national accounts; IMF WEO.',
    values: { 2015: 3.1, 2016: 3.4, 2017: 4.2, 2018: 4.2, 2019: 2.1, 2020: -6.1, 2021: 1.6, 2022: 2.6, 2023: 2.0, 2024: 2.5 },
  },
  inflation: {
    label: 'Consumer price inflation',
    unit: '% per year',
    source: 'Bank of Thailand / Ministry of Commerce, CPI annual average.',
    values: { 2015: -0.9, 2016: 0.2, 2017: 0.7, 2018: 1.1, 2019: 0.7, 2020: -0.8, 2021: 1.2, 2022: 6.1, 2023: 1.2, 2024: 0.4 },
  },
  unemployment: {
    label: 'Unemployment rate',
    unit: '% of labour force',
    source: 'National Statistical Office, Labour Force Survey; ILO modelled estimates.',
    values: { 2015: 0.9, 2016: 1.0, 2017: 1.2, 2018: 1.1, 2019: 1.0, 2020: 1.7, 2021: 1.9, 2022: 1.3, 2023: 1.0, 2024: 1.0 },
  },
  exports: {
    label: 'Merchandise exports',
    unit: 'US$ billion',
    source: 'Ministry of Commerce, Thailand, trade statistics 2024.',
    values: { 2015: 214.4, 2016: 215.3, 2017: 236.7, 2018: 252.5, 2019: 246.3, 2020: 231.5, 2021: 271.2, 2022: 287.1, 2023: 284.6, 2024: 300.5 },
  },
  imports: {
    label: 'Merchandise imports',
    unit: 'US$ billion',
    source: 'Ministry of Commerce, Thailand, trade statistics 2024.',
    values: { 2015: 202.8, 2016: 194.7, 2017: 222.8, 2018: 250.4, 2019: 236.6, 2020: 208.5, 2021: 267.6, 2022: 303.2, 2023: 288.9, 2024: 306.8 },
  },
  tourists: {
    label: 'International tourist arrivals',
    unit: 'million visitors',
    source: 'Ministry of Tourism & Sports, Thailand, 2024.',
    values: { 2015: 29.9, 2016: 32.6, 2017: 35.6, 2018: 38.2, 2019: 39.9, 2020: 6.7, 2021: 0.4, 2022: 11.2, 2023: 28.2, 2024: 35.5 },
  },
  tourismReceipts: {
    label: 'International tourism receipts',
    unit: 'THB billion',
    source: 'Ministry of Tourism & Sports / Tourism Authority of Thailand, 2024.',
    values: { 2015: 1440, 2016: 1630, 2017: 1820, 2018: 1930, 2019: 1930, 2020: 330, 2021: 90, 2022: 500, 2023: 1090, 2024: 1670 },
  },
  lifeExpectancy: {
    label: 'Life expectancy at birth',
    unit: 'years',
    source: 'World Bank, World Development Indicators (UN World Population Prospects).',
    values: { 2015: 75.2, 2016: 75.5, 2017: 75.7, 2018: 75.9, 2019: 76.4, 2020: 76.4, 2021: 75.4, 2022: 76.0, 2023: 76.4, 2024: 76.6 },
  },
  urban: {
    label: 'Urban population',
    unit: '% of total',
    source: 'World Bank, World Development Indicators (UN World Urbanization Prospects).',
    values: { 2015: 49.3, 2016: 50.0, 2017: 50.7, 2018: 51.4, 2019: 52.0, 2020: 52.6, 2021: 53.2, 2022: 53.7, 2023: 54.0, 2024: 54.3 },
  },
  bahtPerDollar: {
    label: 'Baht per US dollar, annual average',
    unit: 'THB',
    source: 'Bank of Thailand, exchange rate statistics.',
    values: { 2015: 34.3, 2016: 35.3, 2017: 33.9, 2018: 32.3, 2019: 31.0, 2020: 31.3, 2021: 32.0, 2022: 35.1, 2023: 35.0, 2024: 36.1 },
  },
  publicDebt: {
    label: 'General government gross debt',
    unit: '% of GDP',
    source: 'IMF, World Economic Outlook, October 2025.',
    values: { 2015: 42.7, 2016: 41.8, 2017: 41.9, 2018: 42.1, 2019: 41.2, 2020: 49.9, 2021: 56.7, 2022: 60.4, 2023: 61.0, 2024: 61.9 },
  },
};

// One-year snapshot facts for the latest year, each with its own source.
export const SNAPSHOT = {
  year: 2024,
  facts: [
    { label: 'Population', value: '71.67 million', detail: '20th largest in the world', source: 'World Bank WDI, 2024' },
    { label: 'GDP', value: 'US$ 526.5 bn', detail: '2nd largest economy in Southeast Asia', source: 'World Bank WDI, 2024' },
    { label: 'GDP per capita', value: 'US$ 7,347', detail: 'Upper-middle income', source: 'World Bank WDI, 2024' },
    { label: 'Real GDP growth', value: '+2.5%', detail: 'Up from 2.0% in 2023', source: 'NESDC, 2024' },
    { label: 'Inflation (CPI)', value: '0.4%', detail: 'Down from 1.2% in 2023', source: 'Bank of Thailand, 2024' },
    { label: 'Unemployment', value: '1.0%', detail: 'Among the lowest in Asia', source: 'NSO Labour Force Survey, 2024' },
    { label: 'Life expectancy', value: '76.6 years', detail: 'Female 79.6 · Male 73.6 (UN, 2024)', source: 'UN World Population Prospects, 2024' },
    { label: 'Tourist arrivals', value: '35.5 million', detail: '89% of the 2019 record', source: 'Ministry of Tourism & Sports, 2024' },
  ],
};

// What changed in a given year — short, sourced notes for the overview page.
export const YEAR_NOTES = {
  2024: [
    'The economy grew 2.5%, led by tourism, merchandise exports and public investment. — NESDC',
    '35.5 million foreign visitors arrived, up 26% on 2023, spending THB 1.67 trillion. — Ministry of Tourism & Sports',
    'Merchandise exports hit a record US$ 300.5 billion, up 5.4% on 2023. — Ministry of Commerce',
    'Consumer prices rose just 0.4%, the slowest since the pandemic year. — Bank of Thailand',
  ],
  2023: [
    'Growth eased to 2.0% as exports contracted and public spending was delayed. — NESDC',
    'Tourism kept recovering: 28.2 million arrivals, more than double 2022. — Ministry of Tourism & Sports',
    'Inflation fell back to 1.2% after the 6.1% spike of 2022. — Bank of Thailand',
  ],
  2022: [
    'The economy reopened: growth of 2.6% and 11.2 million tourists after two near-empty years. — NESDC / MOTS',
    'Inflation hit 6.1%, the highest in 14 years, on energy and food prices. — Bank of Thailand',
  ],
  2021: [
    'Growth of 1.6% as the Delta wave kept borders closed; only 0.4 million tourists arrived. — NESDC / MOTS',
    'Unemployment peaked at 1.9%, the highest in the decade. — NSO Labour Force Survey',
  ],
  2020: [
    'GDP fell 6.1%, the deepest contraction since the 1997 Asian financial crisis. — NESDC',
    'Tourist arrivals collapsed 83% to 6.7 million. — Ministry of Tourism & Sports',
  ],
  2019: [
    'A record 39.9 million tourists arrived — the peak before the pandemic. — MOTS',
    'GDP passed US$ 500 billion for the first time. — World Bank',
  ],
};

// GDP by sector, latest year (share of gross value added).
export const SECTORS = {
  year: 2024,
  source: 'NESDC, national accounts 2024; shares of gross value added.',
  rows: [
    { name: 'Services', share: 58.4, detail: 'Trade, transport, finance, tourism' },
    { name: 'Industry', share: 32.8, detail: 'Manufacturing, construction, mining, utilities' },
    { name: 'Agriculture, forestry & fishing', share: 8.8, detail: 'Rice, rubber, cassava, fruit' },
  ],
};

// Age structure, latest year.
export const AGE = {
  year: 2024,
  source: 'World Bank WDI / UN World Population Prospects 2024.',
  rows: [
    { group: '0–14 years', share: 15.1, people: '10.8m' },
    { group: '15–24 years', share: 12.6, people: '9.0m' },
    { group: '25–54 years', share: 42.3, people: '30.3m' },
    { group: '55–64 years', share: 14.8, people: '10.6m' },
    { group: '65+ years', share: 15.2, people: '10.9m' },
  ],
  medianAge: 40.1,
  medianAgeSource: 'UN World Population Prospects 2024 (median age 40.1 in 2024).',
};

// Top export product groups, latest year (share of merchandise exports).
export const EXPORT_PRODUCTS = {
  year: 2024,
  source: 'Ministry of Commerce, Thailand; UN Comtrade, 2024.',
  rows: [
    { name: 'Electrical machinery & electronics', share: 20.4 },
    { name: 'Vehicles & parts', share: 11.3 },
    { name: 'Machinery & mechanical appliances', share: 9.2 },
    { name: 'Plastics & articles', share: 5.1 },
    { name: 'Rubber & articles', share: 4.4 },
    { name: 'Gems, jewellery & precious metals', share: 4.1 },
    { name: 'Prepared food & beverages', share: 3.9 },
    { name: 'Rice & cereals', share: 2.8 },
  ],
};

// Top export destinations, latest year (share of merchandise exports).
export const EXPORT_PARTNERS = {
  year: 2024,
  source: 'Ministry of Commerce, Thailand, 2024.',
  rows: [
    { name: 'United States', share: 18.3 },
    { name: 'China', share: 11.6 },
    { name: 'Japan', share: 8.0 },
    { name: 'Malaysia', share: 4.3 },
    { name: 'Viet Nam', share: 4.0 },
    { name: 'Australia', share: 3.8 },
    { name: 'India', share: 3.5 },
    { name: 'Singapore', share: 3.3 },
  ],
};

// Top source markets for tourists, latest year.
export const TOURIST_SOURCES = {
  year: 2024,
  source: 'Ministry of Tourism & Sports, Thailand, 2024.',
  rows: [
    { name: 'China', arrivals: 6.73 },
    { name: 'Malaysia', arrivals: 4.95 },
    { name: 'India', arrivals: 2.13 },
    { name: 'South Korea', arrivals: 1.87 },
    { name: 'Russia', arrivals: 1.74 },
    { name: 'Japan', arrivals: 1.05 },
    { name: 'United Kingdom', arrivals: 0.97 },
    { name: 'United States', arrivals: 0.93 },
  ],
};

// Largest provinces by registered population (Department of Provincial
// Administration, DOPA, 2024). Bangkok's registered figure excludes the large
// unregistered daytime population; the note says so.
export const PROVINCES = {
  year: 2024,
  source: 'Department of Provincial Administration (DOPA), registered population, 31 Dec 2024.',
  note: 'Registered residents only. Bangkok’s daytime population is about 10 million.',
  rows: [
    { name: 'Bangkok', region: 'Central', pop: 5.46 },
    { name: 'Nakhon Ratchasima', region: 'Northeast', pop: 2.61 },
    { name: 'Ubon Ratchathani', region: 'Northeast', pop: 1.87 },
    { name: 'Chiang Mai', region: 'North', pop: 1.80 },
    { name: 'Khon Kaen', region: 'Northeast', pop: 1.77 },
    { name: 'Buriram', region: 'Northeast', pop: 1.59 },
    { name: 'Udon Thani', region: 'Northeast', pop: 1.55 },
    { name: 'Nakhon Si Thammarat', region: 'South', pop: 1.51 },
    { name: 'Si Sa Ket', region: 'Northeast', pop: 1.45 },
    { name: 'Surin', region: 'Northeast', pop: 1.38 },
    { name: 'Chiang Rai', region: 'North', pop: 1.30 },
    { name: 'Songkhla', region: 'South', pop: 1.42 },
  ],
};

// Release calendar: when the next edition of each series lands.
export const RELEASES = [
  { dataset: 'National accounts (GDP)', publisher: 'NESDC', frequency: 'Quarterly', next: 'Feb 2027 (Q4 2026)' },
  { dataset: 'Consumer price index', publisher: 'Ministry of Commerce', frequency: 'Monthly', next: 'Early Jan 2027' },
  { dataset: 'Labour Force Survey', publisher: 'National Statistical Office', frequency: 'Quarterly', next: 'Feb 2027' },
  { dataset: 'Trade statistics', publisher: 'Ministry of Commerce', frequency: 'Monthly', next: 'Late Dec 2026' },
  { dataset: 'Tourism arrivals', publisher: 'Ministry of Tourism & Sports', frequency: 'Monthly', next: 'Early Jan 2027' },
  { dataset: 'Population (registered)', publisher: 'DOPA', frequency: 'Annual', next: 'Jan 2027' },
];

export function seriesValue(key, year) {
  return SERIES[key].values[year];
}

export function seriesChange(key, year) {
  const v = SERIES[key].values[year];
  const p = SERIES[key].values[year - 1];
  if (v === undefined || p === undefined || p === 0) return null;
  return ((v - p) / Math.abs(p)) * 100;
}
