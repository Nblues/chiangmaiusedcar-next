const fs = require('fs');

let c = fs.readFileSync('lib/shopify/queries.mjs', 'utf8');

const replacement = "export const metafieldRefSelection = `\n" +
"    reference {\n" +
"      __typename\n" +
"      ... on Metaobject {\n" +
"        id\n" +
"        handle\n" +
"        type\n" +
"        fields {\n" +
"          key\n" +
"          value\n" +
"        }\n" +
"      }\n" +
"    }\n" +
"    references(first: 20) {\n" +
"      edges {\n" +
"        node {\n" +
"          __typename\n" +
"          ... on Metaobject {\n" +
"            id\n" +
"            handle\n" +
"            type\n" +
"            fields {\n" +
"              key\n" +
"              value\n" +
"            }\n" +
"          }\n" +
"        }\n" +
"      }\n" +
"    }\n" +
"  `;\n\n";

let idx = c.indexOf('export const metafieldRefSelection = ');
let idx2 = c.indexOf('export const AdminSpecByIdsQuery =');

c = c.substring(0, idx) + replacement + c.substring(idx2);

fs.writeFileSync('lib/shopify/queries.mjs', c);
