import React, { useState, useEffect } from "react";
// import Products from './Components/Products/Products';
// import Navbar from './Components/Navbar/Navbar'
//insead of above code we can simply use as folows as named import
import { Products, Navbar, Cart, Checkout } from "./Components";

import { commerce } from "./lib/commerce";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [order, setorder] = useState({});
  const [errormsg, setErrormsg] = useState("");

  const fetchProducts = async () => {
    //const response=await commerce.products.list();
    //once we get the response we destructure the data from commerce

    const { data } = await commerce.products.list(); //commercejs api call
    setProducts(data);
  };
  const fetchCart = async () => {
    setCart(await commerce.cart.retrieve());
  };

  const handleAddtoCart = async (productId, quantity) => {
    const { cart } = await commerce.cart.add(productId, quantity);
    setCart(cart);
  };
  const handleUpdataCartQty = async (productId, quantity) => {
    const { cart } = await commerce.cart.update(productId, { quantity });
    setCart(cart);
  };
  const handleRemoveFromCart = async (productId) => {
    const { cart } = await commerce.cart.remove(productId);
    setCart(cart);
  };

  const handleEmptyCart = async () => {
    const { cart } = await commerce.cart.empty();
    setCart(cart);
  };

  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();
    setCart(newCart);
  };

  const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    try {
      const incomingOrder = await commerce.checkout.capture(
        checkoutTokenId,
        newOrder
      );
      setorder(incomingOrder);
      refreshCart();
    } catch (error) {
      setErrormsg(error.data.error.message);
    }
  };
  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  return (
    <Router>
      <div>
        <Navbar totalItems={cart.total_items} />
        <Switch>
          <Route exact path="/">
            <Products products={products} onAddToCart={handleAddtoCart} />
          </Route>
          <Route exact path="/cart">
            <Cart
              cart={cart}
              handleUpdataCartQty={handleUpdataCartQty}
              handleEmptyCart={handleEmptyCart}
              handleRemoveFromCart={handleRemoveFromCart}
            />
          </Route>
          <Route exact path="/checkout">
            <Checkout
              cart={cart}
              order={order}
              onCaptureCheckout={handleCaptureCheckout}
              error={errormsg}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
