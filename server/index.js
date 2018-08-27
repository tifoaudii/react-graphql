const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./Schema/schema');
const mongoose = require('mongoose');
const keys = require('./config/keys');

const app = express();

mongoose.connect(keys.mongoURI).catch(err=>console.log(err));

app.use('/graphql',graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(4000, ()=>{
  console.log('running on port 4000')
});