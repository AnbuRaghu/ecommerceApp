import Commerce from "@chec/commerce.js";

// we should create the instance of Commerce
//1st params accepts public key of commerce.js

export const commerce = new Commerce(
  "pk_242014231ccce2c3ea6aec96763e0e83bbbf81163bbd9",
  true
);
// true means it'going to create a new commerce store
