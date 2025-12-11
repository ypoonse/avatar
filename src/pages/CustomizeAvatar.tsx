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

type OptionChipProps<T extends { id: string; name: string } & Partial<PricedOption>> = {
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
  return (
    <div className="chips">
      {options.map((opt) => (
        <button
          key={opt.id}
          className={`chip ${activeId === opt.id ? "chip-active" : ""}`}
          onClick={() => onSelect(opt.id)}
        >
          <span>{opt.name}</span>
          {"priceDelta" in opt &&
            opt.priceDelta !== undefined &&
            opt.priceDelta > 0 && (
              <span className="chip-price">+{formatCurrency(opt.priceDelta)}</span>
            )}
        </button>
      ))}
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

