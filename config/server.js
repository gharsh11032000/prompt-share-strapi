module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: env("", "https://prompt-share-strapi.onrender.com/"),
  app: {
    keys: env.array("APP_KEYS"),
  },
  proxy: true,
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
});
