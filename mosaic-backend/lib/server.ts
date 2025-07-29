import { httpServer } from "./App";

const PORT = 3001

httpServer.listen(PORT, () => {
   console.log('Express server listening on port ' + PORT);
});