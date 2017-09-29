/**
 * @flow
 * @relayHash f5b8214c57725f5e2f0b152852ba1daa
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type testQueryResponse = {|
  +author: ?{|
    +firstName: ?string;
  |};
|};
*/


/*
query testQuery(
  $id: Int!
) {
  author(id: $id) {
    firstName
  }
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "id",
        "type": "Int!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "testQuery",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "id",
            "variableName": "id",
            "type": "Int!"
          }
        ],
        "concreteType": "Author",
        "name": "author",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "firstName",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "testQuery",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "id",
        "type": "Int!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "testQuery",
    "operation": "query",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "id",
            "variableName": "id",
            "type": "Int!"
          }
        ],
        "concreteType": "Author",
        "name": "author",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "firstName",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "query testQuery(\n  $id: Int!\n) {\n  author(id: $id) {\n    firstName\n  }\n}\n"
};

module.exports = batch;
