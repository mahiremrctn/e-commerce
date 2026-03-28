const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://www.google.com',
];

const isAllowedPaymentOrigin = (origin) => {
  return /^https:\/\/([a-z0-9-]+\.)?(iyzipay\.com|stripe\.com)$/i.test(origin);
};

const corsOptions = {
  origin(origin, callback) {
    // Bazı embedded ödeme akışlarında Origin header "null" olarak gelebilir.
    const isNullOrigin = origin === 'null' || origin === null || origin === undefined;
    const isWhitelistedOrigin = allowedOrigins.includes(origin);

    if (isNullOrigin || isWhitelistedOrigin || isAllowedPaymentOrigin(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS tarafından reddedilen origin: ${origin}`);
      callback(new Error('CORS politikası tarafından engellendiniz!'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
};

module.exports = corsOptions;