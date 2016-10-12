/**
 * Created by elikr on 10/10/2016.
 */

(function(App, $){
    "use strict";

    App.CollisionDetector = function() {
        this.initialize = function() {
            let BLOCK_W = 64;
            let BLOCK_H = 64;

            let truckX = 63;
            let truckY = 750;
            let pixelMap = [];

            let dataRowColOffset = x+"_"+y;
            let pixel = ctx.getImageData(x,y,resolution,resolution);
            let pixelData = pixel.data;

            pixelMap[dataRowColOffset] = { x:x, y:y, pixelData: pixelData };
        };


        this.hitTest = function(source, target) {
            let hit = false;
            let start = new Date().getTime();

            if(this.boxHitTest(source, target)) {
                if(this.pixelHitTest(source, target)) {
                    hit = true;
                }
            }

            let end = new Date().getTime();

            if(hit == true){
                //console.log('detection took: ' + (end - start) + 'ms');
            }
            return hit;
        };

        this.boxHitTest = function(source, target) {
            return !(
                    ((source.y + source.height) < (target.y)) ||
                    (source.y > (target.y + target.height)) ||
                    ((source.x + source.width) < target.x) ||
                    (source.x > (target.x + target.width))
            );
        };

        this.pixelHitTest = function(source, target) {

            let top = parseInt(Math.max(source.y, target.y));
            let bottom = parseInt(Math.min(source.y+source.height, target.y+target.height));
            let left = parseInt(Math.max(source.x, target.x));
            let right = parseInt(Math.min(source.x+source.width, target.x+target.width));

            for (let y = top; y < bottom; y++) {
                for (let x = left; x < right; x++) {
                    let pixel1 = source.pixelMap.data[ (x - source.x) +"_"+ (y - source.y) ];
                    let pixel2 = target.pixelMap.data[ (x - target.x) +"_"+ (y - target.y) ];

                    if(!pixel1 || !pixel2) {
                        continue;
                    }
                    if (pixel1.pixelData[3] == 255 && pixel2.pixelData[3] == 255) {
                        let canvas = document.getElementById('main-canvas');
                        let context = canvas.getContext("2d");
                        let imageData = context.createImageData(1, 1);
                        let color = [255,0,0,255];
                        imageData.data.set(color);
                        context.putImageData(imageData,(x),(y));
                        return true;
                    }
                }
            }

            return false;
        };

        this.buildPixelMap = function(source) {
            let resolution = 1;
            let ctx = source.getContext("2d");
            let pixelMap = [];

            for(let y = 0; y < source.height; y++) {
                for(let x = 0; x < source.width; x++) {
                    let dataRowColOffset = x+"_"+y;
                    let pixel = ctx.getImageData(x,y,resolution,resolution);
                    let pixelData = pixel.data;

                    pixelMap[dataRowColOffset] = { x:x, y:y, pixelData: pixelData };
                }
            }
            return {
                data: pixelMap,
                resolution: resolution
            };
        };

        this.initialize();

        return {
            hitTest: this.hitTest.bind(this),
            buildPixelMap: this.buildPixelMap.bind(this)
        };
    }
})(namespace('CollisionDetection.Handlers'), jQuery);


(function(App, $){
    "use strict";

    App.Core = function() {
        this.painter = null;
        this.initialize = function(){
            this.expandCanvas();
            this.painter = new App.Render.Painter('#main-canvas');
            this.keypressHandler = new App.Handlers.keypressHandler('#main-canvas');
            this.keypressHandler.addDownCallback('ObjectPicking', this.painter.keydown().bind(this.painter));
            this.image = new App.Items.image(this.painter, this.keypressHandler);
            this.image2 = new App.Items.image2(this.painter, this.keypressHandler);
            this.painter.start();
        };

        this.expandCanvas = function() {
            let canvas = $('#main-canvas');
            let docHeight = $(document.body).innerHeight()-10;
            let docWidth = $(document.body).innerWidth()-10;
            canvas.attr('height', docHeight);
            canvas.attr('width', docWidth);
        };

        this.initialize();

        return {};
    }
})(namespace('CollisionDetection'), jQuery);


(function(CD, jQuery){

    let core = CD.Core;

    $(document).ready(function(){
        let core = new core();
    });

})(namespace('CollisionDetection'), jQuery);