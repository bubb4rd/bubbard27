import { outboundOf } from "./src/lib/work";
console.log(JSON.stringify(outboundOf({ href: "https://github.com/bubb4rd/vaultair" })));
console.log(JSON.stringify(outboundOf({ href: "https://elovatesr.com", links: [{ label: "Code", href: "https://github.com/bubb4rd/x" }] })));
console.log(JSON.stringify(outboundOf({})));
