import { MongoClient, ObjectId } from 'mongodb';

let cachedClient = null;

async function connectToDatabase() {
  if (!cachedClient || !cachedClient.topology?.isConnected?.()) {
    const client = new MongoClient(process.env.MONGODB_URI);
    cachedClient = await client.connect();
  }
  return cachedClient.db(process.env.MONGODB_DB_NAME);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return new Response(JSON.stringify({ error: 'Order ID is required' }), {
        status: 400,
      });
    }

    const db = await connectToDatabase();
    const ordersCollection = db.collection('orders');

    const query = ObjectId.isValid(orderId)
      ? { _id: new ObjectId(orderId) }
      : { orderId };

    const order = await ordersCollection.findOne(query);

    if (!order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
      });
    }

    const mapHtml = order.embeddedMap || '';

    return new Response(JSON.stringify({ order, mapHtml }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ API error in getOrder:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message
    }), { status: 500 });
  }
}
