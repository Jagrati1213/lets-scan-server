// GENERATE TOKEN & CODE
export const generateOrderTokenAndCode = ({
  codeLength,
}: {
  codeLength: number;
}) => {
  const digits = "0123456789";
  let verifyCode = "";

  for (let i = 0; i < codeLength; i++) {
    verifyCode += digits.charAt(Math.floor(Math.random() * digits.length));
  }

  // Ensure the verifyCode has the correct number of digits by padding if necessary
  verifyCode = verifyCode.padStart(codeLength, "0");

  return { verifyCode };
};
