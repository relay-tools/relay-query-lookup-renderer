/**
 * @flow
 * @relayHash 297427f7d0219fbb0b6bf2582656279a
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type testQueryVariables = {|
  id: string,
|};
export type testQueryResponse = {|
  +author: ?{|
    +firstName: ?string,
  |},
|};
*/


/*
query testQuery(
  $id: ID!
) {
  author(id: $id) {
    firstName
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "id",
    "type": "ID!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id",
    "type": "ID!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "firstName",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "testQuery",
  "id": null,
  "text": "query testQuery(\n  $id: ID!\n) {\n  author(id: $id) {\n    firstName\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "testQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "author",
        "storageKey": null,
        "args": v1,
        "concreteType": "Author",
        "plural": false,
        "selections": [
          v2
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "testQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "author",
        "storageKey": null,
        "args": v1,
        "concreteType": "Author",
        "plural": false,
        "selections": [
          v2,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  }
};
})();
(node/*: any*/).hash = '38db74baba8c5430573d5cd232564379';
module.exports = node;
