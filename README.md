## Post draft

One of the most frequently asked questions we get is when would Angular be a poor choice to use as a framework. Our default answer is usually when writing games as Angular has it's own event loop handling (the `$digest` loop) and games usually require heavy DOM manipulation. This is a quite inaccurate description of it's limitations however, because there are _many_ games that Angular is a great framework to build. 

If you are anything like me (and the rest of Silicon Valley), you may 


## Troubleshooting

If you're having trouble doing an `npm install`, make sure you have a recent version of node.js and `npm`. 

This repo was tested on node `v0.10.26` and `npm` `1.4.3`.

Here's a nice way to get a recent version of node using the `n` node version manager:

    sudo npm cache clean -f
    sudo npm install -g n
    sudo n stable

