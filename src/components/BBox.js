import './BBox.css'

import React, { Component } from 'react';

class BBox extends React.Component {

    render() {
        const {verts, image_scaling, image_origin, block_index} = this.props;

        const left = (image_origin.x + image_scaling * verts[0].x)
        const top = (image_origin.y + image_scaling * verts[0].y)

        const width = ((verts[1].x - verts[0].x) * image_scaling)
        const height = ((verts[2].y - verts[1].y) * image_scaling)

        const ref = document.getElementById('block_' + block_index)

        let line = <></>
        if (ref != null) {
            const start_x = (ref.offsetLeft > left) ? (left + width) : left
            const ref_x = (ref.offsetLeft > left) ? ref.offsetLeft : (ref.offsetLeft + ref.offsetWidth);
            const ref_y = ref.offsetTop;
            line = (
                <svg height="200vh" width="200vh" style={{stroke:'blue',strokeWidth:1, zIndex: 3, position: 'absolute', overflow: 'hidden'}}>
                    <line x1={start_x} y1={top} x2={ref_x} y2={ref_y}/>
                </svg>
            )
        }

        return(
            <div style={{overflow: 'hidden'}}>
                <div className='BBox' style={{left: left, top: top, width: width, height: height}}>
                </div>
                {line}
            </div>
        )
    }
}

export default BBox;