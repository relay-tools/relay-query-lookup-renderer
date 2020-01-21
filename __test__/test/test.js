'use strict';

// get around warning from react for now
global.requestAnimationFrame = cb => {
    setTimeout(cb, 0);
};

const QueryRenderer = require('../../src/index');
const { createMockEnvironment, MockPayloadGenerator } = require('relay-test-utils');
const { configure, mount } = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const React = require('react');
const fs = require('fs');
const path = require('path');
const { graphql, fetchQuery } = require('relay-runtime');

const query = graphql`
    query testQuery($id: ID!) {
        author(id: $id) {
            firstName
        }
    }
`;

configure({ adapter: new Adapter() });

function sleep() {
    return new Promise(resolve => setTimeout(resolve, 0));
}

describe('query lookup renderer', function() {
    let environment;
    function queueOperations(num) {
        for (let i = 0; i < num; i++) {
            environment.mock.queueOperationResolver(operation =>
                MockPayloadGenerator.generate(operation)
            );
        }
    }
    beforeEach(() => {
        environment = createMockEnvironment();
    });
    it('make sure environment mock is working', async () => {
        queueOperations(1);
        await fetchQuery(environment, query, { id: 123 });
        expect(environment.execute.mock.calls.length).toBe(1);
    });
    it('make sure environment mock is working 2', async () => {
        queueOperations(2);
        await fetchQuery(environment, query, { id: 123 });
        await fetchQuery(environment, query, { id: 123 });
        expect(environment.execute.mock.calls.length).toBe(2);
    });
    it('should fetch data when not in the store', async () => {
        queueOperations(1);
        expect(environment.execute.mock.calls.length).toBe(0);
        mount(
            <QueryRenderer
                lookup
                query={query}
                variables={{ id: 123 }}
                render={jest.fn(() => null)}
                environment={environment}
            />
        );
        expect(environment.execute.mock.calls.length).toBe(1);
    });
    it('should not fetch data when already in the store', async () => {
        queueOperations(1);
        await fetchQuery(environment, query, { id: 123 });
        expect(environment.execute.mock.calls.length).toBe(1);
        mount(
            <QueryRenderer
                lookup
                query={query}
                variables={{ id: 123 }}
                render={jest.fn(() => null)}
                environment={environment}
            />
        );
        expect(environment.execute.mock.calls.length).toBe(1);
    });
    it('should fetch data when different variables are in the store', async () => {
        queueOperations(2);
        await fetchQuery(environment, query, { id: 123 });
        expect(environment.execute.mock.calls.length).toBe(1);
        mount(
            <QueryRenderer
                lookup
                query={query}
                variables={{ id: 124 }}
                render={jest.fn(() => null)}
                environment={environment}
            />
        );
        expect(environment.execute.mock.calls.length).toBe(2);
    });
    it('should fetch data when different variables are in the store', async () => {
        queueOperations(2);
        await fetchQuery(environment, query, { id: 123 });
        expect(environment.execute.mock.calls.length).toBe(1);
        mount(
            <QueryRenderer
                lookup
                query={query}
                variables={{ id: 124 }}
                render={jest.fn(() => null)}
                environment={environment}
            />
        );
        expect(environment.execute.mock.calls.length).toBe(2);
    });
    it('should correctly handle updating props', async () => {
        queueOperations(2);
        await fetchQuery(environment, query, { id: 123 });
        expect(environment.execute.mock.calls.length).toBe(1);
        const baseProps = {
            lookup: true,
            query,
            variables: { id: 123 },
            render: jest.fn(() => null),
            environment,
        };
        const component = mount(<QueryRenderer {...baseProps} />);
        // already rendered
        expect(environment.execute.mock.calls.length).toBe(1);

        // not fetched
        component.setProps({ ...baseProps, variables: { id: 124 } });
        expect(environment.execute.mock.calls.length).toBe(2);

        // already fetched
        component.setProps({ ...baseProps, variables: { id: 123 } });
        expect(environment.execute.mock.calls.length).toBe(2);
    });
    it('should dispose when unmounted', async () => {
        queueOperations(2);
        expect(environment.execute.mock.calls.length).toBe(0);
        const component = mount(
            <QueryRenderer
                lookup
                query={query}
                variables={{ id: 123 }}
                render={jest.fn(() => null)}
                environment={environment}
            />
        );
        // wait for network call to finish
        await sleep();
        expect(environment.execute.mock.calls.length).toBe(1);
        component.unmount();

        // wait for GC
        await sleep();

        // disposed, will fetch again
        mount(
            <QueryRenderer
                lookup
                query={query}
                variables={{ id: 123 }}
                render={jest.fn(() => null)}
                environment={environment}
            />
        );
        expect(environment.execute.mock.calls.length).toBe(2);
    });
    it('should not dispose when retain is passed', async () => {
        expect(environment.execute.mock.calls.length).toBe(0);
        const component = mount(
            <QueryRenderer
                lookup
                retain
                query={query}
                variables={{ id: 123 }}
                render={jest.fn(() => null)}
                environment={environment}
            />
        );

        environment.mock.resolveMostRecentOperation(operation =>
            MockPayloadGenerator.generate(operation)
        );

        // wait for network call to finish
        await sleep();
        expect(environment.execute.mock.calls.length).toBe(1);
        component.unmount();

        // wait for GC
        await sleep();

        // should not fetch again
        mount(
            <QueryRenderer
                lookup
                retain
                query={query}
                variables={{ id: 123 }}
                render={jest.fn(() => null)}
                environment={environment}
            />
        );
        expect(environment.execute.mock.calls.length).toBe(1);
    });
});
