const verificationCode = () => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiryTime = new Date(Date.now() + 15 * 60 * 1000);

  return { code, expiryTime };
}

export default verificationCode;