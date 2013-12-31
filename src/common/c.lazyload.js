/*
 * 延迟加载图片
 */
define(['libs'], function (libs) {
    var L = {};
    L.lazyload = function (img, onStart, onError, onComplete) {
        img = $(img),
        noImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAYCAMAAAAGTsm6AAAAMFBMVEXy8vL6+vr+/v7+/v7+/v7v7+/+/v7+/v7+/v7+/v7+/v729vb+/v4AAADt7e3+/v673auIAAAADnRSTlPXrYhVZuwimTMRRMJ3AKjyf0QAAAH3SURBVHjaxdbZkqowGEXhzMM/ZL//2x6IEYh0Cd1addaFUhbJZyKKRv9TZ1iSHirpU6Gme3BB888h3kXwj8PLePZCc0F0lNn1Z0Irl3AQYVhZYnVYY/Zj+Nxze/Aa64ghYyRfrHieZ4Gz398qRV6KiNyL24AsS06e/RGuKqBKpJrWI31NIDo1Tsrt+foR9tfwLresBLcerYvplUu4oMlamGH6BWwXjREZIMGIruBq9jP/Co8pmLmsc9IC1ao6TXaCM0xfttUZnqO3MAkVgjwGaofXklDPQGgUaMA1Q0zW0kx9gQ0fK29hTUQCzuwqzA4TzslzxeJWtbszTPd/uTweNQ4C2eFiZc0hCoP7cQ6HqzpZwPoZbkj34RpZHmRlpAHveeT5+upwChlNpKFZKTsM6CU8Rxz6KvrGT59MRjjDDDRXlnNdQ6xHWLbSDZg4yxa7+UuOeoZTDrU22OUx+H2rCw7RHRiRt8A6KVbP8INxETJ9xgRDI3MPPk48wamBfoZJimqYr2rBtlv82YqrAesGU647nIHoyvxWI/yH8O62tMOCdvw6iQHsESag7vAHW+3buJ9LB0qE3eAe5XAcEZH1Cyv2jO52auSf9+OpMSID6RtwALiOLbdY4/DuH0jq1/gnWx3HgXTnnH2dE20M0F/DQvrlClU99Q/TJ4uko/HGBAAAAABJRU5ErkJggg==',
        loadImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAYCAMAAAAGTsm6AAAAMFBMVEX6+vr+/v7+/v7+/v7+/v7+/v7+/v7+/v7y8vLv7+/+/v729vb+/v4AAADt7e3+/v6c4gmbAAAADnRSTlOtM4hmVZkiEdfsRMJ3AHDRYrYAAAGwSURBVHjaxdbZktsgEAVQLSxNL9z//9vQgvFYUjKpkqnkPhgJbI4bJMuL/af8DGeS8IcRZm+Shnwb21U/hQ1Ivx9gLL0pDbqMKbYJsN2TDlGPuiF3RzGhYrJ7FF9Rh42wT4VTbrD40WqBxEM89lAjpL2GA15j7h/gdIIzp0fwd2FijB62ER6TO/zdd40+g0kEVYQgw5EDbn3eWcRznEhFh6t4yhgrz+BXQYztDBfpucNyWmr9GNYTfCTSflrqyXDyO0Wv8OoDlH3cCpmRptmwe3cYr0jrsgzwv4EXXRAX2VTVInJAnL7UCvaXcNnjXGI7zuMdG/gLLuoRSG+fw7HDfIYTFWZCUGVboaXMvY89BNevML1PXIH9BRN7ImJvH8MJ5NwVDqqBCTwWpdjIftnjXfaHsGK7wyMCS9wmVtdmP50K+CCS8fFzVY/zxKwaa19qBlqn5qmwooxn8gkO6NmU01org3KpM2GG30cqqHa5uLad27F/h4q1OcAyEc7Fp8teWhMGHN73OG/9io7evGX78K9PjtkBcZLVa105ve2/2V5CLzHaewTyAJ6QlVf7a34BIRiNTVIrVfEAAAAASUVORK5CYII=',
        errorImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAYCAMAAAAGTsm6AAAAMFBMVEX6+vr+/v7+/v7+/v7+/v7+/v7+/v7y8vLv7+/+/v7+/v7+/v729vYAAADt7e3+/v6PQhf9AAAADnRSTlOtVTOIZpki1+wRd0TCAMJ8iPYAAAKfSURBVHjaxZWLjqMwDEXJO7FN7v//7WITOgQ6pVpptbdSecTxiW3iLOt/0g3cirj3po1ZL5lcuw8Sud8QgegJbALy+laMZb/UdY2n9Xj9F/wKFnwLXu/KRiSLG7ISwk+s6Fm9n9PgZUjNKvJ34LLeRThECl4L4ssDyMKak7NLTRvKc41z28Bia15dEVWxwkYiShAicgb26QiwAY6ZC1gV4wCTXdXUjey09gFMOCSvVSv46u2kiEnyMm3DNGGIP4GLCLpIgQyOmD266MsqKnuQPnJbkWhTBalSeIEFycAdZi3in2osOjHM4CqmO5i0gvcaG9ipr4gyDT+BaQKbUom3VLc6xqXewaymBfQdOOu3QFew14HSbGPVLYRCediPBHZ5D2b0bOt6BBvvBsZLoqtvGIEGCWRCJVOQOIEFVpMqfwleaEFajLImNId0dKWb6AXWqrQg8NvN8ggmJRHcBNZiJu1OwyIclY8UWZUAxyoinsBqHtcMegSnHcwzOJfKXODUrwfVa8lq7z+uZ7Dboo3gR3CB0q/gcs5kB+I8KSKlnmdwrTu4AXnpj706j213ATvtlQU8knIJ2HdkRjmfoLkplL0ikJAewYTwDnw0icxRbeRyhCPoaGpTEiiGdpwY+RFcDSSbJVu76vacmYlS31PN1nfpRfHVdnjuqPHcWfS919ttoD2BCXWcyRPYYVcgzr533ki1DwLBuJZw9ERsD0mPCUH3+nr7xc9ghu4jEvT18nGFyHvfcx3eTjGbyaEDMuLJgvG+JRTz3pmA1ApQQ/4d3KpOaxraRhhgd65xC0C0gOyiHs/7iBcrZ65HElKFuQkAPp1OLTUFiNoysU7lfKr/usa6L4TS0Vfm8uVoo8q17Y/KdseyXFP9T9VOn9s88gcLTIlzurC4gAAAAABJRU5ErkJggg==';
        img.each(function () {
            var el = $(this),
                src = el.attr('src'),
                newImg = $(new Image());
            // 修复图片版本号导致的不能显示问题 shbzhang 2013/12/12
            //if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/i.test(src)) src = '';

            el.addClass('cui-item-imgbg');
            if (typeof src == 'string' && src.length > 0) {
                el.attr('src', loadImg);
                newImg.bind('error', function () {
                    el.attr('src', errorImg);
                });
                newImg.bind('load', function () {
                    el.attr('src', src);
                    el.removeClass('cui-item-imgbg');
                });
                newImg.attr('src', src);
            }
            else {
                el.attr('src', noImg);

            }
        });
    };
    return L;
});


//define(['libs'], function (libs) {
//    var L = {};
//    L.lazyload = function (img, onStart, onError, onComplete) {
//        var img = $(img);
//        img.each(function () {
//            var img = this,
//                src = this.src,
//                newImg = $(new Image());
//            onStart.call(this, this);
//            newImg.bind('load', function () {
//                img.src = src;
//                onComplete && onComplete.call(img, img);
//            });
//            newImg.bind('error', function () {
//                onError && onError.call(img, img);
//            });
//            newImg.attr('src', src);

//        });
//    };
//    return L;
//});
