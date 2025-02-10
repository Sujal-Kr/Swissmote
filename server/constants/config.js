const options = {
  httpOnly: true,
  secure: true,
  maxAge: 1000 * 60 * 60 * 24,
  sameSite: "none",
};

const corsoptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    process.env.CLIENT,
  ],
  credentials: true,
};
export { options, corsoptions };
