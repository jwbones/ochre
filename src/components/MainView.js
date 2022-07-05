import React, { Component } from 'react';

import MainImage from './MainImage.js'
import TranslationBar from './TranslationBar.js'

import translationJson from '../sample_json.json'

const newImage = new CustomEvent('newimage');

class MainView extends React.Component {

    constructor() {
        super();
        this.state = {
            selectedJson: translationJson,
            img_width: 0
        }
    }

    componentDidMount(){
        window.electronAPI.newJson((event, newJson) =>{
            this.setState({
                selectedJson: newJson.blocks,
                img_width: newJson.img_dimensions.width
            })
            console.log('got new json');
            window.dispatchEvent(newImage);
        })
    }

    render () {

        const {selectedJson, img_width} = this.state;

        const rightBlocks = []
        const leftBlocks = []

        selectedJson.forEach((block, i) => {
            if (block.bbox.vertices[0].x > (img_width / 2)) {
                rightBlocks.push({
                    ...block,
                    block_index : i,
                })
            } else {
                leftBlocks.push({
                    ...block,
                    block_index : i,
                })
            }
        })

        return (
            <div style={{height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', overflow: 'hidden', position: 'relative'}}>
                <div style={{float: "left", background: "grey", height: '100vh', overflowY: 'scroll', minWidth: '270px'}}>
                    <TranslationBar blocks={leftBlocks}/>
                </div>
                <div style={{float: "center", flexGrow: '1', background: 'black'}}>
                    <MainImage blocks={selectedJson}/>
                </div>
                <div style={{float: "right", background: "grey", height: '100vh', overflowY: 'scroll', minWidth: '270px'}}>
                    <TranslationBar blocks={rightBlocks}/>
                </div>
            </div>
        )
    }
}

export default MainView