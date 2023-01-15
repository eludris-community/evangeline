# Contributing

Firstly want to give a gigantic thank you for taking the time to contribute to this project. Your contribution is greatly appreciated.

Before contributing, there is a few things you should know if you don't already.

## Submitting a Pull Request

### Dependencies

In order to install these dependencies locally, you will need to have [Yarn](https://yarnpkg.com/getting-started/install) installed. Once that is done, simply run:

```bash
yarn install
```

### Commit Messages

Evangeline follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This means that all commit messages must follow a specific format. This is to ensure that the changelog is generated correctly.

To be more specific, evangeline uses [Angular's commit message format](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#type). This means that all commit messages must follow the following format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Examples

```
feat: add send method to bot class
```

```
refactor!: rename send method to sendMessage

BREAKING CHANGE: send method has been renamed to sendMessage
```

```
fix(sendMessage): make sendMessage not accept undefined
```

**Type**:

The `type` field of your message should be **ONE** of the following:

- build: Changes that affect dependencies or build process
- chore: Miscellaneous changes that don't affect the code or tests (does not include documentation changes, see `docs`)
- ci: Changes to CI configuration files and scripts
- docs: Changes the the documentation
- feat: Adds a new feature
- fix: Fixes a bug or issue with the code/library
- perf: Improves performance in the library
- refactor: Refactors the code. Usually is not a feature or bug fix.
- style: Changes that do not affect the meaning of the code (added whitespace, formatting, etc)
- test: Adds or modifies tests
- deps: Changes to external dependencies (does not include devDependencies, use `dev-deps`)
- dev-deps: Changes to external developer dependencies (Dependencies that are not required during runtime).

**Scope**:

The `scope` field of your message is optional. It should be the name of the file or folder that you are modifying. If you are modifying multiple files, you can split each file/directory using a comma.

**Description**:

The `description` field of your message is required. It should be a short description of the changes you are making. It should be in the present tense, and should usually not be capitalised.

Meaning that:

```yml
# bad

Feat: Add send method to bot class
feat: added send method to bot class

# good
feat: add send method to bot class
```

**Body**:

The `body` field of your message is optional. It should be a longer description of the changes you are making. It should be in the present tense, and should usually not be capitalised. It should be separated from the `description` field by a blank line.

**Footer**:

The `footer` field of your message is optional. It should be used to reference issues or commits that your Pull Request is related to. It should be separated from the `body` field by a blank line.

#### Examples

```
feat: add send method to bot class

This commit adds a new method to the bot class, which allows you to send messages to the chat.

Closes #1
```

```

refactor!: rename send method to sendMessage

BREAKING CHANGE: send method has been renamed to sendMessage

This commit renames the send method to sendMessage, to make it more clear what the method does.

Closes #2
```

```

fix(sendMessage): make sendMessage not accept undefined

This commit fixes a bug where sendMessage would accept undefined as a message, and would send it to the chat.

Closes #3
```

### Pull Request Template

When you create a Pull Request, you will be presented with a template. This template is there to help you write a good Pull Request. It is also there to help me understand what you are trying to do. So I strongly request that you use that template and do not replace anything but the summary content and checklist content.

### Code Style

Evangeline uses [Prettier](https://prettier.io/) to format the code. This means that all code must be formatted using Prettier. If you are using VSCode, you can install the [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) to automatically format your code.

### Linting

Evangeline uses [ESLint](https://eslint.org/) to lint the code. This means that all code must be linted using ESLint. If you are using VSCode, you can install the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) to automatically lint your code.

### Testing your change(s)

Testing your change is quite straightforward. You can simply run

```bash
yarn link
yarn link <path/to/evangeline>
```

This will link your local version of evangeline to your project. You can then test your changes. Once you are done, you can simply run

```bash
yarn unlink <path/to/evangeline>
```

This will unlink your local version of evangeline from your project.

## Submitting an Issue

### Issue Template

When you create an issue, you will be presented with a template. This template is there to help you write a good issue. It is also there to help me understand what you are trying to do. So I strongly request that you use that template and do not replace anything in the template and only describe your issue.

## Documentation

Evangeline uses [TypeDoc](https://typedoc.org/) to generate documentation. This means that all documentation must be written using TypeDoc.

To add a documentation, simply add a docstring above your code. For example:

```ts
/**
 * This is a function that does something
 * @param bar The bar to foo
 * @returns The foobar
 */
function foo(bar: string) {
  return bar;
}
```

This _does_ make use of [JSDoc](https://jsdoc.app/). However, it is not the same as Typedoc. You can read more about the differences [here](https://typedoc.org/guides/doccomments/).

### Generating the documentation

To generate the documentation, simply run

```bash
yarn docs
```

This will generate the documentation in the `docs` folder.
