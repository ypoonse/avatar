import { useMemo, useState } from "react";

type Step = "choose" | "customize" | "review";

type AnimalOption = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  accent: string;
  emoji: string;
};

type ColorOption = { id: string; name: string; hex: string };
type PricedOption = { id: string; name: string; priceDelta: number };

type AvatarConfig = {
  color: ColorOption["id"];
  eyes: PricedOption["id"];
  body: PricedOption["id"];
  tail: PricedOption["id"];
  accessory: PricedOption["id"];
};

const animals: AnimalOption[] = [
  {
    id: "fox",
    name: "Arctic Fox",
    description: "Quick, curious, and clever.",
    basePrice: 24,
    accent: "#ff9f43",
    emoji: "🦊"
  },
  {
    id: "bear",
    name: "Forest Bear",
    description: "Steady, calm, and strong.",
    basePrice: 28,
    accent: "#795548",
    emoji: "🐻"
  },
  {
    id: "cat",
    name: "Midnight Cat",
    description: "Agile, playful, and bright-eyed.",
    basePrice: 22,
    accent: "#673ab7",
    emoji: "🐱"
  },
  {
    id: "panda",
    name: "Zen Panda",
    description: "Calm focus with playful spirit.",
    basePrice: 26,
    accent: "#b0bec5",
    emoji: "🐼"
  },
  {
    id: "wolf",
    name: "Lunar Wolf",
    description: "Loyal, swift, and determined.",
    basePrice: 27,
    accent: "#90caf9",
    emoji: "🐺"
  },
  {
    id: "dragon",
    name: "Sky Dragon",
    description: "Majestic, bold, and legendary.",
    basePrice: 32,
    accent: "#ef5350",
    emoji: "🐉"
  }
];

const colorOptions: ColorOption[] = [
  { id: "amber", name: "Amber", hex: "#f6b352" },
  { id: "mint", name: "Mint", hex: "#63d297" },
  { id: "ocean", name: "Ocean", hex: "#4aa3df" },
  { id: "violet", name: "Violet", hex: "#a56bff" }
];

const eyesOptions: PricedOption[] = [
  { id: "bright", name: "Bright", priceDelta: 0 },
  { id: "sleepy", name: "Sleepy", priceDelta: 1 },
  { id: "mischief", name: "Mischief", priceDelta: 2 }
];

const bodyOptions: PricedOption[] = [
  { id: "compact", name: "Compact", priceDelta: 0 },
  { id: "athletic", name: "Athletic", priceDelta: 2 },
  { id: "sleek", name: "Sleek", priceDelta: 1 }
];

const tailOptions: PricedOption[] = [
  { id: "fluffy", name: "Fluffy", priceDelta: 1 },
  { id: "short", name: "Short", priceDelta: 0 },
  { id: "long", name: "Long", priceDelta: 2 }
];

const accessoryOptions: PricedOption[] = [
  { id: "none", name: "None", priceDelta: 0 },
  { id: "scarf", name: "Scarf", priceDelta: 3 },
  { id: "visor", name: "Visor", priceDelta: 4 },
  { id: "backpack", name: "Backpack", priceDelta: 5 }
];

const defaultConfig: AvatarConfig = {
  color: colorOptions[0].id,
  eyes: eyesOptions[0].id,
  body: bodyOptions[0].id,
  tail: tailOptions[0].id,
  accessory: accessoryOptions[0].id
};

const currency = (value: number) => `$${value.toFixed(2)}`;

const findOption = <T extends { id: string }>(list: T[], id: string) =>
  list.find((item) => item.id === id) ?? list[0];

function App() {
  const [step, setStep] = useState<Step>("choose");
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [configByAnimal, setConfigByAnimal] = useState<
    Record<string, AvatarConfig>
  >({});

  const selectedAnimal =
    animals.find((a) => a.id === selectedAnimalId) ?? null;

  const activeConfig =
    (selectedAnimal && configByAnimal[selectedAnimal.id]) || defaultConfig;

  const updateConfig = <K extends keyof AvatarConfig>(
    key: K,
    value: AvatarConfig[K]
  ) => {
    if (!selectedAnimal) return;
    setConfigByAnimal((prev) => ({
      ...prev,
      [selectedAnimal.id]: { ...(prev[selectedAnimal.id] || defaultConfig), [key]: value }
    }));
  };

  const totalPrice = useMemo(() => {
    if (!selectedAnimal) return 0;
    const extras =
      findOption(eyesOptions, activeConfig.eyes).priceDelta +
      findOption(bodyOptions, activeConfig.body).priceDelta +
      findOption(tailOptions, activeConfig.tail).priceDelta +
      findOption(accessoryOptions, activeConfig.accessory).priceDelta;
    return selectedAnimal.basePrice + extras;
  }, [selectedAnimal, activeConfig]);

  const goNext = () => {
    if (step === "choose" && selectedAnimal) setStep("customize");
    else if (step === "customize") setStep("review");
  };

  const goBack = () => {
    if (step === "customize") setStep("choose");
    else if (step === "review") setStep("customize");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Avatar Market</p>
          <h1>Build and preview your creature</h1>
        </div>
        <div className="stepper">
          {(["choose", "customize", "review"] as Step[]).map((item, index) => (
            <div key={item} className="step">
              <div
                className={`step-circle ${
                  step === item ? "active" : index < (["choose","customize","review"] as Step[]).indexOf(step) ? "done" : ""
                }`}
              >
                {index + 1}
              </div>
              <span className="step-label">
                {item === "choose"
                  ? "Choose animal"
                  : item === "customize"
                  ? "Customize"
                  : "Review"}
              </span>
            </div>
          ))}
        </div>
      </header>

      <main className="app-content">
        <section className="panel">
          {step === "choose" && (
            <ChooseAnimal
              animals={animals}
              selectedId={selectedAnimalId}
              onSelect={(id) => setSelectedAnimalId(id)}
            />
          )}

          {step === "customize" && selectedAnimal && (
            <CustomizeAvatar
              config={activeConfig}
              onChange={updateConfig}
              animal={selectedAnimal}
            />
          )}

          {step === "review" && selectedAnimal && (
            <ReviewAvatar
              animal={selectedAnimal}
              config={activeConfig}
              totalPrice={totalPrice}
            />
          )}
        </section>

        <aside className="panel preview-panel">
          <AvatarPreview animal={selectedAnimal} config={activeConfig} />
          <div className="price-card">
            <div>
              <p className="eyebrow">Current price</p>
              <h2 className="price">{currency(totalPrice)}</h2>
            </div>
            <div className="price-breakdown">
              <PriceLine
                label="Base"
                value={selectedAnimal ? selectedAnimal.basePrice : 0}
              />
              <PriceLine
                label="Extras"
                value={
                  totalPrice -
                  (selectedAnimal ? selectedAnimal.basePrice : 0)
                }
              />
            </div>
          </div>
        </aside>
      </main>

      <footer className="app-footer">
        <div className="footer-buttons">
          <button
            className="ghost"
            onClick={goBack}
            disabled={step === "choose"}
          >
            Back
          </button>
          {step !== "review" && (
            <button
              className="primary"
              onClick={goNext}
              disabled={!selectedAnimal}
            >
              {step === "choose" ? "Customize" : "Review"}
            </button>
          )}
          {step === "review" && (
            <button className="success">Buy now</button>
          )}
        </div>
      </footer>
    </div>
  );
}

type ChooseAnimalProps = {
  animals: AnimalOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function ChooseAnimal({ animals, selectedId, onSelect }: ChooseAnimalProps) {
  return (
    <div className="grid">
      {animals.map((animal) => (
        <button
          key={animal.id}
          className={`card ${selectedId === animal.id ? "card-selected" : ""}`}
          onClick={() => onSelect(animal.id)}
        >
          <div className="card-emoji" style={{ background: animal.accent }}>
            <span>{animal.emoji}</span>
          </div>
          <div className="card-body">
            <div className="card-title">
              <h3>{animal.name}</h3>
              <span className="pill">{currency(animal.basePrice)}</span>
            </div>
            <p className="muted">{animal.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

type CustomizeProps = {
  animal: AnimalOption;
  config: AvatarConfig;
  onChange: <K extends keyof AvatarConfig>(
    key: K,
    value: AvatarConfig[K]
  ) => void;
};

function OptionChips<T extends { id: string; name: string } & Partial<PricedOption>>({
  options,
  activeId,
  onSelect
}: {
  options: T[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="chips">
      {options.map((opt) => (
        <button
          key={opt.id}
          className={`chip ${activeId === opt.id ? "chip-active" : ""}`}
          onClick={() => onSelect(opt.id)}
        >
          <span>{opt.name}</span>
          {"priceDelta" in opt && opt.priceDelta !== undefined && opt.priceDelta > 0 && (
            <span className="chip-price">+{currency(opt.priceDelta)}</span>
          )}
        </button>
      ))}
    </div>
  );
}

function CustomizeAvatar({ config, onChange, animal }: CustomizeProps) {
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
        />
      </label>
    </div>
  );
}

type ReviewProps = {
  animal: AnimalOption;
  config: AvatarConfig;
  totalPrice: number;
};

function ReviewAvatar({ animal, config, totalPrice }: ReviewProps) {
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
            <span>{row.price ? `+${currency(row.price)}` : "Included"}</span>
          </div>
        ))}
        <div className="review-row total">
          <span>Total</span>
          <span />
          <strong>{currency(totalPrice)}</strong>
        </div>
      </div>
    </div>
  );
}

type PreviewProps = {
  animal: AnimalOption | null;
  config: AvatarConfig;
};

function AvatarPreview({ animal, config }: PreviewProps) {
  const color = findOption(colorOptions, config.color).hex;
  return (
    <div className="preview-card">
      <p className="eyebrow">Preview</p>
      <div className="avatar-canvas">
        <div
          className="avatar-shape"
          style={{
            background: `radial-gradient(circle at 30% 30%, #fff7, transparent 45%), ${color}`
          }}
        >
          <div className="avatar-face">
            <div className={`eyes eyes-${config.eyes}`} />
            <div className={`mouth mouth-${config.body}`} />
          </div>
          <div className={`tail tail-${config.tail}`} />
          {config.accessory !== "none" && (
            <div className={`accessory accessory-${config.accessory}`} />
          )}
        </div>
      </div>
      <div className="preview-meta">
        <h3>{animal ? animal.name : "Choose an animal"}</h3>
        <p className="muted">
          {animal
            ? "Use the controls to tune colors, features, and accessories."
            : "Pick an animal to begin customizing your avatar."}
        </p>
      </div>
    </div>
  );
}

function PriceLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="price-line">
      <span>{label}</span>
      <span>{currency(value)}</span>
    </div>
  );
}

export default App;

