export const extractToken = (token: string) => {
  const x = token.replace(/"/g, "");
  return x;
};
