import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    brand: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    notes: {
      top: { type: [String], default: [] },
      heart: { type: [String], default: [] },
      base: { type: [String], default: [] }
    },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "EUR" },
    sizeMl: { type: Number, required: true, min: 1 },
    concentration: { type: String, required: true },
    image: {
      url: { type: String, required: true },
      alt: { type: String, required: true }
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const products = [
  {
    name: "Noir Atelier 01",
    slug: "noir-atelier-01",
    brand: "Babani",
    description:
      "A monochrome signature: polished citrus over smoky woods. Crisp, composed, and quietly addictive.",
    notes: {
      top: ["Bergamot", "Black Pepper", "Aldehydes"],
      heart: ["Iris", "Violet Leaf", "Incense"],
      base: ["Cedar", "Amber", "Vetiver"]
    },
    price: 160,
    currency: "EUR",
    sizeMl: 50,
    concentration: "Eau de Parfum",
    image: {
      url: "https://images.unsplash.com/photo-1615634262417-6b0f8fdc7b5f?auto=format&fit=crop&w=1200&q=80",
      alt: "Minimal black perfume bottle"
    },
    isActive: true
  },
  {
    name: "Santal Épure",
    slug: "santal-epure",
    brand: "Babani",
    description:
      "A clean sandalwood study with milky warmth and soft spice. Elegant, smooth, and long-wearing.",
    notes: {
      top: ["Cardamom", "Pear Skin"],
      heart: ["Sandalwood", "White Tea"],
      base: ["Musk", "Cashmere Wood", "Benzoin"]
    },
    price: 185,
    currency: "EUR",
    sizeMl: 50,
    concentration: "Eau de Parfum",
    image: {
      url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80",
      alt: "Luxury fragrance bottle in black and white"
    },
    isActive: true
  },
  {
    name: "Fleur d’Obsidienne",
    slug: "fleur-d-obsidienne",
    brand: "Babani",
    description:
      "A luminous floral shadowed by mineral warmth—petals, skin, and a dark, glassy sheen.",
    notes: {
      top: ["Pink Pepper", "Mandarin"],
      heart: ["Jasmine", "Orange Blossom", "Iris"],
      base: ["Mineral Amber", "Patchouli", "Clean Musk"]
    },
    price: 175,
    currency: "EUR",
    sizeMl: 50,
    concentration: "Eau de Parfum",
    image: {
      url: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80",
      alt: "Elegant perfume bottle"
    },
    isActive: true
  },
  {
    name: "Cuir Blanc",
    slug: "cuir-blanc",
    brand: "Babani",
    description:
      "Soft leather and crisp linens—an understated aura with quiet authority and a modern edge.",
    notes: {
      top: ["Saffron", "Bergamot"],
      heart: ["Suede", "Iris", "Rose"],
      base: ["Leather", "Tonka", "Sandalwood"]
    },
    price: 195,
    currency: "EUR",
    sizeMl: 50,
    concentration: "Extrait de Parfum",
    image: {
      url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80",
      alt: "Perfume bottle on a minimalist surface"
    },
    isActive: true
  },
  {
    name: "Ambre Silencieux",
    slug: "ambre-silencieux",
    brand: "Babani",
    description:
      "Warm amber without sweetness—resin, smoke, and a refined glow that feels tailored.",
    notes: {
      top: ["Bitter Orange", "Clary Sage"],
      heart: ["Labdanum", "Incense"],
      base: ["Amber", "Vanilla Absolute", "Oakmoss"]
    },
    price: 170,
    currency: "EUR",
    sizeMl: 50,
    concentration: "Eau de Parfum",
    image: {
      url: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=1200&q=80",
      alt: "Minimal premium perfume bottle"
    },
    isActive: true
  }
];

async function main() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI (or MONGO_URI). Create a root .env based on .env.example");
  }

  await mongoose.connect(uri);

  await Product.deleteMany({});
  await Product.insertMany(products);

  await mongoose.disconnect();
  console.log(`Seeded ${products.length} products.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
