// 获取DOM元素
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');
const originalImage = document.getElementById('originalImage');
const compressedImage = document.getElementById('compressedImage');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');

let originalFile = null;

// 处理文件拖放
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#007AFF';
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#d2d2d7';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#d2d2d7';
    const file = e.dataTransfer.files[0];
    handleFile(file);
});

// 处理文件选择
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    handleFile(file);
});

// 处理文件上传
function handleFile(file) {
    if (!file.type.match('image.*')) {
        alert('请上传图片文件！');
        return;
    }

    originalFile = file;
    const reader = new FileReader();
    
    reader.onload = (e) => {
        originalImage.src = e.target.result;
        originalSize.textContent = `文件大小：${formatFileSize(file.size)}`;
        previewContainer.style.display = 'block';
        compressImage(e.target.result, qualitySlider.value / 100);
    };

    reader.readAsDataURL(file);
}

// 压缩图片
function compressImage(base64, quality) {
    const img = new Image();
    img.src = base64;
    
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        compressedImage.src = compressedBase64;
        
        // 计算压缩后的大小
        const compressedSize = Math.round((compressedBase64.length - 'data:image/jpeg;base64,'.length) * 3/4);
        document.getElementById('compressedSize').textContent = `文件大小：${formatFileSize(compressedSize)}`;
    };
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 质量滑块事件
qualitySlider.addEventListener('input', (e) => {
    const quality = e.target.value;
    qualityValue.textContent = quality + '%';
    if (originalImage.src) {
        compressImage(originalImage.src, quality / 100);
    }
});

// 下载按钮事件
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `compressed_${originalFile.name}`;
    link.href = compressedImage.src;
    link.click();
});

// 点击上传区域触发文件选择
dropZone.addEventListener('click', () => {
    fileInput.click();
}); 