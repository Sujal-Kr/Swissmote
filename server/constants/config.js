const options = {
  httpOnly: true,
  secure: true,
  maxAge: 1000 * 60 * 60 * 24,
};

const corsoptions = {
  origin: "*",
  credentials: true,
};
export { options, corsoptions };
