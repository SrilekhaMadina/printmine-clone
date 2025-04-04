import React, { useState, useEffect } from 'react';

const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

function App() {
  const [products, setProducts] = useState(PRODUCTS.map(product => ({ ...product, quantity: 0 })));
  const [cart, setCart] = useState([]);
  const [freeGiftAdded, setFreeGiftAdded] = useState(false);

  useEffect(() => {
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (subtotal >= THRESHOLD && !freeGiftAdded) {
      setCart(prevCart => [...prevCart, { ...FREE_GIFT, quantity: 1 }]);
      setFreeGiftAdded(true);
    } else if (subtotal < THRESHOLD && freeGiftAdded) {
      setCart(prevCart => prevCart.filter(item => item.id !== FREE_GIFT.id));
      setFreeGiftAdded(false);
    }
  }, [cart, freeGiftAdded]);

  const handleAddToCart = (productId) => {
    const productToAdd = products.find(product => product.id === productId);
    if (productToAdd && productToAdd.quantity > 0) {
      const existingCartItemIndex = cart.findIndex(item => item.id === productId);

      if (existingCartItemIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[existingCartItemIndex].quantity += productToAdd.quantity;
        setCart(updatedCart);
      } else {
        setCart([...cart, { ...productToAdd }]);
      }

      // Reset product quantity after adding to cart
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === productId ? { ...product, quantity: 0 } : product
        )
      );
    }
  };

  const handleQuantityChange = (productId, change) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, quantity: Math.max(0, product.quantity + change) } : product
      )
    );
  };

  const handleCartQuantityChange = (productId, change) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(0, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0); // Remove item if quantity is 0
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const remainingAmount = Math.max(0, THRESHOLD - subtotal);

  return (
    <div className="App">
      <h1>Shopping Cart</h1>

      <div className="products">
        <h2>Products</h2>
        {products.map(product => (
          <div key={product.id} className="product">
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <div className="quantity-selector">
              <button onClick={() => handleQuantityChange(product.id, -1)}>-</button>
              <span>{product.quantity}</span>
              <button onClick={() => handleQuantityChange(product.id, 1)}>+</button>
            </div>
            <button onClick={() => handleAddToCart(product.id)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <div className="cart">
        <h2>Cart</h2>
        {subtotal < THRESHOLD && (
          <div className="progress-bar">
            <p>Add ${remainingAmount} more to get a free gift!</p>
          </div>
        )}
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <h3>{item.name}</h3>
                <p>Price: ${item.price}</p>
                <div className="quantity-selector">
                  <button onClick={() => handleCartQuantityChange(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleCartQuantityChange(item.id, 1)}>+</button>
                </div>
                {item.id !== FREE_GIFT.id && (
                  <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
                )}
              </div>
            ))}
            <p>Subtotal: ${subtotal}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;