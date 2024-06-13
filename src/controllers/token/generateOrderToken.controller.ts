// GENERATE TOKEN & CODE
export const generateOrderTokenAndCode = ({
  tokenLength,
  codeLength,
}: {
  tokenLength: number;
  codeLength: number;
}) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  let verifyCode = "";

  for (let i = 0; i < tokenLength; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  for (let i = 0; i < codeLength; i++) {
    verifyCode += Math.floor(Math.random() * 10);
  }
  return { token, verifyCode };
};
