export type NormalizedPrice = {
  name: string;           // Strain Name
  breeder?: string;       // optional
  seedbank: string;       // Anbieter
  price: number;          // in EUR
  currency: string;       // "EUR"
};

export type AdapterResult = {
  items: NormalizedPrice[];
  errors: { message: string; context?: any }[];
};