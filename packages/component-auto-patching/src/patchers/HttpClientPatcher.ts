import { Patcher } from '../Patcher';
import * as semver from 'semver';
import * as http from 'http';
import * as https from 'https';
import { HttpClientWrapper } from './wrappers/http-client/HttpClientWrapper';
import { HttpClientPatcherOptions } from '../domain';
import { nodeVersion } from '../utils';

export class HttpClientPatcher extends Patcher {
  protected options: HttpClientPatcherOptions;
  protected _moduleName = 'httpClient';
  protected wrapper: HttpClientWrapper;
  protected wrapHttps: boolean = nodeVersion('<0.11 || >=9.0.0 || 8.9.0');

  constructor(ctx) {
    super(ctx);
    const KWrapper = this.options.kWrapper || HttpClientWrapper;
    this.wrapper = new KWrapper(this.ctx, this.options);
  }

  target() {
    return {
      http,
      https
    };
  }

  attach() {
    const target = this.target();

    this.wrapper.wrap(target.http);

    if (this.wrapHttps || this.options.forcePatchHttps) {
      this.wrapper.wrap(target.https);
    }
  }

  unattach() {
    const target = this.target();
    this.wrapper.unwrap(target.http);

    if (this.wrapHttps || this.options.forcePatchHttps) {
      this.wrapper.unwrap(target.https);
    }
  }
}