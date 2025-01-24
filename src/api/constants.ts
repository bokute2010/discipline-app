// api/endpoints/constants.ts
export const API_ENDPOINTS = {
  GENERATE_MULTIPLE_PRESIGNED_URL: '/aws/generate_presigned_urls',
  GENERATE_PRESIGNED_URL_READ: '/aws/generate_presigned_url_read',
  GENERATE_PRESIGNED_URL_PUT: '/aws/get-presign-url',
  UPDATE_USER_PROFILE: '/user/me/update',
  DOCUMENT: '/document/get-all',
  STAGING_CDPS: 'staging/cdps/get-all',
  STAGING_NKC: '/staging/nkc/get-all',
  ASSISTANT: '/assistant',
  CHAT_ROOM: '/chat-room',
  CREATE_CHAT_ROOM: '/chat-room/create',
  UPDATE_CHAT_ROOM: '/chat-room/update',
  DELETE_CHAT_ROOM: '/chat-room/delete',

  SAVED_PROMPT: '/saved-prompt',
  CREATE_SAVED_PROMPT: '/saved-prompt/create',
  UPDATE_SAVED_PROMPT: '/saved-prompt/update',
  DELETE_SAVED_PROMPT: '/saved-prompt/delete',

  CREATE_USER: '/user/create',
  
};

export const QUERY_KEYS = {
  DOCUMENTS: 'get-all-documents',
  STAGING_CDPS: 'get-all-staging-cdps',
  STAGING_NKC: 'get-all-staging-nkc',
  ASSISTANT: 'get-all-assistant',
  CHAT_ROOM: 'get-all-chat-room',

  SAVED_PROMPT: 'get-all-saved-prompt',
};
