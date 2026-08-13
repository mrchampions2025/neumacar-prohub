export const CAR_BRANDS = [
  "Abarth", "Alfa Romeo", "Alpine", "Aston Martin", "Audi", "Bentley", 
  "BMW", "BYD", "Chevrolet", "Citroën", "Cupra", "Dacia", "DS", 
  "Ferrari", "Fiat", "Ford", "Honda", "Hyundai", "Jaguar", "Jeep", 
  "Kia", "Lamborghini", "Lancia", "Land Rover", "Lexus", "Maserati", 
  "Mazda", "McLaren", "Mercedes-Benz", "MG", "MINI", "Mitsubishi", 
  "Nissan", "Opel", "Peugeot", "Polestar", "Porsche", "Renault", 
  "Rolls-Royce", "SEAT", "Skoda", "smart", "SsangYong", "Subaru", 
  "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo", "Otro"
];

export const CAR_MODELS: Record<string, string[]> = {
  "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "e-tron", "TT", "R8", "Otro"],
  "BMW": ["Serie 1", "Serie 2", "Serie 3", "Serie 4", "Serie 5", "Serie 6", "Serie 7", "Serie 8", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4", "i3", "i4", "iX", "Otro"],
  "Mercedes-Benz": ["Clase A", "Clase B", "Clase C", "Clase E", "Clase S", "Clase V", "CLA", "CLS", "GLA", "GLB", "GLC", "GLE", "GLS", "EQA", "EQB", "EQC", "EQE", "EQS", "Otro"],
  "Volkswagen": ["Polo", "Golf", "Passat", "Arteon", "T-Cross", "Taigo", "T-Roc", "Tiguan", "Touareg", "ID.3", "ID.4", "ID.5", "Caddy", "California", "Otro"],
  "SEAT": ["Ibiza", "León", "Arona", "Ateca", "Tarraco", "Otro"],
  "Cupra": ["Formentor", "León", "Ateca", "Born", "Tavascan", "Otro"],
  "Renault": ["Clio", "Megane", "Captur", "Arkana", "Austral", "Kangoo", "Zoe", "Otro"],
  "Peugeot": ["208", "308", "508", "2008", "3008", "5008", "Rifter", "Otro"],
  "Citroën": ["C3", "C4", "C5 Aircross", "Berlingo", "Otro"],
  "Toyota": ["Aygo", "Yaris", "Corolla", "C-HR", "RAV4", "Land Cruiser", "Hilux", "Otro"],
  "Ford": ["Fiesta", "Focus", "Mondeo", "Puma", "Kuga", "Mustang", "Transit", "Otro"],
  "Kia": ["Picanto", "Rio", "Ceed", "Stonic", "Niro", "Sportage", "Sorento", "EV6", "Otro"],
  "Hyundai": ["i10", "i20", "i30", "Kona", "Tucson", "Santa Fe", "Ioniq 5", "Otro"],
  "Nissan": ["Micra", "Juke", "Qashqai", "X-Trail", "Leaf", "Otro"],
  "Fiat": ["500", "Panda", "Tipo", "Otro"],
  "Dacia": ["Sandero", "Duster", "Jogger", "Spring", "Otro"],
  "Opel": ["Corsa", "Astra", "Mokka", "Crossland", "Grandland", "Otro"],
  "Volvo": ["XC40", "XC60", "XC90", "V60", "V90", "S60", "S90", "Otro"],
  "Mazda": ["Mazda2", "Mazda3", "Mazda6", "CX-30", "CX-5", "CX-60", "Otro"],
  "Honda": ["Jazz", "Civic", "HR-V", "CR-V", "Otro"],
  "Skoda": ["Fabia", "Scala", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Enyaq", "Otro"],
  "MINI": ["Hatch", "Clubman", "Countryman", "Otro"],
  "Porsche": ["911", "Taycan", "Panamera", "Macan", "Cayenne", "Otro"],
  "Tesla": ["Model 3", "Model Y", "Model S", "Model X", "Otro"],
  "Land Rover": ["Range Rover", "Range Rover Sport", "Range Rover Evoque", "Discovery", "Defender", "Otro"],
  "Jeep": ["Renegade", "Compass", "Wrangler", "Grand Cherokee", "Otro"],
  "Lexus": ["CT", "UX", "NX", "RX", "ES", "Otro"],
  "Suzuki": ["Swift", "Vitara", "S-Cross", "Jimny", "Otro"],
  "MG": ["ZS", "HS", "MG4", "MG5", "Marvel R", "Otro"],
  "BYD": ["Atto 3", "Dolphin", "Seal", "Han", "Tang", "Otro"],
  "Otro": ["Otro"]
};

/**
 * Helper para obtener los modelos, usando "Otro" si la marca no está en el registro principal
 */
export function getModelsForBrand(brand: string): string[] {
  return CAR_MODELS[brand] || ["Otro"];
}
