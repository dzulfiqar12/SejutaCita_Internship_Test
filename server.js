const dotenv = require('dotenv');
dotenv.config({ path: `./config.env` });
const app = require('./app');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

//Connect to database
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('DB connection succesful!!');
  })
  .catch((err) => {
    console.log('DB connection failed!!');
  });

//Setting listener for app
app.listen(port, () => {
  console.log(`App running in port ${port} ...`);
});
