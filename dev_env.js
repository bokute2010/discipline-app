import fs from 'fs';

let data = "# Dev\n" +
"VITE_APP_NAME=AIFA\n" +
"VITE_APP_VERSION=1=9.1.0\n" +
"GENERATE_SOURCEMAP=false\n" +
"VITE_APP_API_URL=http://localhost:5001\n" +
"VITE_APP_API_SOCKET_URL=ws://localhost:5001/ws\n" +
"VITE_APP_MODE=DEV\n"

fs.writeFileSync(".env", data)
