import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
const PORT = 5000;

const uri = "mongodb+srv://shivanya:shivanya@cluster0.jmo3kn5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
let db;

app.use(cors());
app.use(bodyParser.json());

async function connectDB() {
  try {
    await client.connect();
    db = client.db('shivanya'); // your DB name
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

connectDB();

// Signup route (unchanged)
app.post('/signup', async (req, res) => {
  try {
    const { username, password, isAdmin = false } = req.body;
    const users = db.collection('users');
    const existing = await users.findOne({ username });
    if (existing) return res.status(400).json({ success: false, error: 'User already exists' });

    await users.insertOne({ username, password, isAdmin }); // TODO: hash passwords in production
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Login route (unchanged)
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = db.collection('users');
    const user = await users.findOne({ username, password });
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    res.json({ success: true, user: { username: user.username, isAdmin: user.isAdmin || false } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Middleware to check admin - example usage (unchanged)
function requireAdmin(req, res, next) {
  const isAdmin = req.headers['x-admin'] === 'true';
  if (!isAdmin) return res.status(403).json({ success: false, error: 'Admin access required' });
  next();
}

// Admin route example (unchanged)
app.get('/admin/users', requireAdmin, async (req, res) => {
  try {
    const users = await db.collection('users').find().toArray();
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// New Route: Add Customer
app.post('/customers', async (req, res) => {
  try {
    const {
      name,
      village,
      fathersName,
      address,
      villageName,
      district,
      postOffice,
      policeStation,
      pincode,
      phone,
      pan,
      aadhar,
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, error: 'Name and phone are required.' });
    }

    const customers = db.collection('customers');

    // Insert document
    const result = await customers.insertOne({
      name,
      village,
      fathersName,
      address,
      villageName,
      district,
      postOffice,
      policeStation,
      pincode,
      phone,
      pan,
      aadhar,
      createdAt: new Date()
    });

    // Fetch the inserted customer document back (including _id)
    const insertedCustomer = await customers.findOne({ _id: result.insertedId });

    // Convert _id to string for easier frontend use
    insertedCustomer._id = insertedCustomer._id.toString();

    // Send back full customer data
    res.json({ success: true, customer: insertedCustomer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


app.get('/customers', async (req, res) => {
  try {
    const customers = db.collection('customers');
    const allCustomers = await customers.find().toArray();
    res.json({ success: true, customers: allCustomers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


app.post('/customers/:id/challan', async (req, res) => {
  try {
    const customerId = req.params.id;

    const {
      challanNo,
      modelno,
      DTO,
      ONE,
      color,
      productNo,
      frameNo,
      engineNo,
      bookNo,
      vehicleNo,
      cylinderNo,
      motorNo,
      tools,
      rear,
      tyre,
      mirror,
      front,
      keyNo,
      batteryNo
    } = req.body;

    if (!challanNo || !vehicleNo) {
      return res.status(400).json({ success: false, error: 'Challan number and vehicle number are required.' });
    }

    const customers = db.collection('customers');

    // Check if customer exists
    const customer = await customers.findOne({ _id: new ObjectId(customerId) });
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found.' });
    }

    const challan = {
      challanNo,
      modelno,
      DTO,
      ONE,
      color,
      productNo,
      frameNo,
      engineNo,
      bookNo,
      vehicleNo,
      cylinderNo,
      motorNo,
      tools,
      rear,
      tyre,
      mirror,
      front,
      keyNo,
      batteryNo,
      updatedAt: new Date()
    };

    // ✅ Overwrite challan field (single entry)
    const updateResult = await customers.updateOne(
      { _id: new ObjectId(customerId) },
      { $set: { challan } }
    );

    if (updateResult.modifiedCount === 1) {
      const updatedCustomer = await customers.findOne({ _id: new ObjectId(customerId) });
      updatedCustomer._id = updatedCustomer._id.toString();
      res.json({ success: true, customer: updatedCustomer });
    } else {
      res.status(500).json({ success: false, error: 'Failed to update challan.' });
    }

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/customers/:id/agreement', async (req, res) => {
  try {
    const customerId = req.params.id;

    const {
      onroadprice,
      payment,
      loanAmount,
      bpf,
      downpayment,
      dues,
      netprofit,
      margin,
      paymentType,
      paymentDate,
      registrationAmount,
      permit,
      onlinepayment,
      totalPayment,
      remark
    } = req.body;

    // Basic required fields check (adjust as needed)
    if (!payment || !paymentType) {
      return res.status(400).json({ success: false, error: 'Payment and Payment Type are required.' });
    }

    const customers = db.collection('customers');

    // Check if customer exists
    const customer = await customers.findOne({ _id: new ObjectId(customerId) });
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found.' });
    }

    const agreement = {
      onroadprice,
      payment,
      loanAmount,
      bpf,
      downpayment,
      dues,
      netprofit,
      margin,
      paymentType,
      paymentDate,
      registrationAmount,
      permit,
      onlinepayment,
      totalPayment,
      remark: Array.isArray(remark) ? remark : [],
      updatedAt: new Date()
    };

    const updateResult = await customers.updateOne(
      { _id: new ObjectId(customerId) },
      { $set: { agreement } }
    );

    if (updateResult.modifiedCount === 1) {
      const updatedCustomer = await customers.findOne({ _id: new ObjectId(customerId) });
      updatedCustomer._id = updatedCustomer._id.toString();
      res.json({ success: true, customer: updatedCustomer });
    } else {
      res.status(500).json({ success: false, error: 'Failed to update agreement.' });
    }

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
