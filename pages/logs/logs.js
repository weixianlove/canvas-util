//logs.js
const canvasUtil = require('../../utils/canvasUtil.js')
const utils = require('../../utils/util.js')

var app = getApp();

Page({
  data: {
    canvasShow: false,
    images: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1541052598046&di=ec05a220efe5a8f713775c831a3c5133&imgtype=0&src=http%3A%2F%2Fg.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F5243fbf2b211931376d158d568380cd790238dc1.jpg','https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1541052598046&di=f31f0005f6c60abdd5108d90f66f8347&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Fb999a9014c086e064a76b12f0f087bf40bd1cbfc.jpg']
  },
  
  onLoad: function (options){
    // 请求网络数据
    // 页面布局
  },

  /**
   * 保存： 1.获取保存图片权限 2.获取图片数据 3.draw canvas 4.保存至相册
   * 
   * （还有另一种流程：1.获取图片数据 2.draw canvas 3.展示canvas画出的图片 4.获取保存图片权限 5.保存至相册）
   */
  saveAction: function() {
    //获取保存至图库的权限
    const wxGetSetting = utils.wxPromisify(wx.getSetting);
    wxGetSetting().then(res => {
      if (!res.authSetting['scope.writePhotosAlbum']) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success: () => {
            this.getImagesInfo()
          },
          fail: () => {
            this.setData({
              openType: 'openSetting'
            })
          }
        })
      } else {
        this.getImagesInfo()
      }
    }).catch((res) => {
      console.log(res);
    })
  },

  /**
   * 获取图片数据
   */
  getImagesInfo: function () {
    wx.showLoading({
      title: '正在生成海报',
      mask: true
    })

    //单张图片 或 固定张数图片
    // const wxGetImageInfo = utils.wxPromisify(wx.getImageInfo);
    //
    // wxGetImageInfo({
    //   src: ''
    // }).then(res => {
    //   this.drawPage(res)
    // }).catch(err => {
    //   this.showError(err);
    // })

    //不固定张数图片数组
    canvasUtil.downloadImages(this.data.images,
      (res) => {
        this.drawPage(res)
      });
  },

  /**
   * 画 canvas
   */
  drawPage: function (images) {
    this.setData({
      canvasShow: true,
      screenWidth: app.toPx(750),
      screenHeight: app.toPx(2000) //这里写个大概，最终可以截取部分
    })

    //上下文
    const ctx = wx.createCanvasContext('shareCanvas');
    
    //(有默认值的都可以省略，如果默认值和需求不一样，不能跳属性设置，希望有知道怎么解决的可以通知我)

    //背景色  
    canvasUtil.drawBackground(ctx);

    //标题居中加粗
    canvasUtil.drawText(ctx, 'Canvas 简易工具类 Demo', app.toPx(375), app.toPx(20), app.toPx(40), 'center', '#333', 'top', 'bold');
    
    //图片缩放 aspectfill 模式 一般在app里面我都使用这个模式，如有其它需要请联系我
    canvasUtil.drawImageAspectFill(ctx, images[0].path, images[0].width, images[0].height, app.toPx(50), app.toPx(100), app.toPx(650), app.toPx(200));

    //换行文字 
    let text = '我不是懒，我是享受不作为😂😂😂                                                                                                ----韦弦Zhy'
    canvasUtil.drawBreakText(ctx, text, app.toPx(50), app.toPx(350), app.toPx(38), app.toPx(40), app.toPx(650), 'left', '#999999', 'top', 'bold');

    //圆角图片
    canvasUtil.drawImageAspectFillWidthCorner(ctx, images[0].path, images[0].width, images[0].height, app.toPx(50), app.toPx(450), app.toPx(650), app.toPx(650), app.toPx(325));
    canvasUtil.drawImageAspectFillWidthCorner(ctx, images[1].path, images[1].width, images[1].height, app.toPx(50), app.toPx(1150), app.toPx(650), app.toPx(500), app.toPx(50));


    //高度可动态设置  
    this.saveToPhotosAlbum(ctx, app.toPx(1700));
  },

  showError: function (err) {
    console.log(err)
    wx.hideLoading();
    wx.showToast({
      icon: 'none',
      title: '生成海报失败'
    })
  },

  /**
   * 生成图片并保存至相册
   */
  saveToPhotosAlbum: function (ctx, height) {
    ctx.draw(false, () => {
      const wxCanvasToTempFilePath = utils.wxPromisify(wx.canvasToTempFilePath);
      wxCanvasToTempFilePath({
        canvasId: 'shareCanvas',
        fileType: 'jpg',
        quality: 1,
        height: height
      }).then(res => {
        const wxSaveImageToPhotosAlbum = utils.wxPromisify(wx.saveImageToPhotosAlbum)
        return wxSaveImageToPhotosAlbum({
          filePath: res.tempFilePath
        }).then(() => {
          wx.hideLoading();
          wx.showToast({
            icon: 'success',
            title: '已保存至相册'
          })
          this.setData({
            canvasShow: false
          })
        }).catch(() => {
          this.showError();
          this.setData({
            canvasShow: false
          })
        })
      });
    })

  },


})
