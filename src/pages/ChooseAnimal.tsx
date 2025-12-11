import { AnimalOption } from "../types";

type ChooseAnimalProps = {
  animals: AnimalOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  formatCurrency: (value: number) => string;
};

function ChooseAnimal({
  animals,
  selectedId,
  onSelect,
  formatCurrency
}: ChooseAnimalProps) {
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
              <span className="pill">{formatCurrency(animal.basePrice)}</span>
            </div>
            <p className="muted">{animal.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

export default ChooseAnimal;

