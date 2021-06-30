if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Missing 'NEXT_PUBLIC_API_URL' environment variable");
}

module.exports = {
  reactStrictMode: true,
};
