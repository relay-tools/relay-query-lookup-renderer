'use strict';

// get around warning from react for now
global.requestAnimationFrame = (cb) => {
    setTimeout(cb, 0)
};

const QueryRenderer = require('../../src/index');
const { configure, mount } = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const React = require('react');
const fs = require('fs');
const path = require('path');
const {
    graphql,
    Environment,
    Network,
    RecordSource,
    Store,
    fetchQuery
} = require('relay-runtime');
const getNetworkLayer = require('relay-mock-network-layer');

const query = graphql`
    query testQuery ($id: ID!) {
        author(id: $id) {
            firstName
        }
    }
`;

configure({ adapter: new Adapter() });

function sleep() {
    return new Promise(resolve => setTimeout(resolve, 0));
}

function getEnvironment() {
    const networkLayer = getNetworkLayer({
        schema: fs.readFileSync(
            path.resolve(__dirname, '../schema.graphql'),
            {encoding: 'utf8'}
        )
    });
    const networkCall = jest.fn((...args) => networkLayer(...args));

    const network = Network.create(networkCall);

    const store = new Store(new RecordSource());
    return {
        environment: new Environment({network, store}),
        networkCall
    };
}

describe('query lookup renderer', function () {
    let environment;
    let networkCall;
    beforeEach(function () {
        ({environment, networkCall} = getEnvironment());
    });
    it('make sure environment mock is working', async () => {
        await fetchQuery(environment, query, {id: 123});
        expect(networkCall.mock.calls.length).toBe(1);
    });
    it('make sure environment mock is working 2', async () => {
        await fetchQuery(environment, query, {id: 123});
        await fetchQuery(environment, query, {id: 123});
        expect(networkCall.mock.calls.length).toBe(2);
    });
    it('should fetch data when not in the store', async () => {
        expect(networkCall.mock.calls.length).toBe(0);
        mount(
            <QueryRenderer
                lookup
                query={query}
                variables={{id: 123}}
                render={jest.fn(() => null)}
                environment={environment}
            />
        );
        expect(networkCall.mock.calls.length).toBe(1);
    });
    it('should not fetch data when already in the store', async () => {
        await fetchQuery(environment, query, {id: 123});
        expect(networkCall.mock.calls.length).toBe(1);
        mount(
            <QueryRenderer
                lookup
                query={query}
                variables={{id: 123}}
                render={jest.fn(() => null)}
                environment={environment}
            />
        );
        expect(networkCall.mock.calls.length).toBe(1);
    });
    it('should fetch data when different variables are in the store', async () => {
        await fetchQuery(environment, query, {id: 123});
        expect(networkCall.mock.calls.length).toBe(1);
        mount(
            <QueryRenderer
                lookup
                query={query}
                variables={{id: 124}}
                render={jest.fn(() => null)}
                environment={environment}
            />
        );
        expect(networkCall.mock.calls.length).toBe(2);
    });
    it('should fetch data when different variables are in the store', async () => {
        await fetchQuery(environment, query, {id: 123});
        expect(networkCall.mock.calls.length).toBe(1);
        mount(
            <QueryRenderer
                lookup
                query={query}
                variables={{id: 124}}
                render={jest.fn(() => null)}
                environment={environment}
            />
        );
        expect(networkCall.mock.calls.length).toBe(2);
    });
    it('should correctly handle updating props', async () => {
        await fetchQuery(environment, query, {id: 123});
        expect(networkCall.mock.calls.length).toBe(1);
        const baseProps = {
            lookup: true,
            query,
            variables: {id: 123},
            render: jest.fn(() => null),
            environment
        };
        const component = mount(
            <QueryRenderer {...baseProps} />
        );
        // already rendered
        expect(networkCall.mock.calls.length).toBe(1);

        // not fetched
        component.setProps({...baseProps, variables: {id: 124}});
        expect(networkCall.mock.calls.length).toBe(2);

        // already fetched
        component.setProps({...baseProps, variables: {id: 123}});
        expect(networkCall.mock.calls.length).toBe(2);
    });
    it('should dispose when unmounted', async () => {
        expect(networkCall.mock.calls.length).toBe(0);
        const component = mount(
            <QueryRenderer
                lookup
                query={query}
                variables={{id: 123}}
                render={jest.fn(() => null)}
                environment={environment}
            />
        );
        // wait for network call to finish
        await sleep();
        expect(networkCall.mock.calls.length).toBe(1);
        component.unmount();

        // wait for GC
        await sleep();

        // disposed, will fetch again
        mount(
            <QueryRenderer
                lookup
                query={query}
                variables={{id: 123}}
                render={jest.fn(() => null)}
                environment={environment}
            />
        );
        expect(networkCall.mock.calls.length).toBe(2);
    });
    it('should not dispose when retain is passed', async () => {
        expect(networkCall.mock.calls.length).toBe(0);
        const component = mount(
            <QueryRenderer
                lookup
                retain
                query={query}
                variables={{id: 123}}
                render={jest.fn(() => null)}
                environment={environment}
            />
        );

        // wait for network call to finish
        await sleep();
        expect(networkCall.mock.calls.length).toBe(1);
        component.unmount();

        // wait for GC
        await sleep();

        // should not fetch again
        mount(
            <QueryRenderer
                lookup
                retain
                query={query}
                variables={{id: 123}}
                render={jest.fn(() => null)}
                environment={environment}
            />
        );
        expect(networkCall.mock.calls.length).toBe(1);
    });
});


