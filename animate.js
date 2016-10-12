/**
 * Created by elikr on 10/10/2016.
 */

let Animate = function (animationDelay, animationIndexCounter, animationCurrentFrame)
{
    this.animationDelay = animationDelay;
    this.animationIndexCounter = animationIndexCounter;
    this.animationCurrentFrame = animationCurrentFrame;
};

let AnimationCounterIndex = 0;
let AnimationCounter = new Array();

function InitializeAnimationCounters()
{
    for (let i = 0; i < 32000; i++) {
        AnimationCounter[i] = new Animate(0, 0, 0);
    }
}

function ResetAnimationCounter()
{
    AnimationCounterIndex = 0;
}
