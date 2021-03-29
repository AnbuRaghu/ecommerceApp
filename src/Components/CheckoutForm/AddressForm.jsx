import React, { useState, useEffect } from "react";
import {
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
} from "@material-ui/core";
import { useForm, FormProvider } from "react-hook-form";
import FormInput from "./CheckOut/CustomTextField";
import { commerce } from "../../lib/commerce";

import { Link } from "react-router-dom";

export default function AddressForm({ checkoutToken, next }) {
  const [shippingCountries, setshippingCountries] = useState([]);
  const [shippingCountry, setshippingCountry] = useState("");
  const [shippingSubdivisions, setshippingSubdivisions] = useState([]);
  const [shippingSubdivision, setshippingSubdivision] = useState("");
  const [shippingOptions, setshippingOptions] = useState([]);
  const [shippingOption, setshippingOption] = useState("");

  // it gives all the methods to run our form
  const methods = useForm();

  const countries = Object.entries(shippingCountries).map(([code, name]) => ({
    id: code,
    label: name,
  }));
  const subdivisions = Object.entries(
    shippingSubdivisions
  ).map(([code, name]) => ({ id: code, label: name }));
  // as it's an Array directly we map through
//   const options = shippingOptions.map((sO) => ({
//     id: sO.id,
//     label: `${sO.description}- (${sO.price.formatted_with_symbol})`,
//   }));

  const fetchShippingCountries = async (checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(
      checkoutTokenId
    );
    setshippingCountries(countries);
    //it gives the countries objréct's 1st key in an array like[Al,AT,BA]
    setshippingCountry(Object.keys(countries)[0]);
  };

  const fetchsubDivisions = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(
      countryCode
    );
    setshippingSubdivisions(subdivisions);
    setshippingSubdivision(Object.keys(subdivisions)[0]);
  };

  const fetchShippingOptions = async (
    checkoutTokenId,
    country,
    stateProvince = null
  ) => {
    const options = await commerce.checkout.getShippingOptions(
      checkoutTokenId,
      { country, region: stateProvince }
    );
    setshippingOptions(options);
    setshippingOption(options[0].id);
  };
  useEffect(() => {
    fetchShippingCountries(checkoutToken.id);
  }, []);

  useEffect(() => {
    if (shippingCountry) fetchsubDivisions(shippingCountry);
  }, [shippingCountry]);

  useEffect(() => {
    if (shippingSubdivision)
      fetchShippingOptions(
        checkoutToken.Id,
        shippingCountry,
        shippingSubdivision
      );
  }, [shippingSubdivision]);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping Address
      </Typography>
      {/* here we spread all methods from useForm() */}
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit((data) =>
            next({
              ...data,
              shippingCountry,
              shippingSubdivision,
              shippingOption,
            })
          )}
        >
          <Grid container spacing={3}>
            <FormInput name="firstName" label="First Name" />
            <FormInput name="lastName" label="Last Name" />
            <FormInput name="address1" label="Address" />
            <FormInput name="email" label="Email" />
            <FormInput name="city" label="City" />
            <FormInput name="zip" label="ZIP/ Postal code" />
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Country</InputLabel>
              <Select
                value={shippingCountry}
                fullWidth
                onChange={(e) => setshippingCountry(e.target.value)}
              >
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Subdivision</InputLabel>
              <Select
                value={shippingSubdivision}
                fullWidth
                onChange={(e) => setshippingSubdivision(e.target.value)}
              >
                {subdivisions.map((subdivision) => (
                  <MenuItem key={subdivision.id} value={subdivision.id}>
                    {subdivision.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Options</InputLabel>
              <Select
                value={shippingOption}
                fullWidth
                onChange={(e) => setshippingOption(e.target.value)}
              >
                {shippingOptions.map((sO) => ({
                 id: sO.id,
                    label: `${sO.description}- (${sO.price.formatted_with_symbol})`,
                        })).map((option)=>(
                            <MenuItem key={option.id} value={option.id}>
                            {option.label}
                          </MenuItem>
                        ))}
                        
                
              </Select>
            </Grid>
          </Grid>
          <br />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button component={Link} to="/cart" variant="outlined">
              Back to Cart
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Next
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
