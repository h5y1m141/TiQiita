# TiQiita

## What's this?

プログラマの技術情報共有サービス の[Qiita](http://qiita.com/) の非公式なiPhoneアプリ。Titanium Mobile(Titanium SDK 2.1.4.GA)にて開発しています


なお、スライドメニュー実装にあたって、[NappSlideMenu Module](https://github.com/viezel/NappSlideMenu)が必要になります。

※NappSlideMenu Moduleのバージョン1.2を利用してます（2013年3月27日時点)


アプリの機能としては下記の通りです

- Qiitaの投稿情報を表示
- Qiitaにストックした情報を表示
- フォローしてるタグの情報を表示
- 投稿情報を、Qiitaにストック and/or はてなブックマークする


## アプリケーション画面イメージ

### 起動時の状態

起動時にまず設定画面を表示します。ここでQiitaと、はてなのアカウント設定を行うことができます。

![起動時の画面](https://s3-ap-northeast-1.amazonaws.com/tiqiita/config.png)

アカウントの設定をしてない状態でも、Qiitaの投稿情報は表示することができます

![メイン画面](https://s3-ap-northeast-1.amazonaws.com/tiqiita/mainWindow.png)

twitter系アプリのように「引っ張って更新」機能があります

![メイン画面](https://s3-ap-northeast-1.amazonaws.com/tiqiita/downloading.png)

### 左上ボタンタッチした時に表示されるメニュー

Qiitaのアカウント設定が完了してる状態で左上のMenuをタッチした時に

- Qiitaにストックした投稿情報を表示するための項目
- Qiitaでフォローしてるタグの情報を表示するための項目

が含まれたメニューが表示されます

![左上ボタンタッチした時のメニュー](https://s3-ap-northeast-1.amazonaws.com/tiqiita/slidemenu.png)


### 投稿情報一覧から、投稿情報詳細を表示した場合

投稿情報画面から、投稿情報の詳細を見るための画面に遷移した時には以下のようになります。

コード自体はシンタックスハイライトされた状態で標示されます

![投稿情報詳細画面](https://s3-ap-northeast-1.amazonaws.com/tiqiita/detail.png)


気になった投稿があった場合に、Qiitaにストックしたり、はてなブックマークすることも可能です

![気になった投稿があった場合ストック可能](https://s3-ap-northeast-1.amazonaws.com/tiqiita/action.png)


## License

The MIT License (MIT)
Copyright (c) 2013 Hiroshi Oyamada

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

