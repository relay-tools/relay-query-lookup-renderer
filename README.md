# relay-query-lookup-renderer
Same as Relay Modern's QueryRenderer, but will check the store for data before fetching.

Version >=4.0.0 are only compatible with react-relay@>=2.0.0-rc.2

Taken from react-relay QueryRenderer with two additions.
- lookup prop will check the relay store for data first and if present will immediately call `render` with props.
- retain prop will prevent the component from garbage collecting when unmounted.

## Install
yarn add relay-query-lookup-renderer

## Usage
```js

import QueryLookupRenderer from 'relay-query-lookup-renderer';

<QueryLookupRenderer
    lookup
    query={query}
    environment={environment}
    variables={variables}
    render={(props, error) => {
        if (error) {
            return <div>Error</div>
        } else if (props) {
            return <MyComponent {...props} />
        }
        return <div>Loading</div>
    }}
/>

```

All props are the same as the [QueryRenderer](https://facebook.github.io/relay/docs/query-renderer.html) included in relay except for 
* `lookup` If true, check the relay store for data first. If false or null, you will get the same behavior of the standard `QueryRenderer`.


### Example
See the full example here: https://github.com/robrichard/relay-modern-isomorphic-example

**Server**

```js
import query from './myQuery';
import {
    createOperationDescriptor,
    getRequest,
    Environment,
    RecordSource,
    Store,
} from 'relay-runtime';
import {renderToString} from 'react-dom/server';
import QueryLookupRenderer from 'relay-query-lookup-renderer';

// assume express route
export default function(req, res, next) {
    const source = new RecordSource();
    const store = new Store(source);
    const environment = new Environment({network: myNetworkLayer, store});
    const variables = {};
    const operation = createOperationDescriptor(
        getRequest(query),
        variables
    );
    
    environment.retain(operation.root);
    environment.sendQuery({
        operation,
        onCompleted: () => {
            const renderedComponent = ReactDOM.renderToString(
                <QueryLookupRenderer
                  lookup
                  environment={environment}
                  query={query}
                  variables={variables}
                  render={({props}) => <TodoApp viewer={props.viewer}/>}
                />
            );
            
            res.send(nunjucks.render('index.html', {
                renderedComponent: renderedComponent,
                records: JSON.stringify(environment.getStore().getSource()),
            }));
        }
    });
}
```

**Client**
```js
import ReactDOM from 'react-dom';
import RelayLookupQueryRenderer from './RelayLookupQueryRenderer';
import {
    Environment,
    RecordSource,
    Store,
} from 'relay-runtime';
import query from './myQuery';

// inject server fetched data into client store 
const source = new RecordSource(window.records);
const store = new Store(source);
const environment = new Environment({network: myNetworkLayer, store});

ReactDOM.render(
    <RelayLookupQueryRenderer
        lookup
        environment={environment}
        query={query}
        variables={{}}
        render={({error, props}) => {
            if (props) {
                return <TodoApp viewer={props.viewer} />;
            } else {
                return <div>Loading</div>;
            }
        }}
    />,
    document.getElementById('root')
);
```

