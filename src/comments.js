class BotComments {
    constructor(context, client) {
      this.context = context;
      this.client = client;
    }

    /** 
    * Fetches all the comments in a given issue that were created by the bot.
    * @return {Array} All bot comments (if any).
    */
    async all() {
        const options = this.client.issues.listComments.endpoint.merge({
            owner: this.context.repo.owner,
            repo: this.context.repo.repo,
            issue_number: this.context.payload.issue.number
        })
        const comments = await this.client.paginate(options)
        return comments.filter(comment => comment.user.login === 'github-actions[bot]');
    }
}

module.exports = {
    BotComments
}