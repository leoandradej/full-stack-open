const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://leoandradej:${password}@cluster0.aaw4vcp.mongodb.net/phonebookApp?appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

const contact = new Contact({
  name: process.argv[3],
  number: process.argv[4],
});

contact.save().then((result) => {
  console.log(`added ${contact.name}, number: ${contact.number} to phonebook`);
  mongoose.connection.close();
});
