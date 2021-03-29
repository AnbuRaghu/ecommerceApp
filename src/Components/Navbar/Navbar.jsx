import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  MenuItem,
  Menu,
  Typography,
} from "@material-ui/core";
import { ShoppingCart } from "@material-ui/icons";
//import logo from '../../assets/'
import useStyles from "./styles";
import {Link,useLocation} from 'react-router-dom'

export default function Navbar({totalItems}) {
  const classes = useStyles();
  const location=useLocation()
 
  return (
    <>
      <AppBar position="fixed" className={classes.appBar} color="inherit">
        <Toolbar>
          <Typography  component={Link} to='/' variant="h6" className={classes.title} color="inherit">
            <img
              src="https://th.bing.com/th/id/OIP.1Yn0yuCE34a433wp4d1gEgHaHa?w=193&h=194&c=7&o=5&dpr=1.25&pid=1.7"
              alt="Commerce.js"
              height="25px"
              className={classes.image}
            />
            E-Store
          </Typography>
          <div className={classes.grow} />
           {location.pathname === '/' && (
          <div className={classes.button}>
         
            <IconButton component={Link} to='/cart' aria-label="Show Cart Items" color="inherit">
              <Badge badgeContent={totalItems} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
        
          </div>  )}
        </Toolbar>
      </AppBar>
    </>
  );
}
