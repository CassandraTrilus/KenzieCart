import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, Badge, Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons/faShoppingBag";
import { useUI, useProvideCart, useCurrency } from "hooks";
import CartSidebar from "components/CartSidebar";
export default function Header() {
  const { openSidebar } = useUI();
  const { toggleCurrency, currencyState } = useCurrency()
  const { state } = useProvideCart();

  const handleCurrencyState = (currencySymbol) => {
    toggleCurrency(currencySymbol)
  }

  return (
    <>
      <CartSidebar />
      <Navbar expand="lg" style={{ backgroundColor: "#1D3868" }}>
        <Navbar.Brand>
          <LinkContainer to={"/"}>
            <Nav.Link>
              <img src="/logo.png" alt="logo" width="142px" />
            </Nav.Link>
          </LinkContainer>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto mr-5" style={{ justifyContent: "center" }}>
            <LinkContainer
              className="d-flex align-items-center mr-0"
              to={`/`}
              style={{ color: "white", marginRight: "20px" }}
            >
              <Nav.Link>Shop</Nav.Link>
            </LinkContainer>
            <DropdownButton
              id="dropdown-basic-button"
              title={`Currency (${currencyState.currencySymbol})`}
              className="p-0 d-flex align-items-lg-center mr-1 ml-1"
              size="sm"
            >
              <Dropdown.Item href="#/action-1" onClick={()=>handleCurrencyState('€')}>EURO (€)</Dropdown.Item>
              <Dropdown.Item href="#/action-2" onClick={()=>handleCurrencyState('$')}>USD ($)</Dropdown.Item>
            </DropdownButton>
            <div
              className="d-flex align-items-center ml-1"
              onClick={openSidebar}
              style={{ color: "white", cursor: "pointer", marginRight: "20px" }}
            >
              Cart
              <FontAwesomeIcon
                className="ml-2 mb-1"
                icon={faShoppingBag}
                style={{ color: "white" }}
              />
              {state.itemCount > 0 && (
                <Badge pill variant="primary" className="mb-4 mr-2">
                  <p className="mb-0">{state.itemCount}</p>
                </Badge>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}