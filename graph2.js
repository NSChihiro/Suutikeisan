document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("inputForm");
  const splits = document.getElementById("splits");
  const scale = document.getElementById("scale");

  const canvas = document.getElementById("graphCanvas");
  const ctx = canvas.getContext("2d");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const y0 = parseFloat(document.getElementById("y0").value);

    if (isNaN(y0)) {
      alert("初期値 y(0) に数値を入力してください。");
      return;
    }

    const n = parseInt(splits.value);
    scale.textContent = n;

    graph(y0, n);
  });

  splits.addEventListener("input", function () {
    scale.textContent = splits.value;
  });

  function graph(y0, n) {
    const h = 3 / n;  // 時間刻み

    const euler = [];
    let x = 0;
    let y = y0;

    // オイラー法
    for (let i = 0; i < n; i++) {
      euler.push({ x, y });
      y += f(h, x, y);
      x += h;
      euler.push({ x, y });
    }
    x = 0;  // 初期x値
    y = y0;  // 初期y値
    const rk = [];
    for (let i = 0; i < n; i++) {
      rk.push({ x, y });
      // ルンゲ・クッタ法による計算
      const k1 = f(h, x, y);
      const k2 = f(h, (x + h / 2), (y + k1 / 2));
      const k3 = f(h, (x + h / 2), (y + k2 / 2));
      const k4 = f(h, (x + h), (y + k3));
      y += (k1 + 2 * k2 + 2 * k3 + k4) / 6;
      x += h;
      rk.push({ x, y });
    }

    function f(h, x, y) {
      return h * x * y;
    }
    // グラフを描く
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 軸を描画
    ctx.beginPath();
    ctx.strokeStyle = "white";
    for (let i = 0; i <= canvas.width; i += 50) {
      ctx.moveTo(i, 1);
      ctx.lineTo(i, canvas.height);
    }
    for (let i = 0; i <= canvas.height; i += 50) {
      ctx.moveTo(1 - 0, i);
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
    for (let i = 0; i <= canvas.width; i += 50) {
      ctx.moveTo(i, canvas.height - 10);
      ctx.lineTo(i, canvas.height + 10);
      //ctx.fillText(i / 50, i, canvas.height - 15);
    }
    ctx.stroke();
    // Y軸のメモリ
    ctx.beginPath();
    ctx.strokeStyle = "black";
    j = 12;
    for (let i = 0; i <= canvas.height; i += 50) {
      ctx.moveTo(1 - 0, i);
      ctx.lineTo(1 + 10, i);
      ctx.fillText(j, 1 + 20, i);
      j = j - 1;
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(0, canvas.height);
    for (let i = 0; i < euler.length; i++) {
      const coordinates = euler[i];
      const px = coordinates.x * 300;
      const py = canvas.height - coordinates.y * 50;
      ctx.lineTo(px, py);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.moveTo(0, canvas.height);
    for (let i = 0; i < rk.length; i++) {
      const coordinates = rk[i];
      const px = coordinates.x * 300;  // X軸のスケール調整
      const py = canvas.height - coordinates.y * 50;
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
});