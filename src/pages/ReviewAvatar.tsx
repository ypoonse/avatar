import {
  AnimalOption,
  AvatarConfig,
  PricedOption
} from "../types";

type ReviewProps = {
  animal: AnimalOption;
  config: AvatarConfig;
  totalPrice: number;
  eyesOptions: PricedOption[];
  bodyOptions: PricedOption[];
  tailOptions: PricedOption[];
  accessoryOptions: PricedOption[];
  formatCurrency: (value: number) => string;
  findOption: <T extends { id: string }>(list: T[], id: string) => T;
};

function ReviewAvatar({
  animal,
  config,
  totalPrice,
  eyesOptions,
  bodyOptions,
  tailOptions,
  accessoryOptions,
  formatCurrency,
  findOption
}: ReviewProps) {
  const rows = [
    { label: "Animal", value: animal.name, price: animal.basePrice },
    {
      label: "Eyes",
      value: findOption(eyesOptions, config.eyes).name,
      price: findOption(eyesOptions, config.eyes).priceDelta
    },
    {
      label: "Body",
      value: findOption(bodyOptions, config.body).name,
      price: findOption(bodyOptions, config.body).priceDelta
    },
    {
      label: "Tail",
      value: findOption(tailOptions, config.tail).name,
      price: findOption(tailOptions, config.tail).priceDelta
    },
    {
      label: "Accessory",
      value: findOption(accessoryOptions, config.accessory).name,
      price: findOption(accessoryOptions, config.accessory).priceDelta
    }
  ];

  return (
    <div className="review">
      <div>
        <p className="eyebrow">Review</p>
        <h2>Your avatar is ready</h2>
        <p className="muted">
          Check the details below before purchasing.
        </p>
      </div>
      <div className="review-table">
        {rows.map((row) => (
          <div key={row.label} className="review-row">
            <span>{row.label}</span>
            <span className="muted">{row.value}</span>
            <span>{row.price ? `+${formatCurrency(row.price)}` : "Included"}</span>
          </div>
        ))}
        <div className="review-row total">
          <span>Total</span>
          <span />
          <strong>{formatCurrency(totalPrice)}</strong>
        </div>
      </div>
    </div>
  );
}

export default ReviewAvatar;

