import io from "socket.io-client";
import feathers from "@feathersjs/client";

const socket = io("http://localhost:5000");
const app = feathers();

app.configure(feathers.socketio(socket));

export default app;
