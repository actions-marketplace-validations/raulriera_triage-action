[![CI](https://github.com/raulriera/triage-action/actions/workflows/ci.yml/badge.svg)](https://github.com/raulriera/triage-action/actions/workflows/ci.yml)

# Triage Issues

Automatically check that issues are correctly labelled.

## Usage

```
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
          P[0-3]
          Team:*
        message: '**Missing information**\n Please see our CONTRIBUTING.md for more information.'
```

## Inputs

Every available option.

| Input | Description |
| - | - |
| `repo-token` | Token to use to authorize label changes. Typically the GITHUB_TOKEN secret. |
| `globs` | List of [minimatch](https://github.com/isaacs/minimatch) globs to match against labels. |
| `message` | Comment to apply to the issue when it doesn't meet the glob requirements |
