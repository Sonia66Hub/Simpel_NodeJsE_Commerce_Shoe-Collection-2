const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const socketio = require("socket.io");
const io = socketio(server);
const PORT = 3100;

app.use("/uploads", express.static("uploads"));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static("public"));

// Routes
const homeRoutes = require("./routes/home");
app.use("/", homeRoutes);

const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);

const shopRoutes = require("./routes/shop");
app.use("/shop", shopRoutes);

const cartRoutes = require("./routes/cart");
app.use("/cart", cartRoutes);

const productRoute = require("./routes/product");
app.use("/admin", productRoute);

const searchRoute = require("./routes/search");
app.use("/search", searchRoute);

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("message", (message) => {
    console.log("Received message:", message);
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.get("/product/:id", (req, res) => {
  const productId = req.params.id;

  const productFilePath = path.join(__dirname, "data", "products.json");
  fs.readFile(productFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading product data:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    try {
      const products = JSON.parse(data);

      const product = products.find((product) => product.id === productId);
      if (product) {
        res.render("product_details", { product: product });
      } else {
        res.status(404).send("Product not found");
      }
    } catch (error) {
      console.error("Error parsing product data:", error);
      res.status(500).send("Internal Server Error");
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
