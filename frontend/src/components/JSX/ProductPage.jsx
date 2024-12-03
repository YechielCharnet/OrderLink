import React from "react";

const products = [
  {
    id: 1,
    name: "ספר תורה מהודר",
    description: "ספר תורה באיכות גבוהה עם דיו מהודר.",
    price: 50000,
    imageUrl: "/images/seferTorah.png",
  },
  {
    id: 2,
    name: "תפילין רשי",
    description: "תפילין ברמת הידור גבוהה בעבודת יד.",
    price: 1500,
    imageUrl: "/images/tefillin.png",
  },
  {
    id: 3,
    name: "מזוזה מעוצבת",
    description: "קלף כשר למזוזה באורך 10 ס\"מ עם בית מזוזה ייחודי.",
    price: 300,
    imageUrl: "/images/mezuzah.png",
  },
  {
    id: 4,
    name: "מגילה מעוצבת",
    description: "קלף כשר למזוזה באורך 10 ס\"מ עם בית מזוזה ייחודי.",
    price: 300,
    imageUrl: "/images/megilah.png",
  },
];

const ProductPage = () => (
  <div className="product-page">
    <h1>מוצרי סת"ם</h1>
    <div className="products">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <img src={product.imageUrl} alt={product.name} />
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>מחיר: ₪{product.price}</p>
        </div>
      ))}
    </div>
  </div>
);

export default ProductPage;
