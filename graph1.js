document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("inputForm");
  //HTMLのid、splitsを受け取る
  const splits = document.getElementById("splits");
  //HTMLのid、scaleを受け取る
  const scale = document.getElementById("scale");
  //HTMLのCanvasを受け取る
  const canvas = document.getElementById("graphCanvas");
  const ctx = canvas.getContext("2d");

  //ページのリロードを阻止
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    //文字列を数値に変換、数値以外だとNanが入る、parseFloatのほうが応用が利くようだがよくわからないのでnumber
    const y0 = Number(document.getElementById("y0").value);

    //数値以外が入った場合もしくは空の時に警告を出す
    if (isNaN(y0)) {
      alert("初期値 y(0) に数値を入力してください。");
      return;
    }

    //上と同じく文字列を数値へ
    const n = Number(splits.value);
    scale.textContent = n;
    //graph関数へy0,nを渡す
    graph(y0, n);
  });

  //HTMLの<input>が動作したとき呼び出し
  splits.addEventListener("input", function () {
    //スライダーを動かした後動かした先の数値に更新する
    scale.textContent = splits.value;
  });

  //計算を行っている、レポートで説明済み
  function graph(y0, n) {
    const h = 16 / n; // xの範囲0から16,16をh等分したうちの一つの長さ

    //オイラー法で計算した結果を入れる配列
    const euler = [];
    //初期値
    let x = 0;
    let y = y0;
    // オイラー法
    for (let i = 0; i < n; i++) {
      //配列に数値を代入
      euler.push({ x, y });
      //関数fで計算
      y += f(h, y);
      x += h;
      euler.push({ x, y });
    }
    //初期値
    x = 0;
    y = y0;
    //ルンゲクッタ法で計算した結果を入れる配列
    const rk = [];
    for (let i = 0; i < n; i++) {
      rk.push({ x, y });
      // ルンゲ・クッタ法
      const k1 = f(h, y);
      const k2 = f(h, (y + k1 / 2));
      const k3 = f(h, (y + k2 / 2));
      const k4 = f(h, (y + k3));
      y += (k1 + 2 * k2 + 2 * k3 + k4) / 6;
      x += h;
      rk.push({ x, y });
    }

    //数式の計算を行う
    function f(h, y) {
      return h * 1 / y;
    }
    // グラフを描く

    /*canvasの座標と計算で求まった座標の数値の関係は50:1になるようにcanvasの大きさを設定している
    そのため求めた数値に50を掛けるとcanvasの座標に変換することができる
    表示されているメモリの1メモリも50である*/

    //前回描画したグラフをリセットする
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 背景の白い軸を描画している
    ctx.beginPath();
    ctx.strokeStyle = "white";
    //1メモリはcanvas上では50なので50置きにcanvasの幅までiを増加
    for (let i = 0; i <= canvas.width; i += 50) {
      //線を引く開始位置を指定
      ctx.moveTo(i, 1);
      //moveToで指定した位置から終点座標まで線を引く
      ctx.lineTo(i, canvas.height);
    }
    //1メモリはcanvas常では50なので50置きにcanvasの高さまでiを増加
    for (let i = 0; i <= canvas.height; i += 50) {
      //線を引く開始位置を指定
      ctx.moveTo(1 - 0, i);
      //moveToで指定した位置から終点座標まで線を引く
      ctx.lineTo(canvas.width, i);
    }
    ctx.stroke();
    ctx.beginPath();
    //線の色を黒に
    ctx.strokeStyle = "black";
    //グラフの軸の線の太さを3にする
    ctx.lineWidth = 3;
    //文字のサイズとフォントを指定、サイズのみ指定したいが単体で変える方法がわからなかった
    ctx.font = "15px Arial";
    //文字の色を青に設定
    ctx.fillStyle = "blue";
    //文字を座標660、15に配置
    ctx.fillText("青はルンゲクッタ法", 660, 15);
    //文字の色を赤に設定
    ctx.fillStyle = "red";
    //文字を座標690、35に配置
    ctx.fillText("赤はオイラー法", 690, 35);
    //y軸を0からcanvasの高さまで描画
    ctx.moveTo(0, canvas.height - 1);
    ctx.lineTo(canvas.width, canvas.height - 1);
    //x軸を0からcanvasの高さまで描画
    ctx.moveTo(1, 0);
    ctx.lineTo(1, canvas.height);
    ctx.stroke();
    // X軸のメモリ
    ctx.beginPath();
    //フォントサイズを10pxに設定
    ctx.font = "10px Arial";
    //フォントの色を黒に設定
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    //x軸のメモリと数値を描画。上と同じく1メモリはcanvas上では50なので50置きにcanvasの幅までiを増加
    for (let i = 0; i <= canvas.width; i += 50) {
      //メモリを描画する開始座標を設定
      ctx.moveTo(i, canvas.height - 10);
      //moveTo是指定した座標からメモリを描画する終点座標を設定
      ctx.lineTo(i, canvas.height + 10);
      //iはcanvasの座標なので数式の座標に変換したかったら50を掛ければいい、変換した数値を指定した座標に表示
      ctx.fillText(i / 50, i, canvas.height - 15);
    }
    ctx.stroke();
    // Y軸のメモリ
    ctx.beginPath();
    ctx.strokeStyle = "black";
    /*canvasの高さは上が0で下に向かって高さが増えていく、そのためグラフの上から下に数値が表示されていき
    x軸と同じ方法だと逆向きに数値がカウントされてしまう、そのため変数jを作成し12から1ずつ表示する数値を
    変更することで無理やりメモリを書いている*/
    let j = 12;
    //y軸のメモリと数値を描画、上と同じく1メモリはcanvas上では50なので50置きにcanvasの幅までiを増加
    for (let i = 0; i <= canvas.height; i += 50) {
      //メモリを描画する開始座標を設定
      ctx.moveTo(1 - 0, i);
      //moveTo是指定した座標からメモリを描画する終点座標を設定
      ctx.lineTo(1 + 10, i);
      //上記の通り数値jを指定した座標に表示
      ctx.fillText(j, 1 + 20, i);
      j = j - 1;
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = "red";
    //オイラー法グラフの初期値を設定
    ctx.moveTo(0, canvas.height);
    for (let i = 0; i < euler.length; i++) {
      //coordinates=座標。オイラー配列を変数coordinatesへ
      const coordinates = euler[i];
      // 配列の数値を50倍しcanvasとx軸のスケールを合わせる
      const px = coordinates.x * 50;
      // 配列の数値を50倍しcanvasとy軸のスケールを合わせる、先述した通り高さは逆向きに座標が増えるのでそれに合わせて計算も変更している
      const py = canvas.height - coordinates.y * 50;
      //求めた座標を描画する
      ctx.lineTo(px, py);
    }
    /*forEachを使っても動きそう
    euler.forEach(coordinates => {
    const px = coordinates.x * 50;
    const py = canvas.height - coordinates.y * 50;
    ctx.lineTo(px, py);
    });*/
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    //ルンゲクッタ法グラフの初期値を設定
    ctx.moveTo(0, canvas.height);
    for (let i = 0; i < rk.length; i++) {
      //coordinates=座標。ルンゲクッタ配列を変数coordinatesへ
      const coordinates = rk[i];
      // 配列の数値を50倍しcanvasとx軸のスケールを合わせる
      const px = coordinates.x * 50;
      // 配列の数値を50倍しcanvasとy軸のスケールを合わせる,先述した通り高さは逆向きに座標が増えるのでそれに合わせて計算も変更している
      const py = canvas.height - coordinates.y * 50;
      //求めた座標を描画する
      ctx.lineTo(px, py);
    }
    /*
    rk.forEach(coordinates => {
      const px = coordinates.x * 50;
      const py = canvas.height - coordinates.y * 50;
      ctx.lineTo(px, py);
    });*/
    ctx.stroke();
  }
});