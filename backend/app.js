const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const { verifyToken } = require("./validation");
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const swaggerDefinition = yaml.load('./swagger.yaml') 

require('dotenv-flow').config();

// create out express app
const app = express()

// Handle CORS + middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE"); // If using .fetch and not axios
  res.header("Access-Control-Allow-Headers", "auth-token, Origin, X-Requested-With, Content-Type, Accept");
  next();
})

// database stuff
const uri = "mongodb+srv://fili3886:ynj35ksw@cluster0.f0hl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB connected")
})
.catch(err => console.log(err))


app.use(bodyParser.json())

// routes
app.get("/", (res, req) => {
  res.send("yay home page")
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

const authRoutes = require("./routes/auth");
app.use("/user", authRoutes);

const TodosRoute = require('./routes/Todos');
  app.use('/todos', verifyToken,  TodosRoute)

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Server is running on port:  " + PORT);
});