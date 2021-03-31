const minimatch = require("minimatch");
const core = require('@actions/core');
const github = require('@actions/github');

async function triage() {
  const token = core.getInput('repo-token')
  const globs = core.getInput('globs', { required: true })
                    .split("\n")
                    .filter(glob => glob !== "");
  const botMessage = core.getInput('message', { required: true });

  const client = new github.GitHub(token);
  const context = github.context;

  const labels = context.payload.issue.labels.map(item => item.name);
  const isTriaged = checkLabels(labels, globs);

  if (context.eventName === 'issues' && context.payload.action === 'labeled' && context.payload.label.name.toLowerCase() === 'bug' && !isTriaged) {
    await client.issues.createComment({
      issue_number: context.payload.issue.number,
      owner: context.repo.owner,
      repo: context.repo.repo,
      body: botMessage
    })
  }
  else if (context.eventName === 'issue_comment' && context.payload.action === 'created' && context.payload.comment.body === '/triaged') {
    const comment = await botComments(context, client).find(comment => comment.body === botMessage)
    if (isTriaged && comment !== undefined) {
      await client.issues.deleteComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        comment_id: comment.id
      })
    }
    
    await client.reactions.createForIssueComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      comment_id: context.payload.comment.id,
      content: isTriaged ? '+1' : '-1'
    })
  }
}

function checkLabels(labels, globs) {
  const matches = globs.map(glob => minimatch.match(labels, glob, { nocase: true }))
  // if an item doesn't match, it will be returned as an empty array
  return !matches.flatMap(item => item.length).includes(0)
}

/** 
* Fetches all the comments in a given issue that were created by the bot.
* @param {Object} context - Object containing all the issue data.
* @param {Object} client - REST client for the GitHub's API.
* @return {Array} All bot comments (if any).
*/
async function botComments(context, client) {
  const options = client.issues.listComments.endpoint.merge({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.payload.issue.number
  })
  const comments = await client.paginate(options)
  return comments.filter(comment => comment.user.login === 'github-actions[bot]');
}

triage();

module.exports = {
    checkLabels,
    botComments
}