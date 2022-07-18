import React, { Component } from 'react';

import defaultImg from '../ochre.png';

import BBox from './BBox.js'

//            <img src={selectedImg} id='mainImg'></img>



class MainImage extends React.Component {

    componentDidMount() {
        window.addEventListener("resize", this.getImgInfo)

        this.getImgInfo();
        setInterval(this.getImgInfo, 100);
    }

    getImgInfo = () => {
        if(this.imgRef.current !== null) {
            const newX = this.imgRef.current.offsetLeft
            const newY = this.imgRef.current.offsetTop
            const newOriginalWidth = this.imgRef.current.naturalWidth
            const newOriginalHeight = this.imgRef.current.naturalHeight
            const newActualWidth = this.imgRef.current.width
            const newActualHeight = this.imgRef.current.height
            
            this.setState({
                imageX: newX,
                imageY: newY,
                originalWidth: newOriginalWidth,
                originalHeight: newOriginalHeight,
                actualWidth: newActualWidth,
                actualHeight: newActualHeight 
            })
        }
    }

    componentDidUpdate() {
        
    }

    constructor() {
        super();
        this.state = {
            selectedImg: defaultImg,
            imageX: 0,
            imageY: 0,
            originalWidth: 0,
            originalHeight: 0,
            actualWidth: 0,
            actualHeight: 0,
            lastPaste: new Date(),
        }
        this.imgRef = React.createRef();
        document.addEventListener('paste', async (event) => {
            const {lastPaste} = this.state;
            if(new Date() - lastPaste < 300) {
                return;
            }
            console.log('pasting');
            const newImg = await window.electronAPI.pasteImage()
            console.log('updating');
            //document.getElementById("mainImg").src = newImg;
            this.setState({
                selectedImg: newImg,
                lastPaste: new Date()
            })
        })
    }

    render() {
        const {
            selectedImg,
            imageX,
            imageY,
            originalHeight,
            originalWidth,
            actualHeight,
            actualWidth,
        } = this.state;
        const {
            blocks
        } = this.props;

        const scale = Math.min(actualHeight / originalHeight, actualWidth / originalWidth)
        const x = imageX + ((actualWidth - originalWidth * scale) / 2)
        const y = imageY + ((actualHeight - originalHeight * scale) / 2)

        const bboxes = blocks.map((block, i) => {
            return (
                <>
                <BBox id={'block_bbox_' + i} image_origin={{x: x, y: y}} verts={block.bbox.vertices} image_scaling={scale} block_index={i}/>
                </>
                )

        })

        return (
            <div>
                <img src={selectedImg} id='mainImg' ref={this.imgRef}></img>
                {bboxes}
            </div>
            
        )
    }
}

export default MainImage;