const express = require('express');
const speakeasy = require('speakeasy');
const uuid = require('uuid');

const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');

const app = express();

const db = new JsonDB(new Config('2faDB', true, false, '/'));

// Test route
app.get('/api', (req, res) => res.json({message: "2fa authentication"}));

// Register user & create temp secret
app.post('/api/register', (req, res) => {
  const id = uuid.v4();

  try {
    const path = `/user/${id}`;
    const tempSecret = speakeasy.generateSecret();
    db.push(path, { id, tempSecret });
    res.json({id, secret: tempSecret.base32 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating document in database" });
    
  }
});




const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))