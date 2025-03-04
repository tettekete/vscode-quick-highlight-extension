
<p align="center"><a href="https://tettekete.github.io/vscode-quick-highlight-extension/">English</a> / 日本語</p>

**目次:**

- [概要](#概要)
- [使い方](#使い方)
	- [ショートカットの設定](#ショートカットの設定)
	- [ハイライトする・ハイライトを解除する](#ハイライトするハイライトを解除する)
	- [全てのハイライトを削除する](#全てのハイライトを削除する)
	- [ハイライトワードを巡回する](#ハイライトワードを巡回する)
	- [`Quick Highlight` パネル](#quick-highlight-パネル)
- [コマンド一覧](#コマンド一覧)
	- [`QuickHighlight: Toggle highlight`](#quickhighlight-toggle-highlight)
	- [`QuickHighlight: Remove all highlight`](#quickhighlight-remove-all-highlight)
	- [`QuickHighlight: Go to next highlight`](#quickhighlight-go-to-next-highlight)
	- [`QuickHighlight: Go to previous highlight`](#quickhighlight-go-to-previous-highlight)
	- [`QuickHighlight: Toggle Config: Case Sensitivity`](#quickhighlight-toggle-config-case-sensitivity)
	- [`QuickHighlight: Toggle Config: Word Boundary Handling`](#quickhighlight-toggle-config-word-boundary-handling)
- [コンフィグ項目一覧](#コンフィグ項目一覧)
	- [Border Only](#border-only)
	- [Case Insensitive](#case-insensitive)
	- [Automatic Word Boundary Handling](#automatic-word-boundary-handling)

---

# 概要

選択したテキストをハイライト表示します。

ハイライトは明示的に消すまでハイライトされ続けます。一時的に注意しておきたいワードをハイライトしておくのに便利な機能拡張です。

SublimeText 用プラグイン [HighlightWords](https://packagecontrol.io/packages/HighlightWords) のような機能を目標として開発されました。


# 使い方

## ショートカットの設定

ショートカットキーを設定して使う事を想定した機能拡張です。まずはショートカットの設定を行って下さい。

1. 「Preferences」&gt;「Keyboard Shortcuts」( Win:`ctrl` + `k`,`ctrl` + `s` / mac:`cmd`+`k`,`cmd`+`s`)を開く
2. 次のコマンド ID またはコマンド名でコマンドを検索します
   - `tettekete.toggle-highlight-word` または `QuickHighlight: Toggle highlight`
3. キーバインドを設定する


## ハイライトする・ハイライトを解除する

エディタ上でテキストを選択し、以下のいずれかの方法でハイライト、またはハイライトの解除が出来ます。

- 設定したショートカットキーを入力する
- コマンドパレットから `QuickHighlight: Toggle highlight` を実行する
- コンテキストメニューを開き `Quick Highlight` &gt; `Toggle highlight` を選ぶ

ハイライトの解除については後述する `Quick Highlight` パネルからも実施出来ます。


## 全てのハイライトを削除する

以下のいずれかの方法で全てのハイライトを解除できます。

- ハイライトされたテキスト上でコンテキストメニューを開き `Remove all highlight` を選ぶ
- コマンドパレットから `QuickHighlight: Remove all highlight` を実行する
- 後述する `Quick Highlight` パネルから削除を行う


## ハイライトワードを巡回する

ハイライトワード内にカーソルを移動するか、ハイライトワードを選択した状態で以下のいずれかの方法でハイライトを巡回できます。

- コマンドパレットから `QuickHighlight: Go to next highlight` または `QuickHighlight: Go to previous highlight` を選ぶ
- コンテキストメニューを開き、`Quick Highlight` サブメニューから `Go to next highlight` または `Go to previous highlight` を選ぶ


他、後述する `Quick Highlight` パネルから対象ワードをクリックする（`Go to next highlight`）したり、同コンテキストメニューから巡回用のコマンドを選ぶことでも巡回できます。


## `Quick Highlight` パネル

VSCode 下部パネルをの `Quick Highlight` タブではハイライトワードの管理が可能です。

<div align="center"><img src="https://tettekete.github.io/vscode-quick-highlight-extension/images/panel-ss.png" srcset="https://tettekete.github.io/vscode-quick-highlight-extension/images/panel-ss.png 2x" width="442"></div>

- ハイライトの削除
  - 対象テキストをロールオーバーしたときに現れる右端の × ボタンをクリックする
  - 対象テキスト行で右クリックし、コンテキストメニューから `Remove highlight` を実行する
- 全てのハイライトを削除する
  - ルートノードをロールオーバーしたときに現れる右端のゴミ箱アイコンをクックする
- ハイライトの巡回
  - 対象ワードをクリックする（`Go to next highlight`）
  - コンテキストメニューから `Go to ...` を選ぶ


# コマンド一覧

## `QuickHighlight: Toggle highlight`

**コマンドID**: `tettekete.toggle-highlight-word`

選択中のテキストがハイライトされている場合、ハイライトを解除します。
選択中のテキストがハイライトされていない場合、ハイライト対象にします。


## `QuickHighlight: Remove all highlight`

**コマンドID**: `tettekete.remove-all-highlight`

全てのハイライトを解除します。


## `QuickHighlight: Go to next highlight`

**コマンドID**: `tettekete.goto-next-highlight`

ハイライトテキストを選択しているか、ハイライトテキスト内にカーソルがあるとき、次のハイライトワードへ移動します。


## `QuickHighlight: Go to previous highlight`

**コマンドID**: `tettekete.goto-prev-highlight`

ハイライトテキストを選択しているか、ハイライトテキスト内にカーソルがあるとき、前のハイライトワードへ移動します。


## `QuickHighlight: Toggle Config: Case Sensitivity`

**コマンドID**: `tettekete.toggle-config-case-sensitive`

後述するコンフィグの Case Insensitive 設定をトグル変更します。

Note:
- すでにハイライトされているテキストの設定は変わりません
- ハイライトを特定するための内部 ID も変わるため、すでに生成されているテキストのハイライトが解除しにくくなる場合があります。その場合は Quick Highlight パネルからから解除を行って下さい。


## `QuickHighlight: Toggle Config: Word Boundary Handling`

**コマンドID**: `tettekete.toggle-config-automatic-word-boundary-handling`

後述するコンフィグの Automatic Word Boundary Handling 設定をトグル変更します。

Note:
- すでにハイライトされているテキストの設定は変わりません
- ハイライトを特定するための内部 ID も変わるため、すでに生成されているテキストのハイライトが解除しにくくなる場合があります。その場合は Quick Highlight パネルからから解除を行って下さい。。


# コンフィグ項目一覧

## Border Only

**コンフィグID**: `quick-highlight.borderOnly`

デフォルトは OFF です。

チェックすると背景色は変更せず、ボーダーラインのみによるハイライト表示を行います。


## Case Insensitive

**コンフィグID**: `quick-highlight.caseInsensitive`

デフォルトは OFF です。

チェックすると大文字小文字を無視してマッチしたワードをハイライトします。


## Automatic Word Boundary Handling

**コンフィグID**: `quick-highlight.automaticWordBoundaryHandling`

チェックを外すと通常の検索を行った場合と同じように単純にマッチするテキストをハイライト対象とします。

デフォルトは ON です。この場合、例えばスペース等の単語境界に囲まれた `moon` をハイライト対象とした場合、自動的に独立したワードとしての `moon` と見做します。つまり `moonlight` の中の `moon` はハイライトしません。

逆に `moonlight` の中の `moon` を選択してハイライトを行った場合、`moon` も `moonlight` の中の `moon` もハイライトします。

