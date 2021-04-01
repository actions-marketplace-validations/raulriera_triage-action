[![CI](https://github.com/raulriera/triage-action/actions/workflows/ci.yml/badge.svg)](https://github.com/raulriera/triage-action/actions/workflows/ci.yml)

# Triage Issues

Automatically check that issues labelled with 'Bug' are correctly labelled. In the following example, the bot will check that all bug issues have any of these labels `Priority 0`, `Priority 1`, or `Priority 2`. Plus, a team specific label. So the resulting issue should be triaged as: `Bug`, `Priority 2`, `Team: Backend`.

## Usage

```yaml
name: "Issue triage"
on:
  issue_comment:
    types: [created]
  issues:
    types: [labeled]

jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
    - uses: raulriera/triage-action@main
      with:
        globs: |
          Priority [0-2]
          Team:*
        message: |
          **⚠️ Missing information**
          Please see our CONTRIBUTING.md for more information.
          
          When you are ready, please comment to this issue with `/triaged`
```

The bot will check that your issue's labels matches all of the globs. Additionally, the bot will check again when there is a new comment with the words `/triaged`.

## Inputs

Every available option.

| Input | Description |
| - | - |
| `repo-token` | Token to use to authorize label changes. Typically the GITHUB_TOKEN secret. |
| `globs` | List of [minimatch](https://github.com/isaacs/minimatch) globs to match against labels. |
| `message` | Comment to apply to the issue when it does not meet the glob requirements |
