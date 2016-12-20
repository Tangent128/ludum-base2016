// stub AMD module loader that can be prepended to Typescript output
var __amd_registry: {[name: string]: any} = {};
function define(name: string, depNames: string[], factory: Function) {
    __amd_registry["exports"] = {};
    let deps = depNames.map(name => __amd_registry[name]);
    factory.apply(this, deps);
    __amd_registry[name] = __amd_registry["exports"];
};
