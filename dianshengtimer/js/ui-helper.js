// ===== 新UI适配代码 =====

// 更新2D视图显示
function updateCube2DView() {
    const cubeType = document.getElementById('cubeTypeSelect').value;

    // 隐藏所有视图
    const faceContainer3x3 = document.getElementById('face-container-3x3');
    const faceContainerOctaTwin = document.getElementById('face-container-octa-twin');
    const faceContainerOctaCorner = document.getElementById('face-container-octa-corner');
    const faceContainerTwinOctahedron = document.getElementById('face-container-twin-octahedron');

    if (faceContainer3x3) faceContainer3x3.style.display = 'none';
    if (faceContainerOctaTwin) faceContainerOctaTwin.style.display = 'none';
    if (faceContainerOctaCorner) faceContainerOctaCorner.style.display = 'none';
    if (faceContainerTwinOctahedron) faceContainerTwinOctahedron.style.display = 'none';

    // 显示对应视图
    if (cubeType === 'corner' && faceContainer3x3) {
        faceContainer3x3.style.display = 'grid';
    } else if (cubeType === 'octahedron' && faceContainerOctaTwin) {
        faceContainerOctaTwin.style.display = 'grid';
    } else if (cubeType === 'cornerOcta' && faceContainerOctaCorner) {
        faceContainerOctaCorner.style.display = 'grid';
    } else if (cubeType === 'twinOctahedron' && faceContainerTwinOctahedron) {
        faceContainerTwinOctahedron.style.display = 'grid';
    }
}

// 初始化显示
updateCube2DView();