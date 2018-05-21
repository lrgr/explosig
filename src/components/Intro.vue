<template>
    <div>
        <div class="intro-figure">
            <span id="arrow1" class="arrow"></span>
            <span id="arrow2" class="arrow"></span>
            <span id="text1" class="text"><span class="bubble">1</span>Select Signatures and Samples</span>
            <span id="text2" class="text"><span class="bubble">2</span>Add Plots</span>
        </div>
        <div class="intro-text">
            <h3>iMuSE provides interactive visualization and analysis of mutational signatures.</h3>
            <p>To begin, select mutational signatures and somatic mutation data sets of interest. Signatures can be selected based on cancer types in which they are present. Then, visualize by adding plots.</p>
        </div>
    </div>
</template>

<script>

export default {
  name: 'Intro'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../variables.scss';
.intro-text {
    position: absolute;
    top: 60px;
    padding: 0 1rem;
    width: 50%;
    box-sizing: border-box;
}
.intro-figure {
    position: relative;
    width: 100%;
    height: 60vh;
    .arrow {
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 10px 17px 10px;
        border-color: transparent transparent silver transparent;
        position: relative;
        display: inline-block;
        float: right;
        
        &:before {
            content: "";
            width: 3px;
            left: -1.5px;
            background-color: silver;
            position: absolute;
            top: 17px;
        }
        &:after {
            content: "";
            height: 3px;
            right: -1.5px;
            background-color: silver;
            position: absolute;
        }
    }
    #arrow1 {
        right: 6rem;
        &:before {
            height: 100px;
        }
        &:after {
            top: 117px;
            width: 10rem;
        }
    }
    #arrow2 {
        right: 0.8rem;
        &:before {
            height: 164px;
        }
        &:after {
            top: 181px;
            width: 14rem;
        }
    }
    .text {
        display: inline-block;
        right: 17.2rem;
        border: 0px solid black;
        position: absolute;
        text-align: right;
        color: dimgray;
        line-height: 34px;

        .bubble {
            line-height: 34px;
            font-size: 24px;
            margin-right: 10px;
            display: inline-block;
            width: 34px;
            text-align: center;
            border: 1px solid dimgray;
            border-radius: 50%;
            height: 34px;
        }
    }
    #text1 {
        top: 98px;
    }
    #text2 {
        top: 160px;
    }
}
@media (max-width: 1150px) {
  .intro-figure {
      display: none;
  }
  .intro-text {
    width: 100%;
  }
}
</style>
