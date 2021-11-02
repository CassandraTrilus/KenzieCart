import React, { useState } from 'react'
import { Jumbotron, Container } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { CheckoutForm, ErrorBoundary, LoadingSpinner } from 'components'
import { useProvideCart } from 'hooks'
import { createOrder } from 'utils/axiosService'
import { Link } from 'react-router-dom'

const initialState = {
  isSubmitting: false,
  isConfirmed: false,
  errorMessage: null,
}
export default function CheckoutPage(props) {
  const [data, setData] = useState(initialState)
  const { state, resetCart, deleteLocalStorage } = useProvideCart()

  const placeOrder = async (orderFormData) => {
    console.log('handlePlaceOrder', orderFormData)
    let orderData = {
      customerDetails: orderFormData,
      items: state.cart,
      orderTotal: state.cartTotal,
      coupon: state.couponId,
      couponCode: state.promoCode,
      couponDiscount: state.discount
    }
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    })
    try {
      const orderConfirmation = await createOrder(orderData)
      console.log(orderConfirmation)
      toast(`Order #${orderConfirmation.data} Placed Successfully`)
      resetCart()
      setData({
        isSubmitting: false,
        isConfirmed: true,
        errorMessage: null,
      })
    } catch (error) {
      setData({
        ...data,
        isSubmitting: false,
        errorMessage: 'Error Placing Order',
      })
    }
  }

  if (data.isSubmitting) {
    return <LoadingSpinner full />
  }

  return (
    <>
      <Jumbotron
        className='text-info'
        style={{
          backgroundImage: "url('/hero_image.png')",
          backgroundSize: 'cover',
          height: '350px',
          marginTop: '45px',
        }}
      >
        <h1 style={{marginTop: '100px'}}>Thank you!</h1>
      </Jumbotron>
      <ErrorBoundary>
        {data.errorMessage && <p className='form-error'>{data.errorMessage}</p>}
        {state.itemCount && !data.isConfirmed ? (
          <CheckoutForm placeOrder={placeOrder} />
        ) : (
          <Container className='h-50'>
          {data.isConfirmed ? (<div className='row justify-content-center'>
          <p style={{fontSize: '26px', marginBottom: '30px', marginTop: '20px'}}>Your order is confirmed!</p>

              <div className='col-sm-12 d-flex justify-content-center'>
                <p>You'll receive confirmation in your email shortly.</p>
              </div>
              <div className='col-sm-12 d-flex justify-content-center'>
                <Link to='/'>Continue shopping!</Link>
              </div>
            </div>
            ) : ( 
              <div className='row justify-content-center'>
              <div className='col-sm-12 d-flex justify-content-center'>
                <p>Your cart is currently empty.</p>
              </div>
              <div className='col-sm-12 d-flex justify-content-center'>
                <Link to='/'>Continue shopping!</Link>
              </div>
            </div>
            )}
          </Container>
        )}
      </ErrorBoundary>
    </>
  )
}
