/**
 * Generates a random password
 *
 * @param {number} [length] - Length of the Password
 * @default 12
 */
module.exports = (length) => {
  if (!length) length = 12;
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
