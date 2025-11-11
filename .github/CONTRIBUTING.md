Contributing & Linting — padel-events

This file summarizes the mandatory lint & formatting policy plus PR checklist for this repo.

Mandatory policy (every change)

- The project enforces a lint & formatting pass after every code edit. This is non-optional for code touching HTML/CSS/JS.

Local commands (run before opening a PR)

- HTML lint
  - npx htmlhint index.html

- CSS lint & fix
  - npx stylelint "assets/\*_/_.css" --fix

- JS lint (if ESLint config exists)
  - npx eslint index.html
  - If the repo lacks an ESLint config and you want one, we can add `.eslintrc` tuned to the inline pattern — confirm before adding.

- Formatting
  - npx prettier --check "_.html" "assets/\*\*/_.css"
  - If Prettier reports issues: npx prettier --write "_.html" "assets/\*\*/_.css"

How to run these on macOS with zsh (copy/paste into terminal)

```bash
# run htmlhint
npx htmlhint index.html

# run stylelint auto-fix
npx stylelint "assets/**/*.css" --fix

# eslint (if config present)
npx eslint index.html

# Prettier checks
npx prettier --check "*.html" "assets/**/*.css"
# apply fixes if needed
npx prettier --write "*.html" "assets/**/*.css"
```

PR checklist

- [ ] I ran HTMLHint and fixed issues.
- [ ] I ran Stylelint and Prettier; both pass locally.
- [ ] I ran ESLint if an ESLint config was present.
- [ ] I bumped the CSS version file (when the change affects visuals) and updated `index.html`.
- [ ] I documented any linter skips or deviations in the PR description.
- [ ] Accessibility quick-check completed (headings order, alt text, keyboard behavior).

Notes about CI / GitHub Actions

- I can add a GitHub Actions workflow to run the above linters automatically on PRs (recommended). This will not modify files (only check); PR authors should run `--fix`/`--write` locally prior to pushing.
- Do you want a workflow that auto-runs and posts results on PRs? If yes, I can propose one and add it.

Questions & support

- If you're unsure about adding ESLint or stylelint config files, I can add minimal, non-intrusive configs aimed at this repo's inline/vanilla nature.
- If you'd like automated formatting via a pre-commit hook (Husky) I can propose it, but that would add dev dependencies — ask first.

Thanks for keeping the repo tidy — consistent tooling makes small projects much easier to maintain.
