const crypto = require("crypto");

const encrypt = (plainText, password) => {
  try {
    const iv = crypto.randomBytes(16);
    const key = crypto
      .createHash("sha256")
      .update(password)
      .digest("base64")
      .slice(0, 32);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

    let encrypted = cipher.update(plainText);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
  } catch (error) {
    // console.debug(error);
    return false;
  }
};

const decrypt = (encryptedText, password) => {
  try {
    const textParts = encryptedText.split(":");
    const iv = Buffer.from(textParts.shift(), "hex");

    const encryptedData = Buffer.from(textParts.join(":"), "hex");
    const key = crypto
      .createHash("sha256")
      .update(password)
      .digest("base64")
      .slice(0, 32);
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

    const decrypted = decipher.update(encryptedData);
    const decryptedText = Buffer.concat([decrypted, decipher.final()]);
    return decryptedText.toString();
  } catch (error) {
    // console.debug(error);
    return false;
  }
};

module.exports = {
  encrypt,
  decrypt,
};
