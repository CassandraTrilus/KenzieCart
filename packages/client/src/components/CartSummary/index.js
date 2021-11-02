import { useCurrency, useProvideCart } from "hooks";
import React from "react";
import { useState } from "react";
import axios from 'utils/axiosConfig.js'
import {
  Container,
  Row,
  Col,
  InputGroup,
  Button,
  FormControl,
} from "react-bootstrap";
import "./index";

export default function CartSummary({ cartTotal }) {

  const { getPrice } = useCurrency();
  const { applyCoupon, updateCart } = useProvideCart()
  const [promoCode, setPromoCode] = useState("")
  const [promoMessage, setPromoMessage] = useState("")

  const handleInput = (event) => {
    setPromoCode((event.target.value).toUpperCase())
  }

  const handlePromoCode = () => {
    axios.get(`/coupons/verify?code=${promoCode}`).then(
      (res) => {
        applyCoupon(res.data)
        updateCart()
        setPromoMessage(`Promo Code '${res.data.code}' Applied (${res.data.discount*100}% OFF)`)
      },
      (error) => {
        console.log(error)
        applyCoupon({code: "", discount: 0})
        updateCart()
        setPromoMessage(`Invalid Promo Code`)
      }
    );
  }

  return (
    <div className='cart-summary'>
      <Container>
        <Row className='mb-2 summary-item'>
          <Col xs='9'>
            <p className='summary-label'>Free Shipping</p>
          </Col>
          <Col xs='3' className='text-right'>
            <p className='summary-value'>$0</p>
          </Col>
        </Row>
        <Row className='mb-2 summary-item'>
          <Col xs='6'>
            <p className='summary-label'>Total</p>
          </Col>
          <Col xs='3' className='text-right'>
          <p className="summary-value">{getPrice(cartTotal)} <small  className="promo-code-on font-weight-light">{promoMessage}</small></p>
          </Col>
          </Row>
          <Row className="mb-2 summary-item">
            <Col xs="9">
              <InputGroup className="" size="sm">
                <Button variant="outline-primary" id="button-addon1" size="sm" className="w-50 p-0 mr-1 mw-100" onClick={()=> handlePromoCode()}>
                  Enter Promo Code
                </Button>
                <FormControl
                  onChange={handleInput}
                  aria-label="Example text with button addon"
                  aria-describedby="basic-addon1"
                />
              </InputGroup>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
