"use client";
import { useState, useEffect ,Suspense} from 'react';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
const  OrderTrackingfunc = () =>{
  const [showReschedule, setShowReschedule] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [mapHtml, setMapHtml] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  // Fetch order details, map, and HTML file from database
 
 useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) {
        setError('Order ID not provided');
        setLoading(false);
        return;
      }

      // console.log('Fetching order with ID:', orderId);

      try {
        // Fetch order details from MongoDB
        const orderResponse = await fetch('/api/getOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId }),
        });

        if (!orderResponse.ok) {
          const errorData = await orderResponse.json();
          throw new Error(errorData.error || 'Failed to fetch order data');
        }

        const orderResult = await orderResponse.json();
        // console.log('Order data received:', orderResult);
        setOrderData(orderResult.order);
        setMapHtml(orderResult.mapHtml || '');


      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);




  // Define delivery steps based on order status
  const getDeliverySteps = (orderStatus) => {
    const allSteps = [
      {
        id: 'confirmed',
        title: 'Order confirmed',
        date: orderData?.placedAt ? new Date(orderData.placedAt).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : 'N/A',
        description: 'Your order has been confirmed and is being prepared',
        completed: true
      },
      {
        id: 'shipped',
        title: 'Package shipped',
        date: orderData?.placedAt ? new Date(new Date(orderData.placedAt).getTime() + 24*60*60*1000).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : 'N/A',
        description: 'Departed from fulfillment center',
        completed: orderStatus !== 'placed'
      },
      {
        id: 'transit',
        title: 'In transit',
        date: orderData?.placedAt ? new Date(new Date(orderData.placedAt).getTime() + 48*60*60*1000).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : 'N/A',
        description: 'Package is traveling to the next facility',
        completed: orderStatus === 'delivered',
        current: orderStatus === 'placed'
      },
      {
        id: 'facility',
        title: 'Package arrived at delivery facility',
        date: orderData?.placedAt ? new Date(new Date(orderData.placedAt).getTime() + 72*60*60*1000).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : 'N/A',
        description: 'Local delivery facility',
        completed: orderStatus === 'delivered'
      },
      {
        id: 'delivery',
        title: 'Out for delivery',
        date: orderData?.placedAt ? new Date(new Date(orderData.placedAt).getTime() + 96*60*60*1000).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : 'N/A',
        description: 'Your package is on the delivery truck',
        completed: orderStatus === 'delivered'
      },
      {
        id: 'delivered',
        title: 'Delivered',
        date: orderStatus === 'delivered' && orderData?.placedAt ? new Date(new Date(orderData.placedAt).getTime() + 120*60*60*1000).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : 'N/A',
        description: 'Package has been delivered successfully',
        completed: orderStatus === 'delivered'
      }
    ];

    // Filter steps based on order status
    if (orderStatus === 'placed') {
      return allSteps.slice(0, 3); // Show only up to "in transit"
    } else if (orderStatus === 'delivered') {
      return allSteps; // Show all steps including delivered
    } else {
      return allSteps.slice(0, 5); // Default case, show up to "out for delivery"
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'placed':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'placed':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      default:
        return 'Processing';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar/>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The order you are looking for does not exist.'}</p>
            <button 
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }

  const deliverySteps = getDeliverySteps(orderData.orderStatus);

  return (
    <>
      <Head>
        <title>Track Package - Order Details</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Navbar/>
        
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <nav className="text-sm">
                <span className="text-blue-600 hover:text-blue-800 cursor-pointer">Your Account</span>
                <span className="mx-2 text-gray-400">›</span>
                <span className="text-blue-600 hover:text-blue-800 cursor-pointer">Your Orders</span>
                <span className="mx-2 text-gray-400">›</span>
                <span className="text-orange-600 font-medium">Order Details</span>
              </nav>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Order Details Header */}
          <div className="bg-white p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-normal text-gray-900 mb-4">Order Details</h1>
                <div className="flex flex-col sm:flex-row sm:gap-8 gap-2">
                  <div>
                    <span className="text-gray-600">Order placed </span>
                    <span className="font-medium">
                      {orderData.placedAt ? new Date(orderData.placedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Order number </span>
                    <span className="font-medium">{orderId}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 font-medium mr-2">Invoice</span>
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Order Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6 border-t border-gray-200">
              {/* Ship to */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Ship to</h3>
                <div className="text-gray-700 space-y-1">
                  {orderData.shippingAddress ? (
                    <>
                      <p>{orderData.shippingAddress.address1 || orderData.shippingAddress.street || 'N/A'}</p>
                      <p>{orderData.shippingAddress.address2 || ''}</p>
                      <p>{orderData.shippingAddress.city || 'N/A'}, {orderData.shippingAddress.state || 'N/A'} {orderData.shippingAddress.zipCode || orderData.shippingAddress.pincode || 'N/A'}</p>
                      <p>{orderData.shippingAddress.country || 'India'}</p>
                    </>
                  ) : (
                    <p>Address information not available</p>
                  )}
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Payment Methods</h3>
                <p className="text-gray-700">
                  {orderData.paymentStatus === 'COD' ? 'Pay on Delivery' : orderData.paymentStatus || 'N/A'}
                </p>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                    <span className="text-gray-900">Grand Total:</span>
                    <span className="text-gray-900">₹{((orderData.totalAmount || 0)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Delivery Status</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(orderData.orderStatus)}`}>
                {getStatusText(orderData.orderStatus)}
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <div className={`rounded-full p-1 mr-3 ${orderData.orderStatus === 'delivered' ? 'bg-green-500' : 'bg-blue-500'}`}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {orderData.orderStatus === 'delivered' 
                      ? 'Package Delivered' 
                      : orderData.orderStatus === 'placed' 
                      ? 'Expected delivery: 3-5 business days' 
                      : 'Expected delivery: Today by 9:00 PM'
                    }
                  </p>
                  <p className="text-gray-600 text-sm">
                    {orderData.orderStatus === 'delivered' 
                      ? 'Your package has been successfully delivered' 
                      : orderData.orderStatus === 'placed' 
                      ? 'Your package is being prepared for shipment' 
                      : 'Your package is out for delivery and will arrive today'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Discount Display Section */}
            {orderData.deliveryOption === 'group' && orderData.discount > 0 && (
            <div className="bg-green-100 border border-green-300 text-green-900 p-4 rounded-md mb-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-1">🎉 Congrats!</h3>
              <p>
                You have saved <span className="font-bold text-green-700">₹{Number(orderData.discount).toFixed(2)}</span> on this group order.
                It has been added to your Amazon Pay Wallet.
              </p>
            </div>
         )}    

          {/* Map Section */}
          {mapHtml && mapHtml.trim() !== "empty" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Map</h2>
              <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200">
                <iframe
                  srcDoc={mapHtml}
                  className="w-full h-full"
                  title="Delivery Map"
                  style={{ border: 'none' }}
                />
              </div>
            </div>
          )}

            {/* Delivery Timeline */}
            <div className="space-y-4">
              {deliverySteps.map((step, index) => (
                <div key={step.id} className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === deliverySteps.length - 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-green-100 text-green-600' 
                    }`}>
                      {index === deliverySteps.length - 1 ? (
                        <div className="w-2 h-2 bg-white rounded-full"></div> 
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{step.title}</p>
                    <p className="text-sm text-gray-600">{step.date}</p>
                    <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Delivery Options */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Options</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setShowReschedule(!showReschedule)}
              >
                <div className="flex items-center">
                  <div className="bg-orange-100 rounded-full p-2 mr-3">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Reschedule Delivery</h3>
                    <p className="text-sm text-gray-600">Choose a different delivery date</p>
                  </div>
                </div>
              </div>
              
              <div 
                className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setShowInstructions(!showInstructions)}
              >
                <div className="flex items-center">
                  <div className="bg-orange-100 rounded-full p-2 mr-3">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Delivery Instructions</h3>
                    <p className="text-sm text-gray-600">Add special delivery notes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section - CONTACT SUPPORT SECTION */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Need help with your order?</h2>
                <p className="text-gray-600">Contact our customer service team</p>
              </div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contact Support
              </button>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </>
  );
}
export default function OrderTrackingf() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      < OrderTrackingfunc/>
    </Suspense>
  );
}