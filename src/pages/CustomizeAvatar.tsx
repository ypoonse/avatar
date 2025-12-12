import {
  AnimalOption,
  AvatarConfig,
  ColorOption,
  PricedOption
} from "../types";

type CustomizeProps = {
  animal: AnimalOption;
  config: AvatarConfig;
  onChange: <K extends keyof AvatarConfig>(
    key: K,
    value: AvatarConfig[K]
  ) => void;
  colorOptions: ColorOption[];
  eyesOptions: PricedOption[];
  bodyOptions: PricedOption[];
  tailOptions: PricedOption[];
  accessoryOptions: PricedOption[];
  formatCurrency: (value: number) => string;
};

type OptionChipProps<
  T extends { id: string; name: string } & Partial<PricedOption>
> = {
  options: T[];
  activeId: string;
  onSelect: (id: string) => void;
  formatCurrency: (value: number) => string;
};

function OptionChips<T extends { id: string; name: string } & Partial<PricedOption>>({
  options,
  activeId,
  onSelect,
  formatCurrency
}: OptionChipProps<T>) {
  const activeIndex = Math.max(
    0,
    options.findIndex((opt) => opt.id === activeId)
  );
  const goToIndex = (index: number) => {
    const next = options[(index + options.length) % options.length];
    onSelect(next.id);
  };
  const current = options[activeIndex];
  const priceText =
    "priceDelta" in current && current.priceDelta
      ? `+${formatCurrency(current.priceDelta)}`
      : "Included";

  return (
    <div className="carousel">
      <button
        className="carousel-btn"
        aria-label="Previous option"
        onClick={() => goToIndex(activeIndex - 1)}
      >
        ‹
      </button>

      <div className="carousel-body">
        <p className="eyebrow small">Selected</p>
        <div className="carousel-name">{current.name}</div>
        <span className="carousel-price">{priceText}</span>
      </div>

      <button
        className="carousel-btn"
        aria-label="Next option"
        onClick={() => goToIndex(activeIndex + 1)}
      >
        ›
      </button>
    </div>
  );
}

function CustomizeAvatar({
  config,
  onChange,
  animal,
  colorOptions,
  eyesOptions,
  bodyOptions,
  tailOptions,
  accessoryOptions,
  formatCurrency
}: CustomizeProps) {
  return (
    <div className="form">
      <p className="eyebrow">Configuring</p>
      <h2>{animal.name}</h2>

      <label className="field">
        <div className="field-head">
          <span>Color</span>
        </div>
        <div className="swatches">
          {colorOptions.map((color) => (
            <button
              key={color.id}
              className={`swatch ${
                config.color === color.id ? "swatch-active" : ""
              }`}
              style={{ background: color.hex }}
              onClick={() => onChange("color", color.id)}
              title={color.name}
            />
          ))}
        </div>
      </label>

      <label className="field">
        <div className="field-head">
          <span>Eyes</span>
        </div>
        <OptionChips
          options={eyesOptions}
          activeId={config.eyes}
          onSelect={(id) => onChange("eyes", id)}
          formatCurrency={formatCurrency}
        />
      </label>

      <label className="field">
        <div className="field-head">
          <span>Body</span>
        </div>
        <OptionChips
          options={bodyOptions}
          activeId={config.body}
          onSelect={(id) => onChange("body", id)}
          formatCurrency={formatCurrency}
        />
      </label>

      <label className="field">
        <div className="field-head">
          <span>Tail</span>
        </div>
        <OptionChips
          options={tailOptions}
          activeId={config.tail}
          onSelect={(id) => onChange("tail", id)}
          formatCurrency={formatCurrency}
        />
      </label>

      <label className="field">
        <div className="field-head">
          <span>Accessory</span>
        </div>
        <OptionChips
          options={accessoryOptions}
          activeId={config.accessory}
          onSelect={(id) => onChange("accessory", id)}
          formatCurrency={formatCurrency}
        />
      </label>
    </div>
  );
}

export default CustomizeAvatar;

