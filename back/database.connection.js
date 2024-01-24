const mongoose = require('mongoose');

exports.ConnectDb = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://workspaceniket:workspaceniket@cluster0.n89ooxx.mongodb.net/?retryWrites=true&w=majority'
    );
    console.log('conected');
  } catch (error) {
    console.log('Error occoured ', error);
  }
};
