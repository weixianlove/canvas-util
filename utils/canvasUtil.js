/// 微信小程序 canvas 工具类 
/// designed by 赵勇
var utils = require('./util');


/**
 * @author 赵勇
 * @desc canvas 画纯色背景 （在iOS上不画默认白色，安卓上不画默认是透明色）
 * 
 *  @param ctx canvas上下文
 *  @param color 背景颜色
 *  @param width  背景宽
 *  @param height 背景高
 *  @param x 轴 坐标
 *  @param y 轴 坐标
 *
 */
function drawBackground(ctx, color = 'white', width = 1000, height = 3000, x = 0, y = 0) {
    ctx.rect(x, y, width, height)
    ctx.setFillStyle(color)
    ctx.fill()
}

/**
 * @author 赵勇
 * @desc canvas 画文字
 * 
 *  @param ctx canvas上下文
 *  @param text 需要绘制的文字文字
 *  @param x 轴 坐标
 *  @param y 轴 坐标
 *  @param size 字体大小
 *  @param align 字体对齐方式
 *  @param color 字体颜色
 *  @param baseline 字体基线对齐方式
 *  @param fontWeight 字体粗细
 *
 *  @return 绘制完的 x轴 坐标值
 */
function drawText(ctx, text, x, y, size = '18', align = 'left', color = '#333333', baseline = 'top', fontWeight = 'normal') {
    size = parseInt(size)
    let font = `${fontWeight} ${size}px sans-serif`;
    ctx.font = font;

    ctx.setTextAlign(align);
    ctx.setFillStyle(color);
    ctx.setTextBaseline(baseline);
    ctx.fillText(text, x, y);
    let m = ctx.measureText("" + text)
    return m.width + x;
}



/**
 * @author  赵勇
 * @desc  canvas画文字带换行 单位（px）
 * 
 * @param ctx canvas上下文
 * @param text 需要绘制的文字文字
 * @param x x轴 坐标值    
 * @param y y轴 坐标值
 * @param lineHeight 行高
 * @param maxW  文字最宽值
 * @param align 文字对齐方式
 * @param color 字体颜色
 * @param baseline 字体基线对齐方式
 * @param fontWeight 字体粗细
 *
 * @return 最后一行的底部 y轴 坐标值
 */
function drawBreakText(ctx, text, x, y, size, lineHeight, maxW, align = 'left', color = '#333333', baseline = 'top', fontWeight = 'normal') {
    size = parseInt(size)
    let font = `${fontWeight} ${size}px sans-serif`;
    ctx.font = font;
    ctx.setTextAlign(align);
    ctx.setFillStyle(color);
    ctx.setTextBaseline(baseline);

    let textArr = text.split("");
    const count = textArr.length;
    let tempText = "";
    let row = [];
    for (let i = 0; i < count; i++) {
        if (ctx.measureText(tempText).width < maxW) {
            tempText += textArr[i];
        } else {
            i--;
            row.push(tempText);
            tempText = "";
        }
    }
    row.push(tempText);

    let i = 0;
    for (i; i < row.length; i++) {
        ctx.fillText(row[i], x, y + i * lineHeight, maxW);
    }

    return y + i * lineHeight;
}

/**
 * @author 赵勇
 * @desc canvas 绘制圆角视图
 *
 * @param ctx canvas上下文
 * @param x canvas x轴 坐标
 * @param y canvas y轴 坐标
 * @param w 宽
 * @param h 高
 * @param r 圆角半径
 * @param fill 填充 true  边框 false
 */
function drawRoundRect(ctx, x, y, w, h, r, fill = true) {
    //开始绘制
    ctx.beginPath();
    // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
    // 这里是使用 fill 还是 stroke都可以，二选一即可
    if (fill) {
        ctx.setFillStyle('transparent')
    } else {
        ctx.setStrokeStyle('transparent')
    }

    // 左上角
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

    // border-top
    ctx.lineTo(x + w - r, y)

    // 右上角
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

    // border-right
    ctx.lineTo(x + w, y + h - r)

    // 右下角
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

    // border-bottom
    ctx.lineTo(x + r, y + h)

    // 左下角
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

    // border-left
    ctx.lineTo(x, y + r)

    // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
    if (fill) {
        ctx.fill()
    } else {
        ctx.stroke()
    }

    ctx.closePath()
}

/**
 * @author 赵勇
 * @desc canvas 绘制图  mode:aspectFill 保持比例填充
 *
 * @param ctx canvas上下文
 * @param imagePath 图片url
 * @param sWidth 原图宽
 * @param sHeight 原图高
 * @param dx canvas x轴 坐标
 * @param dy canvas y轴 坐标
 * @param dWidth canvas 宽
 * @param dHeight canvas 高
 */
function drawImageAspectFill(ctx, imagePath, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    //canvas与图片宽高比
    var wRatio = dWidth / sWidth;
    var hRatio = dHeight / sHeight;
    //裁剪图片中间部分
    if (sWidth >= dWidth && sHeight >= dHeight || sWidth <= dWidth && sHeight <= dHeight) {
        if (wRatio > hRatio) {
            ctx.drawImage(imagePath, 0, (sHeight - dHeight / wRatio) / 2, sWidth, dHeight / wRatio, dx, dy, dWidth, dHeight);
        } else {
            ctx.drawImage(imagePath, (sWidth - dWidth / hRatio) / 2, 0, dWidth / hRatio, sHeight, dx, dy, dWidth, dHeight);
        }
    }
    //拉伸图片
    else {
        if (sWidth <= dWidth) {
            ctx.drawImage(imagePath, 0, (sHeight - dHeight / wRatio) / 2, sWidth, dHeight / wRatio, dx, dy, dWidth, dHeight);
        } else {
            ctx.drawImage(imagePath, (sWidth - dWidth / hRatio) / 2, 0, dWidth / hRatio, sHeight, dx, dy, dWidth, dHeight);
        }
    }
}

/**
 * @author 赵勇
 * @desc canvas 绘制圆角图  mode:aspectFill 保持比例填充
 *
 * @param ctx canvas上下文
 * @param imagePath 图片url
 * @param sWidth 原图宽
 * @param sHeight 原图高
 * @param dx canvas x轴 坐标
 * @param dy canvas y轴 坐标
 * @param dWidth canvas 宽
 * @param dHeight canvas 高
 * @param radius 圆角半径
 */
function drawImageAspectFillWidthCorner(ctx, imagePath, sWidth, sHeight, dx, dy, dWidth, dHeight, radius = 0) {
    ctx.save();
    drawRoundRect(ctx, dx, dy, dWidth, dHeight, radius);
    // 剪切
    ctx.clip()
    drawImageAspectFill(ctx, imagePath, sWidth, sHeight, dx, dy, dWidth, dHeight);
    ctx.restore();
}

/**
 * @author 赵勇
 * @desc 下载图片数组
 *
 * @param images 图片url数组
 * @param success 成功回调
 * 
 */
function downloadImages(images, success, info = [], i = 0) {
    const wxGetImageInfo = utils.wxPromisify(wx.getImageInfo);
    wxGetImageInfo({
        src: images[i]
    }).then(res => {
        info = [...info, res];
        i++;
        if (i < images.length) {
            downloadImages(images, success, info, i);
        } else {
            success(info);
        }
    }).catch(err => {
        console.log(err)

    })
}


//导出
module.exports = {
    drawText: drawText,
    drawBreakText: drawBreakText,
    drawBackground: drawBackground,
    drawImageAspectFill: drawImageAspectFill,
    drawImageAspectFillWidthCorner: drawImageAspectFillWidthCorner,
    downloadImages: downloadImages,
}