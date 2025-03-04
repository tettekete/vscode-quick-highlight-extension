
**Table of Contents:**

- [Overview](#overview)
- [Usage](#usage)
	- [Setting Up Shortcuts](#setting-up-shortcuts)
	- [Highlighting and Removing Highlights](#highlighting-and-removing-highlights)
	- [Removing All Highlights](#removing-all-highlights)
	- [Navigating Through Highlighted Words](#navigating-through-highlighted-words)
	- [`Quick Highlight` Panel](#quick-highlight-panel)
- [Command List](#command-list)
	- [`QuickHighlight: Toggle highlight`](#quickhighlight-toggle-highlight)
	- [`QuickHighlight: Remove all highlight`](#quickhighlight-remove-all-highlight)
	- [`QuickHighlight: Go to next highlight`](#quickhighlight-go-to-next-highlight)
	- [`QuickHighlight: Go to previous highlight`](#quickhighlight-go-to-previous-highlight)
	- [`QuickHighlight: Toggle Config: Case Sensitivity`](#quickhighlight-toggle-config-case-sensitivity)
	- [`QuickHighlight: Toggle Config: Word Boundary Handling`](#quickhighlight-toggle-config-word-boundary-handling)
- [Config Items](#config-items)
	- [Border Only](#border-only)
	- [Case Insensitive](#case-insensitive)
	- [Automatic Word Boundary Handling](#automatic-word-boundary-handling)

---

# Overview

This extension allows you to highlight selected text in the editor.

The highlights persist until explicitly removed, making this extension useful for temporarily marking words you want to keep in mind.

It was developed with functionality similar to the SublimeText plugin [HighlightWords](https://packagecontrol.io/packages/HighlightWords).


# Usage

## Setting Up Shortcuts

This extension is designed to be used with keyboard shortcuts. Please set up shortcuts first:

1. Open "Preferences" > "Keyboard Shortcuts" (Win: `ctrl` + `k`, `ctrl` + `s` / Mac: `cmd` + `k`, `cmd` + `s`)
2. Search for the command by ID or name:
   - `tettekete.toggle-highlight-word` or `QuickHighlight: Toggle highlight`
3. Assign a key binding


## Highlighting and Removing Highlights

You can highlight or remove highlights of selected text in the editor by:

- Entering the configured shortcut key
- Running `QuickHighlight: Toggle highlight` from the command palette
- Selecting `Quick Highlight` > `Toggle highlight` from the context menu

You can also remove highlights through the `Quick Highlight` panel, as detailed below.


## Removing All Highlights

You can remove all highlights using one of the following methods:

- Open the context menu on highlighted text and select `Remove all highlight`
- Execute `QuickHighlight: Remove all highlight` from the command palette
- Remove highlights via the `Quick Highlight` panel


## Navigating Through Highlighted Words

To navigate through highlighted words, it is essential that the text is either selected or the cursor is positioned within the highlighted text. You can then use one of the following methods to navigate:

- Select `QuickHighlight: Go to next highlight` or `QuickHighlight: Go to previous highlight` from the command palette
- Choose `Go to next highlight` or `Go to previous highlight` from the `Quick Highlight` submenu in the context menu

Additionally, you can navigate by clicking the target word in the `Quick Highlight` panel or by using the respective commands from the context menu.

**Note:**
Navigating through highlighted words requires that the text be highlighted or the cursor be within the highlighted text.


## `Quick Highlight` Panel

In the `Quick Highlight` tab in the bottom panel of VSCode, you can manage highlighted words:

- **Removing Highlights**
  - Click the × button that appears on the right end when you hover over the target text
  - Right-click on the target text line and execute `Remove highlight` from the context menu
- **Removing All Highlights**
  - Click the trash can icon that appears on the right end when you hover over the root node
- **Navigating Highlights**
  - Click on the target word (`Go to next highlight`)
  - Select `Go to ...` from the context menu


# Command List

## `QuickHighlight: Toggle highlight`

**Command ID**: `tettekete.toggle-highlight-word`

Toggles the highlight of the selected text: it removes the highlight if the text is currently highlighted, or highlights it if not.


## `QuickHighlight: Remove all highlight`

**Command ID**: `tettekete.remove-all-highlight`

Removes all highlights.


## `QuickHighlight: Go to next highlight`

**Command ID**: `tettekete.goto-next-highlight`

Moves to the next highlighted word when the cursor is on or selecting a highlighted text.


## `QuickHighlight: Go to previous highlight`

**Command ID**: `tettekete.goto-prev-highlight`

Moves to the previous highlighted word when the cursor is on or selecting a highlighted text.


## `QuickHighlight: Toggle Config: Case Sensitivity`

**Command ID**: `tettekete.toggle-config-case-sensitive`

Toggles the Case Insensitivity setting in the config.

**Note:**
This will not affect already highlighted texts and might make it harder to remove existing highlights. In such cases, use the Quick Highlight panel to remove them.


## `QuickHighlight: Toggle Config: Word Boundary Handling`

**Command ID**: `tettekete.toggle-config-automatic-word-boundary-handling`

Toggles the Automatic Word Boundary Handling setting in the config.

**Note:**
This will not affect already highlighted texts and might make it harder to remove existing highlights. In such cases, use the Quick Highlight panel to remove them.


# Config Items

## Border Only

**Config ID**: `quick-highlight.borderOnly`

Default is OFF.

When enabled, only a border line will highlight the text without changing the background color.


## Case Insensitive

**Config ID**: `quick-highlight.caseInsensitive`

Default is OFF.

When enabled, highlights words regardless of case.


## Automatic Word Boundary Handling

**Config ID**: `quick-highlight.automaticWordBoundaryHandling`

Default is ON. If enabled, for example, when the word `moon` surrounded by spaces or word boundaries is highlighted, it treats `moon` as a separate word, so `moon` in `moonlight` will not be highlighted. However, if you select `moon` in `moonlight`, both instances will be highlighted.
