/**
 * @flow
 * @relayHash f7ea3234e036808b3905e17f2397bc65
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type testQueryVariables = {|
  id: string
|};
export type testQueryResponse = {|
  +author: ?{|
    +firstName: ?string
  |}
|};
export type testQuery = {|
  variables: testQueryVariables,
  response: testQueryResponse,
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
    "variableName": "id"
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
  "fragment": {
    "kind": "Fragment",
    "name": "testQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "author",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Author",
        "plural": false,
        "selections": [
          (v2/*: any*/)
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "testQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "author",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Author",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
  },
  "params": {
    "operationKind": "query",
    "name": "testQuery",
    "id": null,
    "text": "query testQuery(\n  $id: ID!\n) {\n  author(id: $id) {\n    firstName\n    id\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '38db74baba8c5430573d5cd232564379';
module.exports = node;
