# Contribution Guide

Welcome contributors! 👋

Here you'll find information pertaining to the `byteslice` project and how to contribute effectively.

## Changesets

This project uses [changesets](https://github.com/changesets/changesets) to facilitate contribution documentation.

When a release is created, all changesets (since the previous release) are "consumed" to (a) establish the most appropriate version for each affected package and (b) write changelog entries accordingly. This makes cutting a release a straightforward process, since all contributions have been documented with relevant [semantic version type](https://semver.org/) changes (for each affected package) and a message (changelog entry) about what has changed.

### When

A changeset is an "[intent to release](https://github.com/changesets/changesets/blob/main/README.md#how-do-we-do-that)" one or more packages. They should be created for contributions that require version changes and should be included in an eventual release.

One or more changesets can be added at any point during the development cycle, but must be included by the time a PR is opened. This ensures all contributions are well-documented when they are eventually accepted and merged.

### How

To add a changeset, run the following command from the root of the project (where the `.changeset` folder resides).

```sh
# Add a new changeset
bun changeset
```

An interactive prompt will appear to assist in specifying which package(s) to include, choosing relevant version bump(s), and crafting a changelog message.

Once complete, markdown file(s) are automatically generated (located in the `.changeset` folder) and should be committed to version control. If necessary, they can modified directly (e.g., the message needs to be altered).

For more information on adding changesets, please refer to [this guide](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md#i-am-in-a-multi-package-repository-a-mono-repo).

#### Multiple Changesets

It is [perfectly acceptable](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md#you-can-add-more-than-one-changeset-to-a-pull-request) for a single contribution to have multiple changesets.

This approach is particularly useful when (a) multiple changed packages require different changelog entries and (b) a single package has multiple changes that should be documented separately.

#### "Empty" Changeset

If the contribution being made does not necessitate a version change or release — like when modifying build tools or tests — simply add an "empty" changeset instead.

```sh
# Add an "empty" changeset
bun changeset --empty
```

### Style Guide

A changeset's message should be a succinct, high-level description of applied changes. It should be a one-liner with starting capitalization and ending punctuation written in _simple past tense_.

> 💡 Since the resulting changelog and release notes (of each relevant package) will automatically specify the version type and reference the associated commit, it is unnecessary to divulge the "why" or dive deep into technical considerations. Anyone reviewing the aforementioned changelog and notes can simply access the associated commit and examine the underlying contribution.

Below are a few cheesy examples of effective messages:
```
Added bake functionality to pizza feature.
Fixed burnt crust in oven module.
Updated description of toppings package.
Refactored directory structure of delivery service.
```
