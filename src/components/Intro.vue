<template>
    <div class="intro-col-container">
        <Logout class="logout" v-if="isProtected" />
        <div class="intro-col">
            <div class="intro-text">
                <IntroText />
            </div>
        </div>
        <div class="intro-col">
            <div class="intro-figure" v-if="!fromImport">
                <span id="arrow1" class="arrow"></span>
                <span id="arrow2" class="arrow"></span>

                <span id="text1" class="text"><span class="bubble">1</span>Select samples</span>
                <span id="text2" class="text"><span class="bubble">2</span>Select signatures</span>

                <IntroFeatured class="intro-featured" />

            </div>
            <div class="intro-importing" v-if="fromImport">
                <h3 v-if="isImporting">Loading...</h3>
                <div v-if="!isImporting">
                    <h3>ExploSig Analysis <pre>{{ importSlug }}</pre></h3>
                    <p>
                        When loading a previous ExploSig analysis,
                        <ul>
                            <li><button @click="restartImport">restart</button> to step forward through each action, or</li>
                            <li><button @click="resumeImport">resume</button> to begin where the analysis left off.</li>
                        </ul>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import IntroText from './IntroText.vue';
import IntroFeatured from './IntroFeatured.vue';
import Logout from './Logout.vue';

export default {
  name: 'Intro',
  props: ['restartImport', 'resumeImport', 'importSlug'],
  components: {
      IntroText,
      IntroFeatured,
      Logout
  },
  computed: {
      ...mapGetters([
          'bibliography',
          'isImporting',
          'fromImport',
          'isProtected'
      ])
  }
}
</script>

<style scoped lang="scss">

@import './../style/variables.scss';
.intro-col-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    position: relative;
    .intro-col {
        width: 50%;
    }
    .logout {
        position: absolute;
        right: 1rem;
        top: 1rem;
        z-index: 10;
    }
}
.intro-text {
    top: 60px;
    padding: 0 1rem;
    box-sizing: border-box;
}
.intro-importing {
    margin-top: 2rem;
    margin-left: 10%;
    margin-right: 10%;
    margin-bottom: 3rem;
    width: 80%;
    padding: 1rem;
    box-sizing: border-box;
    background-color: $color-lgreen;
    border: 1px solid $color-gray;
    border-radius: 3px;

    h3 {
        margin-top: 0;
    }
}
.intro-figure {
    position: absolute;
    right: 0;
    height: 80vh;
    width: 50%;
    border: 0px solid red;
    .intro-featured {
        margin-top: 250px;
    }
    .arrow {
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 10px 17px 10px;
        border-color: transparent transparent silver transparent;
        position: absolute;
        display: inline-block;
        
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
        right: 18rem;
        &:before {
            height: 100px;
        }
        &:after {
            top: 117px;
            width: 1.3rem;
        }
    }
    #arrow2 {
        right: 12.5rem;
        &:before {
            height: 164px;
        }
        &:after {
            top: 181px;
            width: 6.82rem;
        }
    }
    .text {
        display: inline-block;
        right: 20.2rem;
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
.reference {
    display: flex;
    flex-direction: column wrap;
    margin-bottom: 10px;
    .reference-index {
        padding-right: 10px;
    }
}
@media (max-width: 1150px) {
  .intro-figure {
      display: none;
  }
  .intro-col-container {
      display: block;
      .intro-col {
        width: 100%;
    }
  }
  
}
</style>
