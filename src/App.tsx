import { useMemo, useState } from "react";
import ChooseAnimal from "./pages/ChooseAnimal";
import CustomizeAvatar from "./pages/CustomizeAvatar";
import ReviewAvatar from "./pages/ReviewAvatar";
import {
  AnimalOption,
  AvatarConfig,
  ColorOption,
  PricedOption
} from "./types";

type Step = "choose" | "customize" | "review";

const animals: AnimalOption[] = [
  {
    id: "fox",
    name: "Arctic Fox",
    description: "Quick, curious, and clever.",
    basePrice: 240,
    accent: "#ff9f43",
    emoji: "🦊"
  },
  {
    id: "bear",
    name: "Forest Bear",
    description: "Steady, calm, and strong.",
    basePrice: 280,
    accent: "#795548",
    emoji: "🐻"
  },
  {
    id: "cat",
    name: "Midnight Cat",
    description: "Agile, playful, and bright-eyed.",
    basePrice: 220,
    accent: "#673ab7",
    emoji: "🐱"
  },
  {
    id: "panda",
    name: "Zen Panda",
    description: "Calm focus with playful spirit.",
    basePrice: 260,
    accent: "#b0bec5",
    emoji: "🐼"
  },
  {
    id: "wolf",
    name: "Lunar Wolf",
    description: "Loyal, swift, and determined.",
    basePrice: 270,
    accent: "#90caf9",
    emoji: "🐺"
  },
  {
    id: "dragon",
    name: "Sky Dragon",
    description: "Majestic, bold, and legendary.",
    basePrice: 320,
    accent: "#ef5350",
    emoji: "🐉"
  },
  {
    id: "otter",
    name: "River Otter",
    description: "Playful, curious, and always exploring.",
    basePrice: 230,
    accent: "#7dcfb6",
    emoji: "🦦"
  },
  {
    id: "owl",
    name: "Night Owl",
    description: "Wise, watchful, and serene.",
    basePrice: 250,
    accent: "#c5cae9",
    emoji: "🦉"
  },
  {
    id: "tiger",
    name: "Ember Tiger",
    description: "Fierce focus with fiery energy.",
    basePrice: 300,
    accent: "#ff7043",
    emoji: "🐯"
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
  { id: "sleepy", name: "Sleepy", priceDelta: 10 },
  { id: "mischief", name: "Mischief", priceDelta: 20 }
];

const bodyOptions: PricedOption[] = [
  { id: "compact", name: "Compact", priceDelta: 0 },
  { id: "athletic", name: "Athletic", priceDelta: 20 },
  { id: "sleek", name: "Sleek", priceDelta: 10 }
];

const tailOptions: PricedOption[] = [
  { id: "fluffy", name: "Fluffy", priceDelta: 10 },
  { id: "short", name: "Short", priceDelta: 0 },
  { id: "long", name: "Long", priceDelta: 20 }
];

const accessoryOptions: PricedOption[] = [
  { id: "none", name: "None", priceDelta: 0 },
  { id: "scarf", name: "Scarf", priceDelta: 30 },
  { id: "visor", name: "Visor", priceDelta: 40 },
  { id: "backpack", name: "Backpack", priceDelta: 50 }
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const handleBuyNow = () => {
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    // Reset application state
    setStep("choose");
    setSelectedAnimalId(null);
    setConfigByAnimal({});
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
              formatCurrency={currency}
            />
          )}

          {step === "customize" && selectedAnimal && (
            <CustomizeAvatar
              config={activeConfig}
              onChange={updateConfig}
              animal={selectedAnimal}
              colorOptions={colorOptions}
              eyesOptions={eyesOptions}
              bodyOptions={bodyOptions}
              tailOptions={tailOptions}
              accessoryOptions={accessoryOptions}
              formatCurrency={currency}
            />
          )}

          {step === "review" && selectedAnimal && (
            <ReviewAvatar
              animal={selectedAnimal}
              config={activeConfig}
              totalPrice={totalPrice}
              eyesOptions={eyesOptions}
              bodyOptions={bodyOptions}
              tailOptions={tailOptions}
              accessoryOptions={accessoryOptions}
              formatCurrency={currency}
              findOption={findOption}
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
            <button className="success" onClick={handleBuyNow}>Buy now</button>
          )}
        </div>
      </footer>

      {showSuccessModal && (
        <SuccessModal onClose={handleCloseModal} />
      )}
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

type SuccessModalProps = {
  onClose: () => void;
};

function SuccessModal({ onClose }: SuccessModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="success-check">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="60" cy="60" r="60" fill="#34d399" />
            <path
              d="M35 60 L52 77 L85 44"
              stroke="#0b1225"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2>Purchase Complete!</h2>
        <p className="muted">Your avatar has been purchased successfully.</p>
        <button className="primary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default App;

