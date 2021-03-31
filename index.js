const minimatch = require("minimatch");
const core = require('@actions/core');
const github = require('@actions/github');

async function triage(context, github) {
  const labels = context.payload.issue.labels.map(item => item.name)
  const globs = core.getInput('globs', { required: true })
                    .split("\n")
                    .filter(glob => glob !== "");
  const botMessage = core.getInput('message', { required: true });
  const isTriaged = checkLabels(labels, globs)

  if (context.eventName === 'issues' && context.payload.action === 'labeled' && context.payload.label.name.toLowerCase() === 'bug' && !isTriaged) {
    await github.issues.createComment({
      issue_number: context.payload.issue.number,
      owner: context.repo.owner,
      repo: context.repo.repo,
      body: botMessage
    })
  }
  else if (context.eventName === 'issue_comment' && context.payload.action === 'created' && context.payload.comment.body === '/triaged') {
    const comment = await botComments(context, github).find(comment => comment.body === botMessage)
    if (isTriaged && comment !== undefined) {
      await github.issues.deleteComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        comment_id: comment.id
      })
    }
    
    await github.reactions.createForIssueComment({
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
* @param {Object} github - REST client for the GitHub's API.
* @return {Array} All bot comments (if any).
*/
async function botComments(context, github) {
  const options = github.issues.listComments.endpoint.merge({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.payload.issue.number
  })
  const comments = await github.paginate(options)
  return comments.filter(comment => comment.user.login === 'github-actions[bot]');
}

module.exports = {
    triage,
    checkLabels,
    botComments
}