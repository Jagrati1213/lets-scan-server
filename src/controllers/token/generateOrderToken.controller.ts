// GENERATE TOKEN & CODE
export const generateOrderTokenAndCode = ({
  tokenLength,
  codeLength,
}: {
  tokenLength: number;
  codeLength: number;
}) => {
  const digits = "0123456789";
  let token = "";
  let verifyCode = "";

  for (let i = 0; i < tokenLength; i++) {
    token += digits.charAt(Math.floor(Math.random() * digits.length));
  }

  for (let i = 0; i < codeLength; i++) {
    verifyCode += digits.charAt(Math.floor(Math.random() * digits.length));
  }

  // Ensure the verifyCode has the correct number of digits by padding if necessary
  verifyCode = verifyCode.padStart(codeLength, "0");

  return { token, verifyCode };
};
