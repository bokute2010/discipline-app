import fs from 'fs';

let data = "# Prod\n" +
"VITE_APP_NAME=AIFA\n" +
"VITE_APP_VERSION=1=9.1.0\n" +
"GENERATE_SOURCEMAP=false\n" +
"VITE_APP_API_URL=https://prjgufj06f.execute-api.ap-southeast-1.amazonaws.com/v1\n" +
"VITE_APP_API_SOCKET_URL=wss://v3hz09ryrk.execute-api.ap-southeast-1.amazonaws.com/production\n"

fs.writeFileSync(".env", data)
