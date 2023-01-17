import redis from "redis"
const client = redis.createClient();

client.on("error", error => {
  console.error(error);
});

export default client;

