import React, { Component } from 'react';

import MainImage from './MainImage.js'
import loading_gif from '../Ajax-loader.gif'
import TranslationBar from './TranslationBar.js'

import translationJson from '../sample_json.json'
import ControlBar from './ControlBar.js';

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
            <div style={{height: '100%'}}>
                <div style={{height: '95%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', overflow: 'hidden', position: 'relative'}}>
                    <div style={{float: "left", background: "#f5f5f5", height: '95vh', overflowY: 'auto', minWidth: '270px'}}>
                        {selectedJson.length == 0 && (<img src={loading_gif} style={{maxWidth: '32px', maxHeight: '32px'}}></img>)}
                        <TranslationBar blocks={leftBlocks}/>
                    </div>
                    <div style={{float: "center", flexGrow: '1', background: '#f5f5f5'}}>
                        <MainImage blocks={selectedJson}/>
                    </div>
                    <div style={{float: "right", background: "#f5f5f5", height: '95vh', overflowY: 'auto', minWidth: '270px'}}>
                        <TranslationBar blocks={rightBlocks}/>
                    </div>
                </div>
                <ControlBar/>
            </div>
        )
    }
}

export default MainView