declare module 'pnp-webpack-plugin' {
  function apply(resolver: any /* EnhancedResolve.Resolver */): void;
  function moduleLoader(module: NodeModule): any;
  function forkTsCheckerOptions(config: any): any;
}
