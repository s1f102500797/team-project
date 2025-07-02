document.addEventListener('DOMContentLoaded', () => {
    const svg = document.getElementById('radar-chart3');
    const centerX = 150; // SVGの中心X座標
    const centerY = 150; // SVGの中心Y座標
    const maxRadius = 80; // レーダーチャートの最大半径（五角形の頂点までの距離）

    const labels = ["味の不味さ", "価格", "食べにくさ", "見た目の不味さ", "カロリー"];
    const data = [80, 85, 60, 90, 40]; // 各項目の値 (0-100)

    // 各軸の角度を計算 (90度から開始し時計回り)
    // 五角形の各頂点の角度と同じになります
    const angles = labels.map((_, i) => Math.PI / 2 + (Math.PI * 2 / 5) * i);

    // ヘルパー関数: SVG要素を簡単に作成
    function createSVGElement(tag, attributes) {
        const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
        for (const key in attributes) {
            if (key === 'textContent') {
                el.textContent = attributes[key];
            } else {
                el.setAttribute(key, attributes[key]);
            }
        }
        return el;
    }

    // --- 背景の五角形グリッドと軸 ---

    // グリッドの五角形を描画
    const numLevels = 4; // グリッドのレベル数 (外枠を含む)
    for (let i = 1; i <= numLevels; i++) {
        const currentRadius = (maxRadius / numLevels) * i;
        const polygonPoints = angles.map(angle => {
            const x = centerX + Math.cos(angle) * currentRadius;
            const y = centerY - Math.sin(angle) * currentRadius;
            return `${x},${y}`;
        }).join(' ');
        
        // 最後のレベル（外枠）は太く、それ以外は細い破線
        const className = (i === numLevels) ? 'radar-outer-frame' : 'radar-grid-polygon';
        svg.appendChild(createSVGElement('polygon', { points: polygonPoints, class: className }));
    }

    // 各軸を描画
    angles.forEach(angle => {
        const x = centerX + Math.cos(angle) * maxRadius;
        const y = centerY - Math.sin(angle) * maxRadius;
        svg.appendChild(createSVGElement('line', { x1: centerX, y1: centerY, x2: x, y2: y, class: 'radar-axis' }));
    });

    // --- データの多角形 ---
    const dataPoints = data.map((value, i) => {
        const normalizedValue = (value / 100) * maxRadius;
        const x = centerX + Math.cos(angles[i]) * normalizedValue;
        const y = centerY - Math.sin(angles[i]) * normalizedValue;
        return `${x},${y}`;
    }).join(' ');
    svg.appendChild(createSVGElement('polygon', { points: dataPoints, class: 'radar-data-polygon' }));

    // --- 項目名 ---
    const labelOffset = 30; // ラベルと外枠の距離
    labels.forEach((label, i) => {
        const angle = angles[i];
        const x = centerX + Math.cos(angle) * (maxRadius + labelOffset);
        const y = centerY - Math.sin(angle) * (maxRadius + labelOffset);

        const textAnchor = (angle > Math.PI / 2 && angle < Math.PI * 3 / 2) ? 'end' : 'start';
        // Y軸方向の微調整
        let dyOffset = '0.35em'; // 汎用的な中央揃え
        if (angle === Math.PI / 2) { // 真上
             dyOffset = "-0.5em";
        } else if (angle === Math.PI * 3 / 2) { // 真下
            dyOffset = "1em";
        }

        svg.appendChild(createSVGElement('text', { x: x, y: y, 'text-anchor': textAnchor, dy: dyOffset, class: 'radar-label', textContent: label }));
    });
});