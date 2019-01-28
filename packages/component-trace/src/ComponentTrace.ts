import { componentName, dependencies, componentConfig } from 'pandora-component-decorator';
import { TraceManager } from './TraceManager';
import { TraceManagerOptions, ComponentTraceConfig } from './domain';
import { isFunction } from 'lodash';

@componentName('trace')
@dependencies(['indicator'])
@componentConfig({
  trace: {
    poolSize: 100,
    interval: 60 * 1000,
    slowThreshold: 10 * 1000
  }
})
export default class ComponentTrace {
  ctx: any;
  traceManager: TraceManager;

  constructor(ctx: any) {
    this.ctx = ctx;
    const traceConfig = ctx.config.trace || {};
    const tracer = this.initTracer();
    const { kTracer, createTracer, ...managerConfig } = traceConfig;

    const options: TraceManagerOptions = {
      ...managerConfig,
      logger: ctx.logger,
      tracer
    };

    this.traceManager = new TraceManager(options);
    ctx.traceManager = this.traceManager;
  }

  initTracer() {
    const ctx = this.ctx;
    const trace: ComponentTraceConfig = ctx.config.trace || {};

    if (trace) {
      const { kTracer: Tracer, createTracer } = trace;

      if (createTracer && isFunction(createTracer)) {
        return createTracer(ctx);
      }

      if (Tracer) {
        return new Tracer(ctx);
      }
    }

    return null;
  }

  async startAtSupervisor() {
    this.traceManager.start();
  }

  async start() {
    this.traceManager.start();
  }

  async stopAtSupervisor() {
    this.traceManager.stop();
  }

  async stop() {
    this.traceManager.stop();
  }

}

export * from './constants';
export * from './domain';
export * from './TraceData';
export * from './TraceEndPoint';
export * from './TraceIndicator';
export * from './TraceManager';
