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
    const h = 3 / n;

    const euler_x = [];
    const euler_y = [];
    let x = 0;
    let y = y0;

    euler_x.push(x);
    euler_y.push(y);
    for (let i = 0; i < n; i++) {
      y += f(h, x, y);
      x += h;
      euler_x.push(x);
      euler_y.push(y);
    }
    x = 0;
    y = y0;
    const rk_x = [];
    const rk_y = [];
    rk_x.push(x);
    rk_y.push(y);
    for (let i = 0; i < n; i++) {
      const k1 = f(h, x, y);
      const k2 = f(h, (x + h / 2), (y + k1 / 2));
      const k3 = f(h, (x + h / 2), (y + k2 / 2));
      const k4 = f(h, (x + h), (y + k3));
      y += (k1 + 2 * k2 + 2 * k3 + k4) / 6;
      x += h;
      rk_x.push(x);
      rk_y.push(y);
    }

    function f(h, x, y) {
      return h * x * y;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.font = "15px Arial";
    ctx.fillStyle = "blue";
    ctx.fillText("青はルンゲクッタ法", 660, 15);
    ctx.fillStyle = "red";
    ctx.fillText("赤はオイラー法", 690, 35);
    ctx.moveTo(0, canvas.height - 1);
    ctx.lineTo(canvas.width, canvas.height - 1);
    ctx.moveTo(1, 0);
    ctx.lineTo(1, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.font = "10px Arial";
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvas.width; i += 50) {
      ctx.moveTo(i, canvas.height - 10);
      ctx.lineTo(i, canvas.height + 10);
    }
    ctx.stroke();
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
    for (let i = 0; i < euler_y.length; i++) {
      const coordinates_x = euler_x[i];
      const coordinates_y = euler_y[i];
      const px = coordinates_x * 300;
      const py = canvas.height - coordinates_y * 50;
      ctx.lineTo(px, py);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.moveTo(0, canvas.height);
    for (let i = 0; i < rk_y.length; i++) {
      const coordinates_x = rk_x[i];
      const coordinates_y = rk_y[i];
      const px = coordinates_x * 300;
      const py = canvas.height - coordinates_y * 50;
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
});