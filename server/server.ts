import app from "./app";
import { initializeDatabase } from "./database/init";

const PORT = Number(process.env.PORT) || 4000;

async function start() {
  try {
    console.log("");
    console.log("====================================");
    console.log("🐠 BlueLog Server starten...");
    console.log("====================================");

    await initializeDatabase();

    app.listen(PORT, () => {
      console.log("");
      console.log("====================================");
      console.log("✅ BlueLog API draait");
      console.log(`🌐 http://localhost:${PORT}`);
      console.log("====================================");
      console.log("");
    });

  } catch (error) {
    console.error("");
    console.error("❌ BlueLog kon niet starten");
    console.error(error);
    console.error("");

    process.exit(1);
  }
}

start();