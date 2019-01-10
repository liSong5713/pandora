import { EventEmitter } from 'events';
import { IncomingMessage, ServerResponse } from 'http';
import { Patcher } from './Patcher';

export type OriginalModule = any;
export type WrappedModule = any;
export type ShimmerWrapper = (original: OriginalModule, name: string) => WrappedModule;

export interface IShimmer {
  wrap: (nodule: OriginalModule, name: string, wrapper: ShimmerWrapper) => WrappedModule;
  massWrap: (nodules: OriginalModule | OriginalModule[], names: string[], wrapper: ShimmerWrapper) => void;
  unwrap: (nodule: WrappedModule, name: string) => OriginalModule;
  massUnwrap: (nodules: WrappedModule | WrappedModule[], names: string[]) => void;
}

export interface ICLSContext extends Object {
  _ns_name: string;
  id: number;
}

export type CLSContextValue = any;
export type CLSBindFunction = Function;

export interface ICLSNamespace {
  name: string;
  active: ICLSContext;
  _set: ICLSContext[];
  id: number;
  _contexts: Map<number, ICLSContext>;
  _indent: number;

  set: (key: string | number, value: CLSContextValue) => CLSContextValue;
  get: (key: string | number) => CLSContextValue;
  createContext: () => ICLSContext;
  run: (fn: Function) => void;
  runAndReturn: (fn: Function) => any;
  runPromise: (fn: Function) => any;
  bind: (fn: Function, context?: ICLSContext) => CLSBindFunction;
  enter: (context: ICLSContext) => void;
  exit: (context: ICLSContext) => void;
  bindEmitter: (emitter: EventEmitter) => void;
  fromException: (exception: Error) => any;
}

export interface PatcherOptions {
  enabled?: boolean;
  klass?: Patcher;
}

export type CustomTraceName = (tags: HttpServerTags) => string;
export type RequestFilter = (req: IncomingMessage) => boolean;
export type BodyTransformer = (buffer: Buffer, req?: IncomingMessage) => string;

export interface HttpServerPatcherOptions extends PatcherOptions {
  // 是否记录 search 参数
  recordSearchParams?: boolean;
  // 是否记录 body 数据
  recordBody?: boolean;
  // body data buffer 转换函数
  bodyTransformer?: BodyTransformer;
  // 请求过滤，返回 true 则不记录
  requestFilter?: RequestFilter;
  // 是否记录完整请求 URL，记录在 log 里
  recordFullUrl?: boolean;
  // 自定义 traceName
  traceName?: CustomTraceName;
}

export type RequestListener = (request: IncomingMessage, response: ServerResponse) => void;
// node v9.6.0+, v0.1.13+ 新增参数
export interface HttpCreateServerOptions {
  IncomingMessage?: IncomingMessage;
  ServerResponse?: ServerResponse;
}

export interface Tags {
  is_entry: boolean;
}

export interface HttpServerTags extends Tags {
  'http.method'?: string;
  'http.pathname'?: string;
  'http.client'?: boolean;
  'http.status_code'?: number;
}

export interface GlobalPatcherOptions extends PatcherOptions {
  recordConsole?: boolean;
  recordUnhandled?: boolean;
  recordFatal?: boolean;
}

export interface IWrapper {
  new (ctx: any, options: PatcherOptions): IWrapper;
  wrap: (target: any) => void;
  unwrap: (target: any) => void;
}

export type ResponseTransformer = (buffer: Buffer, res?: ServerResponse) => string;

export interface HttpClientPatcherOptions extends PatcherOptions {
  // 通常情况下，https 的 request 方法调用的是 http 的 request
  // 但有部分版本使用了基础实现，需要单独处理
  forcePatchHttps?: boolean;
  // 记录请求结果
  recordResponse?: boolean;
  // 请求结果处理函数
  responseTransformer?: ResponseTransformer;
  // 是否开启下游追踪，开启会在请求中植入参数
  tracing?: boolean;
  // http client wrapper
  kWrapper?: IWrapper;
}

export interface HttpClientTags extends Tags {
  'http.method'?: string;
  'http.pathname'?: string;
  'http.hostname'?: string;
  'http.port'?: string;
  'http.client'?: boolean;
  'http.status_code'?: number;
}

export type SQLMask = (sql: string) => string;

export interface MySQLPatcherOptions extends PatcherOptions {
  // 是否记录 sql
  recordSql?: boolean;
  // sql 脱敏函数
  sqlMask?: SQLMask;
  // mysql wrapper
  kWrapper?: IWrapper;
}

export interface MySQLTags extends Tags {
  'mysql.method'?: string;
  'mysql.host'?: string;
  'mysql.portPath'?: string;
  'mysql.database'?: string;
  'mysql.table'?: boolean;
  'mysql.operation'?: number;
}