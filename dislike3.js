document.addEventListener('DOMContentLoaded', () => {
    const svg = document.getElementById('radar-chart3');
    const centerX = 200; 
    const centerY = 200; 
    const maxRadius = 150; 

    const labels = ["味の不味さ", "価格", "食べにくさ", "見た目の不味さ", "カロリー"];
    const data = [80, 85, 60, 90, 40]; 
    
    const angles = labels.map((_, i) => Math.PI / 2 + (Math.PI * 2 / 5) * i);

    
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


    
    const numLevels = 4; 
    for (let i = 1; i <= numLevels; i++) {
        const currentRadius = (maxRadius / numLevels) * i;
        const polygonPoints = angles.map(angle => {
            const x = centerX + Math.cos(angle) * currentRadius;
            const y = centerY - Math.sin(angle) * currentRadius;
            return `${x},${y}`;
        }).join(' ');
        

        const className = (i === numLevels) ? 'radar-outer-frame' : 'radar-grid-polygon';
        svg.appendChild(createSVGElement('polygon', { points: polygonPoints, class: className }));
    }

    
    angles.forEach(angle => {
        const x = centerX + Math.cos(angle) * maxRadius;
        const y = centerY - Math.sin(angle) * maxRadius;
        svg.appendChild(createSVGElement('line', { x1: centerX, y1: centerY, x2: x, y2: y, class: 'radar-axis' }));
    });

    
    const dataPoints = data.map((value, i) => {
        const normalizedValue = (value / 100) * maxRadius;
        const x = centerX + Math.cos(angles[i]) * normalizedValue;
        const y = centerY - Math.sin(angles[i]) * normalizedValue;
        return `${x},${y}`;
    }).join(' ');
    svg.appendChild(createSVGElement('polygon', { points: dataPoints, class: 'radar-data-polygon' }));


    const labelOffset = 30; 
    labels.forEach((label, i) => {
        const angle = angles[i];
        const x = centerX + Math.cos(angle) * (maxRadius + labelOffset);
        const y = centerY - Math.sin(angle) * (maxRadius + labelOffset);

        const textAnchor = (angle > Math.PI / 2 && angle < Math.PI * 3 / 2) ? 'end' : 'start';
    
        let dyOffset = '0.35em'; 
        if (angle === Math.PI / 2) { 
             dyOffset = "-0.5em";
        } else if (angle === Math.PI * 3 / 2) { 
            dyOffset = "1em";
        }

        svg.appendChild(createSVGElement('text', { x: x, y: y, 'text-anchor': textAnchor, dy: dyOffset, class: 'radar-label', textContent: label }));
    });
});