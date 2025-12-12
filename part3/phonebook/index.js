require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Contact = require("./models/contact");

const app = express();

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(express.static("dist"));
app.use(express.json());

app.get("/api/persons", (request, response) => {
  Contact.find({}).then((contacts) => {
    response.json(contacts);
  });
});

app.get("/info", (request, response) => {
  Contact.countDocuments({}).then((count) => {
    response.send(
      `<p>Phonebook has info for ${count} people</p>
      <p>${Date()}</p>`
    );
  });
});

app.get("/api/persons/:id", (request, response) => {
  Contact.findById(request.params.id)
    .then((contact) => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(400).send({ error: "malformatted id" });
    });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact
    .save()
    .then((savedContact) => {
      response.json(savedContact);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
      } else if (error.code === 11000) {
        // Duplicate key error
        return response.status(400).json({
          error: "Name must be unique",
        });
      }
      response.status(500).json({ error: "Something went wrong" });
    });
});

app.put("/api/persons/:id", (request, response) => {
  const { number } = request.body;

  Contact.findByIdAndUpdate(
    request.params.id,
    { number },
    { new: true, runValidators: true }
  )
    .then((updatedContact) => {
      if (updatedContact) {
        response.json(updatedContact);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
      } else if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
      }
      response.status(500).json({ error: "something went wrong" });
    });
});

app.delete("/api/persons/:id", (request, response) => {
  Contact.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      console.log(error);
      response.status(400).send({ error: "malformatted id" });
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
