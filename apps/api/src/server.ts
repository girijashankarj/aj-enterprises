import { app } from "./app";
import { env } from "./config/env";

app.listen(Number(env.PORT), () => {
  console.log(`API running on http://localhost:${env.PORT}`);
});
