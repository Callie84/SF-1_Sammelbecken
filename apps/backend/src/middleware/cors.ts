import cors from "cors";
const ORIGINS = [
  "https://seedfinderpro.de",
  "capacitor://localhost",
  "http://localhost",
  "https://localhost"
];

export const corsMw = cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (ORIGINS.some((o) => origin.startsWith(o))) return cb(null, true);
    return cb(new Error("CORS blocked"));
  },
  credentials: false,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","x-sf1-consent"]
});
