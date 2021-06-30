const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 10);

const URLSchema = new mongoose.Schema({
  urlCode: {
    type: String,
    required: true,
  },
  longUrl: {
    type: String,
    required: true,
  },
  // clicks: {
  //   type: Number,
  //   required: true,
  //   default: 0,
  // },
});

URLSchema.pre('validate', function (next) {
  // can't use arrow function, or this will be undefinded. fat arrow is lexically scoped.
  let ctx = this;
  attempToGenerate(ctx, next);
});

function attempToGenerate(ctx, callback) {
  let newCode = nanoid();
  ctx.constructor.findOne({ urlCode: newCode }).then(
    R => {
      if (R) {
        attempToGenerate(ctx, callback);
      } else {
        ctx.urlCode = newCode;
        callback();
      }
    },
    err => {
      callback(err);
    }
  );
}

module.exports = mongoose.model('url', URLSchema);
