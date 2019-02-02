<template>
    <div class="explosig-animation-container">
        <canvas 
            id="explosig-animation"
            v-show="showAnimation"
            :style="{
                'height': canvasHeight + 'px', 
                'width': canvasWidth + 'px'
            }"
        ></canvas>
    </div>
</template>

<script>
import { select as d3_select } from 'd3-selection';
import { getRetinaRatio } from './../helpers.js';

const mutationColors = [
    '#21BDEC',
    '#000000',
    '#E02C2E',
    '#999999',
    '#A2CD69',
    '#EAC6C5',
];

export default {
    name: 'ExploSig',
    props: ['showAnimation'],
    data() {
        return {
            fps: 15,
            then: null,
            interval: (1000/60),
            numFrames: 75,
            scale: 0.1225,
            config: null,
            ctx: null,
            backgroundColor: "#648381"
        };
    },
    computed: {
        canvasWidth() {
            return this.scale*400;
        },
        canvasHeight() {
            return this.scale*400;
        }
    },
    mounted() {
        const canvas = d3_select("#explosig-animation");
        const context = canvas.node().getContext('2d');

        const ratio = getRetinaRatio(context);
        const scaledWidth = this.canvasWidth * ratio;
        const scaledHeight = this.canvasWidth * ratio;
        canvas
            .attr("width", scaledWidth)
            .attr("height", scaledHeight);
        context.scale(ratio, ratio);

        // Initial translation, prepare to rotate
        context.translate(this.canvasWidth/2, this.canvasHeight/2);
        // Rotate
        context.rotate(20 * Math.PI / 180);
        // Move registration point back to the top left corner of canvas
        context.translate(-this.canvasWidth/2, -this.canvasHeight/2);

        this.ctx = context;

        if(this.showAnimation) {
            this.play();
        }
    },
    watch: {
        showAnimation(val) {
            if(val) {
                this.play();
            }
        }
    },
    methods: {
        play() {
            this.then = Date.now();
            this.config = this.setup();
            this.draw(0);
        },
        setup() {
            const scale = this.scale;

            const width = this.canvasWidth;
            const height = this.canvasHeight;
            // initialize constants
            const cellX = width/2;
            const cellY = width/2;
            const cellRadius = scale*100;
            const mutationRadius = scale*15;
            const numMutations = scale*100;
            const nucleusX = cellX;
            const nucleusY = cellY-(scale*15);
            const nucleusRadius = 4*cellRadius/5;
            
            const startColor = [214, 239, 251];
            const endColor = [187, 161, 140];
            
            // initialize mutation positions
            let mutationPositions = []
            for(let i = 0; i < numMutations; i++) {
                mutationPositions.push(this.getMut(nucleusX, nucleusY, nucleusRadius, mutationRadius));
            }

            return { 
                scale,
                width,
                height,
                cellX,
                cellY,
                cellRadius,
                mutationRadius,
                numMutations,
                nucleusX,
                nucleusY,
                nucleusRadius,
                mutationPositions,
                startColor,
                endColor
            };
        },
        draw(t) {
            const config = this.config;
            const ctx = this.ctx;

            if(config === null || ctx === null || t >= this.numFrames) {
                return;
            }

            window.requestAnimationFrame(() => this.draw(t+1));

            let now = Date.now();
            let delta = now - this.then;
            if(delta > this.interval) {
                this.then = now - (delta % this.interval);
            }

            let scale = config.scale;
            let width = config.width;
            let height = config.height;
            
            let cellX = config.cellX;
            let cellY = config.cellY;
            let cellRadius = config.cellRadius;
            let mutationRadius = config.mutationRadius;
            let numMutations = config.numMutations;
            let nucleusX = config.nucleusX;
            let nucleusY = config.nucleusY;
            let nucleusRadius = config.nucleusRadius;
            
            let startColor = config.startColor;
            let endColor = config.endColor;
            
            // derived constants
            let cellX0 = cellX - cellRadius;
            let cellX1 = cellX + cellRadius;
            
            let cellY0 = cellY - cellRadius;
            let cellY1 = cellY + cellRadius;
            
            let c1offsetX = scale*30; // left control point X offset
            let c2offsetX = scale*-30; // right control point X offset
            
            // fill background
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(0, 0, width, height);
            
            if(t > 50) {
                // Turn transparency on
                ctx.globalAlpha = 1.0 - (Math.min(t, 60) - 50) / 10;
            }

            // bottom arc
            ctx.strokeStyle = "#000";
            let currColor = this.getColor(startColor, endColor, Math.min(t*2, 99));
            ctx.fillStyle = "rgb(" + currColor[0] + "," + currColor[1] + "," + currColor[2] + ")";
            ctx.beginPath();
            ctx.moveTo(cellX0, cellY);
            ctx.bezierCurveTo(cellX0+c1offsetX, cellY+scale*190, cellX1+c2offsetX, cellY+scale*190, cellX1, cellY);
            ctx.fill();
            ctx.stroke();
            // top arc
            ctx.beginPath();
            ctx.moveTo(cellX0, cellY);
            ctx.bezierCurveTo(cellX0-scale*10, cellY0-scale*50, cellX1+scale*10, cellY0-scale*50, cellX1, cellY);
            ctx.fill();
            ctx.stroke();
            
            // nucleus
            ctx.strokeStyle = "#000";
            ctx.fillStyle = "#FFF";
            ctx.moveTo(cellX, cellY);
            ctx.beginPath();
            ctx.arc(nucleusX, nucleusY, nucleusRadius, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();
            
            
            // other organelles
            //  stack of 3 horizontal ellipses on left
            ctx.beginPath();
            ctx.ellipse(cellX-scale*25, cellY+scale*72, scale*36, scale*7, Math.PI*0.05, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();
            
            ctx.beginPath();
            ctx.ellipse(cellX-scale*25, cellY+scale*(72+14+1), scale*36, scale*7, Math.PI*0.05, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();
            
            ctx.beginPath();
            ctx.ellipse(cellX-scale*25, cellY+scale*(72+14+1+14+1), scale*36, scale*7, Math.PI*0.05, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();
            
            // double-stroked vertical ellipse on right
            ctx.beginPath();
            ctx.ellipse(cellX+scale*40, cellY+scale*90, scale*20, scale*30, Math.PI*0.15, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();
            
            ctx.beginPath();
            ctx.ellipse(cellX+scale*40, cellY+scale*90, scale*14, scale*24, Math.PI*0.15, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();
            
            ctx.globalAlpha = 1.0;
            

            // mutations
            if(t <= numMutations) {
                for(let i = 0; i < Math.min(t, numMutations); i++) {
                    ctx.beginPath();
                    ctx.fillStyle = mutationColors[config.mutationPositions[i].mutColorIndex];
                    ctx.arc(config.mutationPositions[i].mutX, config.mutationPositions[i].mutY, mutationRadius, 0, Math.PI*2);
                    ctx.fill();
                    //ctx.stroke();
                }
            } else if(t <= 45) {
                for(let i = 0; i < numMutations; i++) {
                    ctx.beginPath();
                    ctx.fillStyle = mutationColors[config.mutationPositions[i].mutColorIndex];
                    ctx.arc(config.mutationPositions[i].mutX - scale*Math.random()*(t-45), config.mutationPositions[i].mutY - scale*Math.random()*(t-45), mutationRadius, 0, Math.PI*2);
                    ctx.fill();
                    //ctx.stroke();
                }
            } else if(t <= 60){
                
                ctx.globalAlpha = 1.0 - (t - 60) / (74-60);
                
                for(let i = 0; i < numMutations; i++) {
                    ctx.beginPath();
                    ctx.fillStyle = mutationColors[config.mutationPositions[i].mutColorIndex];
                    let mutX = config.mutationPositions[i].mutX + scale*6*(t-40) * Math.cos(config.mutationPositions[i].mutTheta);
                    let mutY = config.mutationPositions[i].mutY + scale*6*(t-40) * Math.sin(config.mutationPositions[i].mutTheta);
                    ctx.arc(mutX, mutY, mutationRadius, 0, Math.PI*2);
                    ctx.fill();
                    //ctx.stroke();
                }
            } else {
                ctx.fillStyle = this.backgroundColor;
                ctx.fillRect(0, 0, width, height);
            }

        },
        getMut(nucleusX, nucleusY, nucleusRadius, mutationRadius) {
            let r = (nucleusRadius-2*mutationRadius) * Math.sqrt(Math.random());
            let mutTheta = Math.random() * 2 * Math.PI;
            let mutX = nucleusX + r * Math.cos(mutTheta);
            let mutY = nucleusY + r * Math.sin(mutTheta);
            let mutColorIndex = Math.floor(Math.random()*6);
            return { mutX, mutY, mutColorIndex, mutTheta };
        },
        getColor(startColor, endColor, t) {
            let getColorComponent = (rgb) => {
                let diff = (99-t)*Math.abs(endColor[rgb] - startColor[rgb]) / 100;
                if(endColor[rgb] > startColor[rgb]) {
                    return endColor[rgb] - diff;
                } else {
                    return endColor[rgb] + diff;
                }
            };
            return [getColorComponent(0), getColorComponent(1), getColorComponent(2)];
        }
    }
}
</script>

<style scoped lang="scss">

@import './../style/variables.scss';
.explosig-animation-container {
    display: inline;
    height: 49px;
    position: relative;
    top: -0.5rem;
    canvas {
        position: absolute;
    }
}

</style>
