export type AnimalOption = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  accent: string;
  emoji: string;
};

export type ColorOption = { id: string; name: string; hex: string };

export type PricedOption = { id: string; name: string; priceDelta: number };

export type AvatarConfig = {
  color: ColorOption["id"];
  eyes: PricedOption["id"];
  body: PricedOption["id"];
  tail: PricedOption["id"];
  accessory: PricedOption["id"];
};

