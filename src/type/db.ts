export type IDBOpenEventTarget = EventTarget & { result: IDBDatabase };
export type IDBErrorEventTarget = EventTarget & { errorCode: string };
