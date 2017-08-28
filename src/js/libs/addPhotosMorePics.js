/**
 * 添加图片功能
 * 调用 addPhotos($('#addPic1'),$('#uploadFile1'))
 */
// (function(root, factory ) {
//     if ( typeof define === "function" && define.amd ) {
//         define( [ "jquery","fun"], factory );
//     } else if (typeof exports === 'object') {
//         module.exports = factory();
//     } else {
//         root.addPhotosMorePics = factory( jQuery );
//     }
// }(this, function ( $,fun ){


function addPhotosMorePics(el, dom, path, delpath, storage, uploadLen) {
    if (!uploadLen) {
        uploadLen = 5;
    }
    // if(!busId){
    //   busId = ""
    // }
    function handleFileSelect(el, event) {
        var files = event.target.files;

        for (var i = 0, f; f = files[i]; i++) {
            if (f.type && !f.type.match('image.*')) {
                continue;
            }
            var reader = new FileReader(),
                progress = document.querySelector('.percent');

            reader.onloadstart = function(event) {
                $('.textTip').text('处理中...');
            };

            /*reader.onprogress = function(event) {
              if (event.lengthComputable) {
                var percentLoaded = Math.round((event.loaded / event.total) * 100);
                if (percentLoaded < 100) {
                  progress.style.width = percentLoaded + '%';
                  progress.textContent = percentLoaded + '%';
                }
              }
            }*/
            reader.onload = (function(theFile) {
                return function(event) {
                    var size = Math.floor(theFile.size / 1024),
                        ua = navigator.userAgent;
                    //对垃圾手机做特殊处理
                    if (ua.indexOf('xiaomi') > 0 || ua.indexOf('MZ') > 0 || ua.indexOf('MEIZU') > 0 || ua.indexOf('XIAOMI') > 0 || ua.indexOf('MIUI') > 0) {
                        if (size > 1 * 1024) {
                            //fun.alert("上传文件不得超过1M!", null);
                            mui.toast('上传文件不得超过1M', {
                                duration: 'short',
                                type: 'div'
                            })
                            return false;
                        };
                    } else {
                        if (size > 3 * 1024) {
                            //fun.alert("上传文件不得超过3M!", null);
                            mui.toast('上传文件不得超过3M', {
                                duration: 'short',
                                type: 'div'
                            })
                            return false;
                        };
                    }

                    var img = document.createElement('img'),
                        div = document.createElement('div');
                    /*img.width = 60;
                    img.height = 60;*/
                    img.file = theFile;
                    //lrz(img.file, {width: 400}, function (results) {
                    canvasResize(img.file, {
                        width: 750,
                        height: 0,
                        crop: false,
                        quality: 80,
                        rotate: 0,
                        callback: function(results, width, height) {
                            img.className = 'thumb';
                            //console.log(results)
                            img.src = results; //'data:image/' + /*theFile.name.substr(theFile.name.lastIndexOf('.') + 1) + ';base64,' + window.btoa(event.target.result)*/results.base64;
                            div.className = 'photoCut';
                            div.appendChild(img);

                            var del = document.createElement('b');
                            del.className = 'del';

                            var input = document.createElement('input');
                            input.setAttribute("type", "hidden");
                            input.setAttribute("name", "files");
                            input.className = "hideInput";
                            //input.setAttribute("value", results.base64);

                            var section = document.createElement('section');
                            section.appendChild(div);
                            section.appendChild(del);
                            section.appendChild(input);
                            $(section).appendTo(storage.find('.photo-list'));
                            //storage.find('.photo-list').html($(section))
                            //el.css('opacity', '0');
                            //上传图片到服务器
                            var formData = new FormData(document.getElementById("uploadImg"));
                            var input1 = storage.find('.photo-list section').last().find('input');
                            var lastVal = storage.find('.photo-list section').last().find('img');
                            formData.append("data", results);
                            formData.append("length", results.length);
                            formData.append("fileName", theFile.name);
                            formData.append("fileType", theFile.type);
                            // formData.append("weixinToSysId", weixinToSysId);
                            // formData.append("busId", busId);
                            var xhr = new XMLHttpRequest();
                            xhr.onreadystatechange = function(event) {
                                if (xhr.readyState == 4) {
                                    if (xhr.responseText) {
                                        console.log(path)
                                        var data = JSON.parse(xhr.responseText);
                                        input1.val(data.originalFileId);
                                    } else {}
                                }
                            };
                            if (path) {
                                xhr.open('POST', path, true);
                            } else {
                                xhr.open('POST', '/wx_tourism/fileUpload/uploadFile', true);
                            }
                            xhr.send(formData);

                            storage.find('.photo-list').removeClass('hide').addClass('show');
                            if ($('.pic-amounts').length != 0) {

                                storage.find('.pic-amounts b').text(storage.find('.photo-list section').length);

                            }
                            //$('.textTip').text('最多可上传'+uploadLen+'张图片');

                            $('.del').off('tap').on('tap', function() {
                                var self = $(this),
                                    btn = ['是', '否'];

                                if (mui) {
                                    mui.confirm('确定要删除吗？', '提示框', btn, function(e) {

                                        if (e.index == 0) {
                                            var sc = self.parent('section');
                                            var imgId = sc.last().find('input').val();
                                            sc.remove();
                                            if (!delpath) {
                                                delpath = "/wx_tourism/fileUpload/deleteFile";
                                            }
                                            if (imgId != "") {
                                                mui.ajax(delpath, {
                                                    data: {
                                                        delfile: sc.find('input').val()
                                                    },
                                                    dataType: 'json', //服务器返回json格式数据
                                                    type: 'post', //HTTP请求类型
                                                    timeout: 10000, //超时时间设置为10秒；
                                                    //headers:{'Content-Type':'application/json'},                
                                                    success: function(data) {
                                                        console.log('ok')

                                                    }
                                                })

                                            }
                                            if ($('.photo-list section').length <= 0) {
                                                $('.photo-list').removeClass('show').addClass('hide');
                                            }

                                        } else {

                                        }

                                    })

                                } else {
                                    fun.comfirm("确定要删除吗？", function() {
                                        var sc = self.parent('section');
                                        var imgId = sc.last().find('input').val();
                                        sc.remove();
                                        if (!delpath) {
                                            delpath = "/wx_tourism/fileUpload/deleteFile";
                                        }
                                        if (imgId != "") {
                                            $.ajax({
                                                url: delpath,
                                                type: 'post',
                                                data: 'delfile=' + sc.find('input').val(),
                                                dataType: 'json',
                                                success: function() {},
                                                error: function() {}
                                            });
                                        }
                                        if ($('.photo-list section').length <= 0) {
                                            $('.photo-list').removeClass('show').addClass('hide');
                                        }
                                        //storage.find('.pic-amounts b').text(storage.find('.photo-list section').length);

                                    }, null);
                                }
                            });
                        }
                    });
                };
            })(f);

            //data URL
            reader.readAsBinaryString(f);

            if (el.parent('ul').find('li').length == uploadLen) {
                el.hide();

            }

        }

    }

    dom.on("change", function(event) {
        handleFileSelect(el, event);

    });
}
//   return {

//       add : add

//   };
// }));