const action = require('../index');

const context = {
    repo: {
        owner: "raulriera",
        repo: "action"
    },
    payload: {
        issue: {
            number: 1
        }
    }
}
const client = {
    issues: {
        listComments: {
            endpoint: {
                merge: jest.fn()
            }
        }
    },
    paginate: jest.fn().mockReturnValueOnce([
        {
            user: {
                login: "raulriera",
                body: "Hello"
            }
        },
        {
            user: {
                login: "github-actions[bot]",
                body: "Hi"
            }
        },
    ])
}

test('multiple comments returns the ones created by the action bot', async () => {
    const comments = await action.botComments(context, client);

    expect(comments).toBeInstanceOf(Array);
    expect(comments.length).toBe(1);
    expect(comments[0].user.login).toBe("github-actions[bot]");
});