import { httpServer } from "./App";
import env from './Environment';

const PORT = 3001 //env.getPort();

httpServer.listen(PORT, () => {
   console.log('Express server listening on port ' + PORT);
});